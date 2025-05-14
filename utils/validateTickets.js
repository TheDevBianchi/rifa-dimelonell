'use server'

import { db } from '../firebase'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import fs from 'fs/promises';
import path from 'path'

const saveValidationToFile = async (data) => {
  try {
    // Crear directorio logs si no existe
    const logsDir = path.join(process.cwd(), 'logs')
    try {
      await fs.access(logsDir)
    } catch {
      await fs.mkdir(logsDir, { recursive: true })
    }

    // Crear nombre del archivo con fecha y hora
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `validation_results_${timestamp}.json`
    const filePath = path.join(logsDir, filename)

    // Formatear los datos para mejor legibilidad
    const jsonString = JSON.stringify({
      validationDate: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      results: data
    }, null, 2)

    // Guardar archivo
    await fs.writeFile(filePath, jsonString, 'utf8')
    console.log(`Archivo de validación guardado en: ${filePath}`)

    // También crear un archivo de resumen
    const summaryPath = path.join(logsDir, 'latest_validation_summary.json')
    const summary = {
      lastValidation: new Date().toISOString(),
      totalRaffles: data.summary.totalRaffles,
      totalUsers: data.summary.totalUsers,
      usersWithDiscrepancies: data.summary.usersWithDiscrepancies,
      totalDiscrepancies: data.totalDiscrepancies,
      globalUserDiscrepancies: data.globalUserDiscrepancies
    }
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8')
    console.log(`Resumen de validación guardado en: ${summaryPath}`)

    return { filename, filePath }
  } catch (error) {
    console.error('Error guardando el archivo de validación:', error)
    throw error
  }
}

// Nueva función para obtener todos los usuarios y sus tickets
const getAllUsersTickets = async () => {
  const rifasRef = collection(db, 'raffles')
  const rifasSnapshot = await getDocs(rifasRef)
  const userTickets = new Map() // Map para almacenar tickets por usuario

  for (const rifaDoc of rifasSnapshot.docs) {
    const rifaData = rifaDoc.data()
    const confirmedUsers = rifaData.users?.filter(user => user.status === 'confirmed') || []

    confirmedUsers.forEach(user => {
      const userKey = `${user.email}|${user.phone}` // Clave única por usuario
      if (!userTickets.has(userKey)) {
        userTickets.set(userKey, {
          email: user.email,
          phone: user.phone,
          name: user.name,
          totalTickets: 0,
          ticketsByRaffle: []
        })
      }

      const userData = userTickets.get(userKey)
      userData.totalTickets += user.selectedTickets?.length || 0
      userData.ticketsByRaffle.push({
        rifaId: rifaDoc.id,
        rifaTitle: rifaData.title,
        tickets: user.selectedTickets || [],
        ticketCount: user.selectedTickets?.length || 0
      })
    })
  }

  return userTickets
}

// Nueva función para validar usuarios globalmente
const validateGlobalUserTickets = async (userTickets) => {
  const results = {
    userDiscrepancies: [],
    totalDiscrepancies: 0
  }

  for (const [userKey, userData] of userTickets) {
    // Obtener el ranking del usuario
    const userRankingRef = collection(db, 'userRanking')
    const userRankingQuery = query(
      userRankingRef,
      where('email', '==', userData.email),
      where('phone', '==', userData.phone)
    )
    
    const userRankingSnapshot = await getDocs(userRankingQuery)
    let totalInRanking = 0

    userRankingSnapshot.docs.forEach(doc => {
      const rankingData = doc.data()
      totalInRanking += rankingData.totalTickets || 0
    })

    if (totalInRanking !== userData.totalTickets) {
      results.userDiscrepancies.push({
        type: 'GLOBAL_USER_MISMATCH',
        userEmail: userData.email,
        userName: userData.name,
        phone: userData.phone,
        totalTicketsInRanking: totalInRanking,
        actualTotalTickets: userData.totalTickets,
        discrepancy: totalInRanking - userData.totalTickets,
        ticketsByRaffle: userData.ticketsByRaffle,
        timestamp: new Date().toISOString()
      })
      results.totalDiscrepancies++
    }
  }

  return results
}

export const validateAllRaffles = async () => {
  console.log('Iniciando validación global de usuarios y rifas')
  const results = {
    rifas: [],
    globalUserDiscrepancies: [],
    totalDiscrepancies: 0,
    timestamp: new Date().toISOString(),
    summary: {
      totalRaffles: 0,
      totalUsers: 0,
      usersWithDiscrepancies: 0,
      rafflesWithDiscrepancies: 0
    }
  }
  
  try {
    // 1. Obtener todos los usuarios y sus tickets
    const userTickets = await getAllUsersTickets()
    results.summary.totalUsers = userTickets.size

    // 2. Validar usuarios globalmente
    const globalValidation = await validateGlobalUserTickets(userTickets)
    results.globalUserDiscrepancies = globalValidation.userDiscrepancies
    results.totalDiscrepancies += globalValidation.totalDiscrepancies
    results.summary.usersWithDiscrepancies = globalValidation.userDiscrepancies.length

    // 3. Validar rifas individuales
    const rifasRef = collection(db, 'raffles')
    const rifasSnapshot = await getDocs(rifasRef)
    results.summary.totalRaffles = rifasSnapshot.docs.length
    
    for (const rifaDoc of rifasSnapshot.docs) {
      const rifaId = rifaDoc.id
      const rifaData = rifaDoc.data()
      
      const rifaResults = await validateRaffleTickets(rifaId, rifaData)
      
      if (rifaResults.discrepancies.length > 0) {
        results.rifas.push({
          rifaId,
          rifaTitle: rifaData.title || 'Sin título',
          totalTickets: parseInt(rifaData.totalTickets) || 0,
          soldTickets: rifaData.soldTickets?.length || 0,
          availableNumbers: rifaData.availableNumbers || 0,
          price: rifaData.price,
          discrepancies: rifaResults.discrepancies,
          totalDiscrepancies: rifaResults.totalDiscrepancies
        })
        results.summary.rafflesWithDiscrepancies++
      }
    }
    
    // Guardar resultados
    await saveValidationToFile(results)
    
    return results
  } catch (error) {
    console.error('Error en la validación global:', error)
    throw error
  }
}

export const validateRaffleTickets = async (rifaId, rifaData) => {
  const results = {
    discrepancies: [],
    totalDiscrepancies: 0,
    usersAffected: []
  }
  
  try {
    // 1. Validar números totales de la rifa
    const totalTickets = parseInt(rifaData.totalTickets) || 0
    const soldTickets = rifaData.soldTickets?.length || 0
    const reservedTickets = rifaData.reservedTickets?.length || 0
    const availableNumbers = rifaData.availableNumbers || 0
    
    const totalAccounted = soldTickets + availableNumbers
    
    if (totalTickets !== totalAccounted) {
      results.discrepancies.push({
        type: 'TOTAL_MISMATCH',
        expected: totalTickets,
        actual: totalAccounted,
        difference: totalTickets - totalAccounted,
        timestamp: new Date().toISOString()
      })
      results.totalDiscrepancies++
    }

    // 2. Validar usuarios confirmados vs tickets vendidos
    const confirmedUsers = rifaData.users?.filter(user => user.status === 'confirmed') || []
    let totalTicketsFromUsers = 0
    
    confirmedUsers.forEach(user => {
      totalTicketsFromUsers += user.selectedTickets?.length || 0
    })

    if (totalTicketsFromUsers !== soldTickets) {
      results.discrepancies.push({
        type: 'SOLD_TICKETS_MISMATCH',
        expectedSold: soldTickets,
        actualFromUsers: totalTicketsFromUsers,
        difference: soldTickets - totalTicketsFromUsers,
        timestamp: new Date().toISOString()
      })
      results.totalDiscrepancies++
    }

    // 3. Validar cada usuario confirmado contra el ranking específico de esta rifa
    for (const user of confirmedUsers) {
      // Obtener tickets reales del usuario en esta rifa
      const actualTickets = user.selectedTickets?.length || 0
      
      // Buscar en el ranking
      const userRankingRef = collection(db, 'userRanking')
      const userRankingQuery = query(
        userRankingRef,
        where('email', '==', user.email),
        where('rifaId', '==', rifaId)
      )
      
      const userRankingSnapshot = await getDocs(userRankingQuery)
      const ticketsInRanking = userRankingSnapshot.empty ? 0 : 
        userRankingSnapshot.docs[0].data().totalTickets || 0

      // Solo registrar discrepancia si hay diferencia Y hay un registro en el ranking
      if (!userRankingSnapshot.empty && ticketsInRanking !== actualTickets) {
        results.discrepancies.push({
          type: 'USER_MISMATCH',
          userId: user.userId || 'N/A',
          userEmail: user.email,
          userName: user.name,
          rifaId,
          rifaTitle: rifaData.title,
          totalInUserRanking: ticketsInRanking,
          actualTicketsCount: actualTickets,
          discrepancy: ticketsInRanking - actualTickets,
          selectedTickets: user.selectedTickets,
          timestamp: new Date().toISOString()
        })
        results.totalDiscrepancies++
        results.usersAffected.push(user.email)
      }
      
      // Si no existe en el ranking pero debería
      if (userRankingSnapshot.empty && actualTickets > 0) {
        results.discrepancies.push({
          type: 'MISSING_IN_RANKING',
          userId: user.userId || 'N/A',
          userEmail: user.email,
          userName: user.name,
          rifaId,
          rifaTitle: rifaData.title,
          actualTicketsCount: actualTickets,
          selectedTickets: user.selectedTickets,
          timestamp: new Date().toISOString()
        })
        results.totalDiscrepancies++
        results.usersAffected.push(user.email)
      }
    }

    // 4. Validar números reservados
    const pendingPurchases = rifaData.pendingPurchases || []
    const totalReservedFromPending = pendingPurchases.reduce((total, purchase) => 
      total + (purchase.selectedTickets?.length || 0), 0
    )

    if (totalReservedFromPending !== reservedTickets) {
      results.discrepancies.push({
        type: 'RESERVED_NUMBERS_MISMATCH',
        expectedReserved: reservedTickets,
        actualReserved: totalReservedFromPending,
        difference: reservedTickets - totalReservedFromPending,
        rifaId,
        rifaTitle: rifaData.title,
        timestamp: new Date().toISOString()
      })
      results.totalDiscrepancies++
    }

    return results
  } catch (error) {
    console.error('Error validando tickets de la rifa:', error)
    throw error
  }
} 