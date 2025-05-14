import { db } from '../firebase'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

const rifaId = 'sgQCjRlUNtneuQF5mRQY'
const numeros = [
  2350, 3969, 7240, 1448, 197, 492, 64, 511, 468, 85, 97, 710, 386, 704, 58, 414, 
  418, 724, 578, 479, 98, 162, 129, 498, 122, 396, 698, 2159, 2892, 2622, 38, 477,
  4864, 2781, 92, 4041, 4398, 4535, 5051, 4080, 4560, 173, 2617, 3865, 668, 607,
  2535, 2323, 2567, 2162, 344, 3366, 1687, 5028, 587, 104, 3899, 2908, 1879, 1673,
  4541, 45, 809, 5380, 4089, 4760, 4341, 5164, 2705, 4337, 4319, 5156, 4714, 4325,
  2429, 3916, 983, 1804, 487, 851, 4671, 4685, 2914, 4755, 4939, 2169, 5166, 1018,
  759, 1700, 3461, 1136, 3280, 3338, 1801, 697, 4083, 3370, 1662, 476, 4744, 2,
  1592, 4818, 1340, 1166, 5308, 1570, 2810, 4046
]

export const insertarNumerosRifa = async () => {
  try {
    const rifaRef = doc(db, 'raffles', rifaId)
    
    // Convertimos todos los números a strings con padding de ceros
    const numerosFormateados = numeros.map(num => num.toString())
    
    // Actualizamos el documento agregando los números al array de tickets vendidos
    await updateDoc(rifaRef, {
      soldTickets: arrayUnion(...numerosFormateados)
    })
    
    console.log('Números insertados exitosamente')
  } catch (error) {
    console.error('Error al insertar números:', error)
  }
}

insertarNumerosRifa()