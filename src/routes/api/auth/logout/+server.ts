import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ cookies }) => {
    try {
        // Eliminar la cookie de sesión
        cookies.delete('user_session', { path: '/' });
        
        logger.info('Usuario cerró sesión correctamente');
        return json({ success: true });
    } catch (error) {
        logger.error('Error al cerrar sesión:', { error });
        return json({ error: 'Error al cerrar sesión' }, { status: 500 });
    }
}; 