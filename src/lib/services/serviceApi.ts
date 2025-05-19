import { logger } from "$lib/logger";
import type { User } from "$lib/stores";
import type { InscripcionArtistica } from "./inscription.type";

/**
 * Obtener inscripciones según el usuario
 * @param usuario Usuario actual
 * @param tipo Tipo de inscripción a obtener (por defecto 'artistica')
 * @returns Lista de inscripciones filtradas según permisos del usuario
 */
export async function obtenerInscripciones(usuario: User | null, tipo: 'artistica' = 'artistica'): Promise<InscripcionArtistica[]> {
    if (!usuario) return [];

    try {
        // Verificar la información del usuario antes de realizar la solicitud
        console.log("Usuario en obtenerInscripciones:", usuario);
        
        // Llamar al endpoint de API con opciones explícitas para asegurar que las cookies se envíen
        const response = await fetch('/api/inscripciones/listar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Importante: esto asegura que las cookies se envíen con la solicitud
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al obtener inscripciones:", errorData);
            throw new Error(errorData.error || 'Error al obtener inscripciones');
        }
        
        const data = await response.json();
        return data.inscripciones || [];
    } catch (error) {
        logger.error('Error al obtener inscripciones', { error });
        return [];
    }
}

/**
 * Obtener una inscripción por ID
 * @param id ID de la inscripción
 * @returns La inscripción encontrada o null
 */
export async function obtenerInscripcionPorId(id: number): Promise<InscripcionArtistica | null> {
    try {
        // Llamar al endpoint de API con opciones explícitas para asegurar que las cookies se envíen
        const response = await fetch(`/api/inscripciones/detalles/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Importante: esto asegura que las cookies se envíen con la solicitud
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error al obtener inscripción #${id}:`, errorData);
            throw new Error(errorData.error || `Error al obtener inscripción #${id}`);
        }
        
        return await response.json();
    } catch (error) {
        logger.error('Error al obtener inscripción por ID', { id, error });
        throw error;
    }
}
