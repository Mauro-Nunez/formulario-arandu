import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        // Obtener el usuario de la sesión
        const user = locals.user;
        
        logger.info('Consulta de usuario actual', { 
            is_authenticated: !!user,
            user_id: user?.id
        });
        
        if (!user) {
            return json({ authenticated: false }, { status: 200 });
        }
        
        return json({
            authenticated: true,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                es_admin: user.es_admin,
                disciplina_id: user.disciplina_id,
                disciplina: user.disciplina
            }
        });
    } catch (error) {
        logger.error('Error al verificar usuario actual:', { error });
        return json({ 
            authenticated: false, 
            error: 'Error al verificar la autenticación' 
        }, { status: 500 });
    }
}; 