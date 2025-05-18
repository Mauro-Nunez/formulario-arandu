import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import { logger } from '$lib/logger';

// Función para formatear inscripción
function formatearInscripcion(inscripcion: any, nombreDisciplina?: string) {
    return {
        id: inscripcion.id,
        nombre: inscripcion.nombre,
        disciplina_id: inscripcion.disciplina_id,
        disciplina: nombreDisciplina,
        email: inscripcion.email,
        telefono: inscripcion.telefono,
        descripcion: inscripcion.descripcion || undefined,
        tipo_contenido: inscripcion.tipo_contenido,
        link_contenido: inscripcion.link_contenido || undefined,
        archivo_contenido: inscripcion.archivo_contenido || undefined,
        estado: inscripcion.estado,
        fecha_creacion: inscripcion.fecha_creacion,
        fecha_modificacion: inscripcion.fecha_modificacion
    };
}

export const GET: RequestHandler = async ({ url, locals }) => {
    try {
        // Obtener el usuario de la sesión
        const usuario = locals.user;
        
        if (!usuario) {
            return json({ error: 'No autorizado' }, { status: 401 });
        }
        
        let inscripciones;

        if (usuario.es_admin) {
            // Los administradores ven todas las inscripciones
            inscripciones = await prisma.inscripciones_artisticas.findMany({
                include: {
                    disciplinas: true
                }
            });
        } else if (usuario.disciplina_id) {
            // Usuarios regulares ven solo las inscripciones de su disciplina
            inscripciones = await prisma.inscripciones_artisticas.findMany({
                where: {
                    disciplina_id: usuario.disciplina_id
                },
                include: {
                    disciplinas: true
                }
            });
        } else {
            return json({ inscripciones: [] });
        }

        // Formatear resultados
        const resultado = inscripciones.map((insc) => {
            return formatearInscripcion(insc, insc.disciplinas.nombre);
        });

        return json({ inscripciones: resultado });
    } catch (error) {
        logger.error('Error al obtener inscripciones', { error });
        
        return json({ 
            error: 'Error al obtener las inscripciones',
            detalles: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
} 