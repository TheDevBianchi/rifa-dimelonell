'use client'

import { useEffect, useState } from 'react'
import { db } from '@/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

function ActiveUsers({ userInfo }) {
  const router = useRouter()
  const [activeUsers, setActiveUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Fetch active users from Firebase
    const fetchActiveUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'activeUsers'))
      const users = querySnapshot.docs.map((doc) => doc.data())
      setActiveUsers(users)
    }

    fetchActiveUsers()
  }, [])

  useEffect(() => {
    // Listen for changes in the current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSaveIP = (ip) => {
    // Save the IP address to Firebase
    const newUser = {
      ip,
      name: '', // You can add a default value or leave it empty
      createdAt: new Date(),
    }

    addDoc(collection(db, 'activeUsers'), newUser)
      .then(() => {
        console.log('IP address saved successfully')
      })
      .catch((error) => {
        console.error('Error saving IP address:', error)
      })
  }

  // Extract user information from the current URL
  const { user } = router.query
  console.log(user)

  return (
    <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
      <h2 className='text-2xl font-bold text-primary mb-4'>Usuarios Activos</h2>
      {currentUser && (
        <div className='mb-4'>
          <p>Usuario Conectado: {currentUser.email}</p>
          <p>IP del Usuario: {currentUser.metadata.ipAddress}</p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeUsers.map((user) => (
            <TableRow key={user.ip}>
              <TableCell>{user.ip}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.createdAt.toLocaleString()}</TableCell>
              <TableCell>
                {/* Add a button to save IP address */}
                <button
                  className='px-2 py-1 text-sm text-white bg-primary rounded'
                  onClick={() => handleSaveIP(user.ip)}>
                  Guardar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ActiveUsers
