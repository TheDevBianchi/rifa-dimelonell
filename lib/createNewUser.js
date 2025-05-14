import { db } from '../firebase'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

const selectedTickets = [
  5048, 9098, 9820, 9840, 9877, 9926
]

const addUserToRaffle = async () => {
  try {
    const rifaRef = doc(db, 'raffles', 'sgQCjRlUNtneuQF5mRQY')
    
    const userObject = {
      createdAt: new Date().toISOString(),
      email: 'tiendabu2015@gmail.com',
      name: 'Eiser gutierrez',
      paymentMethod: '1736984914919',
      paymentReference: '002339956199',
      phone: '04128320919',
      purchaseDate: new Date().toISOString(),
      raffleId: 'sgQCjRlUNtneuQF5mRQY',
      raffleName: 'CAYENDO Y CORRIENDO',
      rafflePrice: 0.23,
      reservedTickets: [],
      selectedTickets: selectedTickets.map(num => num.toString()),
      status: 'confirmed'
    }

    await updateDoc(rifaRef, {
      users: arrayUnion(userObject),
      soldTickets: arrayUnion(...selectedTickets.map(num => num.toString()))
    })

    console.log('Usuario agregado exitosamente a la rifa')
    return userObject
    
  } catch (error) {
    console.error('Error al agregar usuario:', error)
    throw error
  }
}

// Ejemplo de uso:
/*
addUserToRaffle({
  email: "ejemplo@gmail.com",
  name: "Nombre Ejemplo",
  paymentMethod: "1234567890",
  paymentReference: "0123456789",
  phone: "0412345678",
  selectedTickets: ["1234", "5678"],
  reservedTickets: []
})
*/

export default addUserToRaffle
	