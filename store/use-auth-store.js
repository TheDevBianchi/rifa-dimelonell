import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import Cookies from 'js-cookie'
import { auth } from '@/firebase'

export const useAuthStore = create(set => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null })
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const token = await userCredential.user.getIdToken()

      // Guardar token en localStorage
      localStorage.setItem('auth-token', token)

      set({ user: userCredential.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth)
      localStorage.removeItem('auth-token')
      Cookies.remove('auth-token')
      set({ user: null })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const token = await user.getIdToken()
        localStorage.setItem('auth-token', token)
      } else {
        localStorage.removeItem('auth-token')
      }
      set({ user, loading: false })
    })
    return unsubscribe
  }
}))
