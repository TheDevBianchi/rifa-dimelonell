import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// Tickets que se eliminarán - convertidos a string
const ticketsToDelete = ['1444', '1459', '1601', '1612', '1618', '1863', '2393', '2729', '2741', '2758', '2779', '2895', '3012', '3027', '3037', '3043', '3050', '3075', '3077', '3160', '3220', '356', '3777', '4240', '4300', '4320', '441', '4489', '462', '489', '5008', '5160', '616', '626', '654', '655', '665', '678', '686', '8865']

// ID de la rifa
const raffleId = '1e3axTMqRlyMdYNQ9Jh7'

const deleteUserTickets = async () => {
  try {
    // Obtener referencia y datos de la rifa
    const rifaRef = doc(db, 'raffles', raffleId)
    const rifaSnap = await getDoc(rifaRef)
    
    if (!rifaSnap.exists()) {
      throw new Error('Rifa no encontrada')
    }

    const rifaData = rifaSnap.data()
    
    // Convertir los tickets a buscar a string si no lo están ya
    const ticketsToCheck = ticketsToDelete.map(ticket => ticket.toString())

    // Encontrar al usuario que tenga EXACTAMENTE los tickets que queremos eliminar
    const userIndex = rifaData.users.findIndex(user => {
      const userTickets = user.selectedTickets || []
      return ticketsToCheck.every(ticket => userTickets.includes(ticket))
    })

    if (userIndex === -1) {
      throw new Error('No se encontró un usuario con los tickets especificados')
    }

    const userTickets = rifaData.users[userIndex].selectedTickets

    console.log('Usuario encontrado:', rifaData.users[userIndex])
    console.log('Tickets del usuario:', userTickets)
    console.log('Tickets a eliminar:', ticketsToCheck)

    // Crear copia del array de usuarios
    const updatedUsers = [...rifaData.users]
    
    // Actualizar los tickets del usuario
    const updatedUserTickets = userTickets.filter(
      ticket => !ticketsToDelete.includes(ticket)
    )
    
    // Si el usuario no tiene más tickets, eliminarlo de la lista
    if (updatedUserTickets.length === 0) {
      updatedUsers.splice(userIndex, 1)
      console.log('Usuario eliminado por no tener más tickets')
    } else {
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        selectedTickets: updatedUserTickets
      }
      console.log('Tickets del usuario actualizados')
    }

    // Actualizar soldTickets
    const updatedSoldTickets = rifaData.soldTickets.filter(
      ticket => !ticketsToDelete.includes(ticket)
    )

    // Actualizar la rifa en Firestore
    await updateDoc(rifaRef, {
      users: updatedUsers,
      soldTickets: updatedSoldTickets,
      availableNumbers: rifaData.totalTickets - updatedSoldTickets.length - (rifaData.reservedTickets?.length || 0)
    })

    console.log('Operación completada exitosamente')
    console.log('Tickets eliminados:', ticketsToDelete)
    console.log('Tickets restantes del usuario:', updatedUserTickets)

    return {
      success: true,
      removedTickets: ticketsToDelete,
      remainingTickets: updatedUserTickets,
      message: 'Tickets eliminados correctamente'
    }

  } catch (error) {
    console.error('Error al eliminar tickets:', error)
    throw error
  }
}

// Ejecutar la función
/*
deleteUserTickets()
  .then(result => console.log('Resultado:', result))
  .catch(error => console.error('Error:', error))
*/

export default deleteUserTickets 