import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const verifyTickets = async (raffleId, userData) => {
    try {
        const phone = typeof userData === 'string' ? userData : userData?.phone;

        if (!phone) {
            return {
                success: false,
                message: "Por favor proporciona el teléfono",
                tickets: []
            };
        }

        if (!raffleId) {
            return {
                success: false,
                message: "ID de rifa no proporcionado",
                tickets: []
            };
        }

        // Obtener la rifa específica
        const raffleRef = doc(db, "raffles", raffleId);
        const raffleDoc = await getDoc(raffleRef);

        if (!raffleDoc.exists()) {
            return {
                success: false,
                message: "Rifa no encontrada",
                tickets: []
            };
        }

        const raffle = raffleDoc.data();
        let userTickets = [];

        // Verificar si hay users y es un array
        if (raffle.users && Array.isArray(raffle.users)) {
            // Normalizar los datos de entrada para la búsqueda
            const normalizedPhone = String(phone).replace(/\D/g, ''); // Eliminar caracteres no numéricos

            console.log('Buscando tickets por teléfono:', { normalizedPhone });

            // Buscar coincidencias únicamente por teléfono
            const matchingUsers = raffle.users.filter(user => {
                const userPhone = user.phone?.replace(/\D/g, '') || '';

                return userPhone === normalizedPhone;
            });
            
            console.log(`Se encontraron ${matchingUsers.length} coincidencias por teléfono`);

            // Agregar cada coincidencia encontrada
            matchingUsers.forEach(userFound => {
                userTickets.push({
                    raffleId: raffleDoc.id,
                    raffleName: raffle.title,
                    tickets: userFound.selectedTickets || [],
                    totalAmount: userFound.selectedTickets?.length * raffle.price || 0
                });
            });
        }

        console.log('Tickets encontrados:', userTickets);

        if (userTickets.length === 0) {
            return {
                success: true,
                message: "No se encontraron tickets comprados con este teléfono",
                tickets: []
            };
        }

        return {
            success: true,
            message: "Tickets encontrados exitosamente",
            tickets: userTickets
        };
    } catch (error) {
        console.error("Error al verificar tickets:", error);
        return {
            success: false,
            message: "Error al verificar tickets: " + error.message,
            tickets: []
        };
    }
};
