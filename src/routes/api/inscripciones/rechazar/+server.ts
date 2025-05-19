import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rechazarInscripcionArtistica } from '$lib/server/inscripcionesArtisticas';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        // Verificar que el usuario sea administrador
        const usuario = locals.user;
        if (!usuario || !usuario.es_admin) {
            return json({ 
                success: false, 
                error: 'No tiene permisos para realizar esta acción' 
            }, { status: 403 });
        }

        // Obtener el ID de la inscripción del cuerpo de la solicitud
        const data = await request.json();
        const id = parseInt(data.id);

        if (isNaN(id)) {
            return json({ 
                success: false, 
                error: 'ID de inscripción inválido' 
            }, { status: 400 });
        }

        // Rechazar la inscripción
        const inscripcion = await rechazarInscripcionArtistica(id);

        if (!inscripcion) {
            return json({ 
                success: false, 
                error: 'Inscripción no encontrada' 
            }, { status: 404 });
        }

        // Devolver respuesta exitosa
        return json({ 
            success: true, 
            inscripcion 
        });
    } catch (error) {
        // Registrar el error
        logger.error('Error al rechazar inscripción', { 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
        
        // Devolver error
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error al rechazar la inscripción' 
        }, { status: 500 });
    }
}; 
