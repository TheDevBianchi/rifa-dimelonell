import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const verifyTickets = async (raffleId, userData) => {
    try {
        const { name, email, phone } = userData;

        if (!name || !email || !phone) {
            return {
                success: false,
                message: "Por favor proporciona nombre, correo y teléfono",
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
            const normalizedEmail = email.toLowerCase().trim();
            const normalizedName = name.toLowerCase().trim();
            const normalizedPhone = phone.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            
            console.log('Buscando usuario con:', { normalizedEmail, normalizedName, normalizedPhone });
            
            // Buscar coincidencias con criterios más flexibles
            // Primero intentamos con email (más único) y luego verificamos nombre o teléfono
            const matchingUsers = raffle.users.filter(user => {
                // Normalizar datos del usuario almacenado
                const userEmail = user.email?.toLowerCase().trim() || '';
                const userName = user.name?.toLowerCase().trim() || '';
                const userPhone = user.phone?.replace(/\D/g, '') || '';
                
                console.log('Comparando con usuario:', { userEmail, userName, userPhone });
                
                // Coincidencia por email (principal) y al menos uno de los otros campos
                const emailMatches = userEmail === normalizedEmail;
                const nameMatches = userName === normalizedName;
                const phoneMatches = userPhone === normalizedPhone;
                
                return emailMatches && (nameMatches || phoneMatches);
            });
            
            console.log(`Se encontraron ${matchingUsers.length} coincidencias`);

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
                message: "No se encontraron tickets comprados con estos datos",
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
