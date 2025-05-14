import { db } from "../firebase";
import {
    doc,
    updateDoc,
    arrayUnion,
    getDoc
} from "firebase/firestore";

// Función para procesar los tickets vendidos
export const processSoldTickets = (soldTickets) => {
    // Verificar si el array está vacío o es nulo
    if (!soldTickets || soldTickets.length === 0) {
        return [];
    }

    // Convertir cada ticket a string y procesarlo
    return soldTickets.map(ticket => {
        // Si el ticket ya es string, lo retornamos directamente
        if (typeof ticket === 'string') {
            return ticket;
        }
        
        // Si no es string, lo convertimos
        return String(ticket);
    });
};

// Función para agregar un nuevo ticket vendido
export const addSoldTicket = (currentTickets, newTicket) => {
    // Convertir el nuevo ticket a string
    const ticketString = String(newTicket);
    
    // Verificar si el ticket ya existe
    if (currentTickets.includes(ticketString)) {
        return {
            success: false,
            message: 'Este ticket ya está vendido',
            tickets: currentTickets
        };
    }

    // Agregar el nuevo ticket
    const updatedTickets = [...currentTickets, ticketString];
    
    return {
        success: true,
        message: 'Ticket agregado exitosamente',
        tickets: updatedTickets
    };
};

// Función para validar si un ticket está vendido
export const isTicketSold = (soldTickets, ticketNumber) => {
    const ticketString = String(ticketNumber);
    return soldTickets.includes(ticketString);
};

// Función para agregar tickets vendidos a la rifa en Firebase
export const addSoldTicketsToRaffle = async (soldTickets) => {
    try {
        const rifaRef = doc(
            db,
            "raffles",
            "sgQCjRlUNtneuQF5mRQY"
        );

        // Procesar los tickets para asegurar que sean strings
        const processedTickets = processSoldTickets(soldTickets);

        // Obtener el documento actual para verificar duplicados
        const rifaDoc = await getDoc(rifaRef);
        if (!rifaDoc.exists()) {
            throw new Error("La rifa no existe");
        }

        // Actualizar los soldTickets en la rifa
        await updateDoc(rifaRef, {
            soldTickets: arrayUnion(...processedTickets)
        });

        return {
            success: true,
            message: 'Tickets agregados exitosamente',
            addedTickets: processedTickets
        };

    } catch (error) {
        console.error("Error al agregar tickets vendidos:", error);
        return {
            success: false,
            message: 'Error al agregar tickets: ' + error.message,
            error: error
        };
    }
};

// Ejemplo de uso:
/*
const tickets = [1234, 5678, 9012];
addSoldTicketsToRaffle(tickets)
    .then(result => console.log(result))
    .catch(error => console.error(error));
*/ 