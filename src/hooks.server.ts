import type { Handle } from '@sveltejs/kit';
import { logger } from '$lib/logger';

export const handle: Handle = async ({ event, resolve }) => {
    // Se podría extender aquí para verificar JWT o sesiones
    try {
        // Verificar si hay una sesión en las cookies
        const userSession = event.cookies.get('user_session');
        
        // Loguear información sobre la solicitud y la cookie para depurar
        logger.info(`Solicitud a: ${event.url.pathname}`, {
            cookie_present: !!userSession,
            cookies: Object.fromEntries(event.cookies.getAll().map(c => [c.name, 'PRESENT']))
        });
        
        if (userSession) {
            try {
                // Decodificar la sesión del usuario
                const user = JSON.parse(userSession);
                logger.info('Usuario en sesión:', { 
                    user_id: user.id,
                    user_email: user.email,
                    es_admin: user.es_admin
                });
                
                // Añadir el usuario a locals para que esté disponible en los endpoints
                event.locals.user = user;
            } catch (e) {
                logger.error('Error al decodificar la sesión del usuario', { error: e });
                // No establecer usuario si hay un error
                event.locals.user = null;
            }
        } else {
            // Sin sesión
            logger.info('No hay sesión de usuario');
            event.locals.user = null;
        }
    } catch (error) {
        logger.error('Error en hook de autenticación', { error });
        event.locals.user = null;
    }

    // Continuar con la resolución normal de la solicitud
    return await resolve(event);
}; 