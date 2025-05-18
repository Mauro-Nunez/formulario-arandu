import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async ({ params, locals }) => {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return json({ error: 'ID inválido' }, { status: 400 });
        }

        // Obtener el usuario de la sesión
        const usuario = locals.user;
        
        if (!usuario) {
            return json({ error: 'No autorizado' }, { status: 401 });
        }

        const inscripcion = await prisma.inscripciones_artisticas.findUnique({
            where: { id },
            include: {
                disciplinas: true,
                integrantes: true
            }
        });

        if (!inscripcion) {
            return json({ error: 'Inscripción no encontrada' }, { status: 404 });
        }

        // Verificar autorización: solo admin o usuario de la misma disciplina
        if (!usuario.es_admin && usuario.disciplina_id !== inscripcion.disciplina_id) {
            return json({ error: 'No tiene permiso para ver esta inscripción' }, { status: 403 });
        }

        // Obtener los integrantes por tipo
        const integrantesEnEscena = inscripcion.integrantes.filter(i => i.tipo === 'en_escena');
        const integrantesFueraEscena = inscripcion.integrantes.filter(i => i.tipo === 'fuera_escena');
        const elenco = inscripcion.integrantes.filter(i => i.tipo === 'elenco');
        const integrantes = inscripcion.integrantes.filter(i => i.tipo === 'integrante');
        const colaboradores = inscripcion.integrantes.filter(i => i.tipo === 'colaborador');
        const equipoTecnico = inscripcion.integrantes.filter(i => i.tipo === 'equipo_tecnico');

        const resultado = {
            id: inscripcion.id,
            nombre: inscripcion.nombre,
            disciplina_id: inscripcion.disciplina_id,
            disciplina: inscripcion.disciplinas.nombre,
            email: inscripcion.email,
            telefono: inscripcion.telefono,
            descripcion: inscripcion.descripcion || undefined,
            tipo_contenido: inscripcion.tipo_contenido,
            link_contenido: inscripcion.link_contenido || undefined,
            archivo_contenido: inscripcion.archivo_contenido || undefined,
            estado: inscripcion.estado,
            fecha_creacion: inscripcion.fecha_creacion,
            fecha_modificacion: inscripcion.fecha_modificacion,
            ficha_artistica: inscripcion.ficha_artistica || undefined,
            historia_solista: inscripcion.historia_solista || undefined,
            integrantesEnEscena: integrantesEnEscena.map(ie => ({
                nombre: ie.nombre,
                apellido: ie.apellido,
                dni: ie.dni
            })),
            integrantesFueraEscena: integrantesFueraEscena.map(ife => ({
                rol: ife.rol || '',
                nombre: ife.nombre,
                apellido: ife.apellido,
                dni: ife.dni
            })),
            autor: inscripcion.autor || undefined,
            duracion: inscripcion.duracion || undefined,
            genero: inscripcion.genero || undefined,
            destinatarios: inscripcion.destinatarios || undefined,
            sinopsis: inscripcion.sinopsis || undefined,
            fechaEstreno: inscripcion.fecha_estreno || undefined,
            numeroFunciones: inscripcion.numero_funciones || undefined,
            nombreGrupo: inscripcion.nombre_grupo || undefined,
            elenco: elenco.map(e => ({
                rol: e.rol || '',
                nombre: e.nombre,
                apellido: e.apellido,
                dni: e.dni
            })),
            historia: inscripcion.historia || undefined,
            descripcionMaterial: inscripcion.descripcion_material || undefined,
            integrantes: integrantes.map(i => ({
                nombre: i.nombre,
                apellido: i.apellido,
                dni: i.dni
            })),
            colaboradores: colaboradores.map(c => ({
                rol: c.rol || '',
                nombre: c.nombre,
                apellido: c.apellido,
                dni: c.dni
            })),
            nombreAutor: inscripcion.nombre_autor || undefined,
            apellidoAutor: inscripcion.apellido_autor || undefined,
            dniAutor: inscripcion.dni_autor || undefined,
            tecnica: inscripcion.tecnica || undefined,
            materialEntregado: inscripcion.material_entregado || undefined,
            nombreReferente: inscripcion.nombre_referente || undefined,
            apellidoReferente: inscripcion.apellido_referente || undefined,
            dniReferente: inscripcion.dni_referente || undefined,
            equipoTecnico: equipoTecnico.map(et => ({
                rol: et.rol || '',
                nombre: et.nombre,
                apellido: et.apellido,
                dni: et.dni
            }))
        };

        return json(resultado);
    } catch (error) {
        logger.error('Error al obtener inscripción por ID', { id: params.id, error });
        
        return json({ 
            error: 'Error al obtener los detalles de la inscripción',
            detalles: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
} 