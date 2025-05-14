import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'Fecha no disponible';

  try {
    let jsDate;

    // Si es un timestamp de Firestore
    if (date?.seconds) {
      jsDate = new Date(date.seconds * 1000);
    }
    // Si es una fecha en formato ISO string
    else if (typeof date === 'string') {
      jsDate = new Date(date);
    }
    // Si ya es un objeto Date
    else if (date instanceof Date) {
      jsDate = date;
    }
    // Si tiene método toDate (Timestamp de Firestore)
    else if (date?.toDate instanceof Function) {
      jsDate = date.toDate();
    }
    else {
      return 'Formato de fecha inválido';
    }

    // Verificar si la fecha es válida
    if (isNaN(jsDate.getTime())) {
      return 'Fecha inválida';
    }

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Caracas' // UTC-4
    }).format(jsDate) + ' UTC-4';

  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Error al formatear fecha';
  }
}

export const getInitialDate = (dateValue) => {
  if (!dateValue) return null

  // Si es un timestamp de Firestore
  if (dateValue?.toDate instanceof Function) {
    return dateValue.toDate()
  }

  // Si es un objeto Date
  if (dateValue instanceof Date) {
    return dateValue
  }

  // Si es un timestamp en segundos
  if (dateValue?.seconds) {
    return new Date(dateValue.seconds * 1000)
  }

  // Si es un string o número, intentar convertir
  try {
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}