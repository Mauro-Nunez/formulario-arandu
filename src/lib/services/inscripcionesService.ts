import { prisma } from '../prisma';
import type { User } from '../stores';
import { logger, LogLevel } from '../logger';

/**
 * Interfaz para datos de inscripción artística
 */
export interface InscripcionArtistica {
    id?: number;
    nombre: string;
    disciplina_id: number;
    disciplina?: string;
    email: string;
    telefono: string;
    descripcion?: string;
    tipo_contenido: 'archivo' | 'link';
    link_contenido?: string;
    archivo_contenido?: string;
    estado?: 'pendiente' | 'aprobado' | 'rechazado';
    usuario_id: number;
    fecha_creacion?: Date | string;
    fecha_modificacion?: Date | string;
    
    // Campos específicos por disciplina
    ficha_artistica?: string;
    historia_solista?: string;
    integrantesEnEscena?: { nombre: string, apellido: string, dni: string }[];
    integrantesFueraEscena?: { rol: string, nombre: string, apellido: string, dni: string }[];
    
    autor?: string;
    duracion?: string;
    genero?: string;
    destinatarios?: string;
    sinopsis?: string;
    fechaEstreno?: Date | string;
    numeroFunciones?: string;
    nombreGrupo?: string;
    elenco?: { rol: string, nombre: string, apellido: string, dni: string }[];
    
    historia?: string;
    descripcionMaterial?: string;
    integrantes?: { nombre: string, apellido: string, dni: string }[];
    colaboradores?: { rol: string, nombre: string, apellido: string, dni: string }[];
    
    nombreAutor?: string;
    apellidoAutor?: string;
    dniAutor?: string;
    tecnica?: string;
    materialEntregado?: string;
    
    nombreReferente?: string;
    apellidoReferente?: string;
    dniReferente?: string;
    equipoTecnico?: { rol: string, nombre: string, apellido: string, dni: string }[];
}

/**
 * Guarda una inscripción artística en la base de datos
 * @param inscripcion Datos de la inscripción artística
 * @returns La inscripción creada con ID
 */
export async function guardarInscripcionArtistica(inscripcion: InscripcionArtistica): Promise<InscripcionArtistica> {
    try {
        // Log de inicio de operación
        logger.info('Iniciando guardado de inscripción en base de datos', {
            disciplina_id: inscripcion.disciplina_id,
            nombre: inscripcion.nombre
        });

        // Crear inscripción usando prisma en una transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // Crear la inscripción principal
            const inscripcionCreada = await tx.inscripciones_artisticas.create({
                data: {
                    nombre: inscripcion.nombre,
                    disciplina_id: inscripcion.disciplina_id,
                    email: inscripcion.email,
                    telefono: inscripcion.telefono,
                    descripcion: inscripcion.descripcion || null,
                    tipo_contenido: inscripcion.tipo_contenido,
                    link_contenido: inscripcion.link_contenido || null,
                    archivo_contenido: inscripcion.archivo_contenido || null,
                    usuario_id: inscripcion.usuario_id,
                    ficha_artistica: inscripcion.ficha_artistica || null,
                    historia_solista: inscripcion.historia_solista || null,
                    autor: inscripcion.autor || null,
                    duracion: inscripcion.duracion || null,
                    genero: inscripcion.genero || null,
                    destinatarios: inscripcion.destinatarios || null,
                    sinopsis: inscripcion.sinopsis || null,
                    fecha_estreno: inscripcion.fechaEstreno ? new Date(inscripcion.fechaEstreno) : null,
                    numero_funciones: inscripcion.numeroFunciones || null,
                    nombre_grupo: inscripcion.nombreGrupo || null,
                    es_concertado: inscripcion.elenco?.length ? true : false,
                    historia: inscripcion.historia || null,
                    descripcion_material: inscripcion.descripcionMaterial || null,
                    nombre_autor: inscripcion.nombreAutor || null,
                    apellido_autor: inscripcion.apellidoAutor || null,
                    dni_autor: inscripcion.dniAutor || null,
                    tecnica: inscripcion.tecnica || null,
                    material_entregado: inscripcion.materialEntregado || null,
                    nombre_referente: inscripcion.nombreReferente || null,
                    apellido_referente: inscripcion.apellidoReferente || null,
                    dni_referente: inscripcion.dniReferente || null
                }
            });

            // Crear integrantes en escena si hay
            if (inscripcion.integrantesEnEscena?.length) {
                await Promise.all(inscripcion.integrantesEnEscena.map(integrante => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'en_escena',
                            nombre: integrante.nombre,
                            apellido: integrante.apellido,
                            dni: integrante.dni
                        }
                    })
                ));
            }

            // Crear integrantes fuera de escena si hay
            if (inscripcion.integrantesFueraEscena?.length) {
                await Promise.all(inscripcion.integrantesFueraEscena.map(integrante => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'fuera_escena',
                            rol: integrante.rol,
                            nombre: integrante.nombre,
                            apellido: integrante.apellido,
                            dni: integrante.dni
                        }
                    })
                ));
            }

            // Crear elenco si hay
            if (inscripcion.elenco?.length) {
                await Promise.all(inscripcion.elenco.map(miembro => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'elenco',
                            rol: miembro.rol,
                            nombre: miembro.nombre,
                            apellido: miembro.apellido,
                            dni: miembro.dni
                        }
                    })
                ));
            }

            // Crear integrantes si hay
            if (inscripcion.integrantes?.length) {
                await Promise.all(inscripcion.integrantes.map(integrante => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'integrante',
                            nombre: integrante.nombre,
                            apellido: integrante.apellido,
                            dni: integrante.dni
                        }
                    })
                ));
            }

            // Crear colaboradores si hay
            if (inscripcion.colaboradores?.length) {
                await Promise.all(inscripcion.colaboradores.map(colaborador => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'colaborador',
                            rol: colaborador.rol,
                            nombre: colaborador.nombre,
                            apellido: colaborador.apellido,
                            dni: colaborador.dni
                        }
                    })
                ));
            }

            // Crear equipo técnico si hay
            if (inscripcion.equipoTecnico?.length) {
                await Promise.all(inscripcion.equipoTecnico.map(tecnico => 
                    tx.integrantes_inscripcion.create({
                        data: {
                            inscripcion_id: inscripcionCreada.id,
                            tipo: 'equipo_tecnico',
                            rol: tecnico.rol,
                            nombre: tecnico.nombre,
                            apellido: tecnico.apellido,
                            dni: tecnico.dni
                        }
                    })
                ));
            }

            // Registrar el log en la base de datos
            await tx.logs_sistema.create({
                data: {
                    nivel: 'INFO',
                    mensaje: `Nueva inscripción creada: ${inscripcion.nombre}`,
                    detalles: {
                        id: inscripcionCreada.id,
                        disciplina_id: inscripcionCreada.disciplina_id
                    }
                }
            });

            return inscripcionCreada;
        });

        // Consultar la disciplina para el nombre
        const disciplina = await prisma.disciplinas.findUnique({
            where: { id: resultado.disciplina_id }
        });

        // Formatear el resultado para devolverlo
        return {
            id: resultado.id,
            nombre: resultado.nombre,
            disciplina_id: resultado.disciplina_id,
            disciplina: disciplina?.nombre,
            email: resultado.email,
            telefono: resultado.telefono,
            descripcion: resultado.descripcion || undefined,
            tipo_contenido: resultado.tipo_contenido as ('archivo' | 'link'),
            link_contenido: resultado.link_contenido || undefined,
            archivo_contenido: resultado.archivo_contenido || undefined,
            estado: resultado.estado as ('pendiente' | 'aprobado' | 'rechazado'),
            usuario_id: resultado.usuario_id,
            fecha_creacion: resultado.fecha_creacion,
            fecha_modificacion: resultado.fecha_modificacion,
            ficha_artistica: resultado.ficha_artistica || undefined,
            historia_solista: resultado.historia_solista || undefined,
            autor: resultado.autor || undefined,
            duracion: resultado.duracion || undefined,
            genero: resultado.genero || undefined,
            destinatarios: resultado.destinatarios || undefined,
            sinopsis: resultado.sinopsis || undefined,
            fechaEstreno: resultado.fecha_estreno || undefined,
            numeroFunciones: resultado.numero_funciones || undefined,
            nombreGrupo: resultado.nombre_grupo || undefined,
            historia: resultado.historia || undefined,
            descripcionMaterial: resultado.descripcion_material || undefined,
            nombreAutor: resultado.nombre_autor || undefined,
            apellidoAutor: resultado.apellido_autor || undefined,
            dniAutor: resultado.dni_autor || undefined,
            tecnica: resultado.tecnica || undefined,
            materialEntregado: resultado.material_entregado || undefined,
            nombreReferente: resultado.nombre_referente || undefined,
            apellidoReferente: resultado.apellido_referente || undefined,
            dniReferente: resultado.dni_referente || undefined
        };
    } catch (error) {
        // Registrar el error
        logger.error('Error al guardar inscripción en base de datos', {
            error,
            inscripcion
        });

        // Guardar el error en la base de datos
        try {
            await prisma.logs_sistema.create({
                data: {
                    nivel: 'ERROR',
                    mensaje: 'Error al guardar inscripción artística',
                    detalles: {
                        error: error instanceof Error ? error.message : 'Error desconocido',
                        nombre: inscripcion.nombre,
                        disciplina_id: inscripcion.disciplina_id
                    }
                }
            });
        } catch (logError) {
            console.error('Error al registrar el error en la base de datos:', logError);
        }

        throw error;
    }
}

/**
 * Aprobar una inscripción artística
 * @param id ID de la inscripción
 * @returns La inscripción actualizada o null si no existe
 */
export async function aprobarInscripcionArtistica(id: number): Promise<InscripcionArtistica | null> {
    try {
        const inscripcion = await prisma.inscripciones_artisticas.findUnique({
            where: { id }
        });

        if (!inscripcion) return null;

        const inscripcionActualizada = await prisma.inscripciones_artisticas.update({
            where: { id },
            data: {
                estado: 'aprobado',
                fecha_modificacion: new Date()
            }
        });

        // Registrar el log
        await prisma.logs_sistema.create({
            data: {
                nivel: 'INFO',
                mensaje: `Inscripción #${id} aprobada`,
                detalles: {
                    id,
                    disciplina_id: inscripcionActualizada.disciplina_id
                }
            }
        });

        // Consultar la disciplina para el nombre
        const disciplina = await prisma.disciplinas.findUnique({
            where: { id: inscripcionActualizada.disciplina_id }
        });

        return formatearInscripcion(inscripcionActualizada, disciplina?.nombre);
    } catch (error) {
        logger.error('Error al aprobar inscripción', { id, error });
        
        // Guardar el error en la base de datos
        try {
            await prisma.logs_sistema.create({
                data: {
                    nivel: 'ERROR',
                    mensaje: `Error al aprobar inscripción #${id}`,
                    detalles: {
                        error: error instanceof Error ? error.message : 'Error desconocido'
                    }
                }
            });
        } catch (logError) {
            console.error('Error al registrar el error en la base de datos:', logError);
        }

        throw error;
    }
}

/**
 * Rechazar una inscripción artística
 * @param id ID de la inscripción
 * @returns La inscripción actualizada o null si no existe
 */
export async function rechazarInscripcionArtistica(id: number): Promise<InscripcionArtistica | null> {
    try {
        const inscripcion = await prisma.inscripciones_artisticas.findUnique({
            where: { id }
        });

        if (!inscripcion) return null;

        const inscripcionActualizada = await prisma.inscripciones_artisticas.update({
            where: { id },
            data: {
                estado: 'rechazado',
                fecha_modificacion: new Date()
            }
        });

        // Registrar el log
        await prisma.logs_sistema.create({
            data: {
                nivel: 'INFO',
                mensaje: `Inscripción #${id} rechazada`,
                detalles: {
                    id,
                    disciplina_id: inscripcionActualizada.disciplina_id
                }
            }
        });

        // Consultar la disciplina para el nombre
        const disciplina = await prisma.disciplinas.findUnique({
            where: { id: inscripcionActualizada.disciplina_id }
        });

        return formatearInscripcion(inscripcionActualizada, disciplina?.nombre);
    } catch (error) {
        logger.error('Error al rechazar inscripción', { id, error });
        
        // Guardar el error en la base de datos
        try {
            await prisma.logs_sistema.create({
                data: {
                    nivel: 'ERROR',
                    mensaje: `Error al rechazar inscripción #${id}`,
                    detalles: {
                        error: error instanceof Error ? error.message : 'Error desconocido'
                    }
                }
            });
        } catch (logError) {
            console.error('Error al registrar el error en la base de datos:', logError);
        }

        throw error;
    }
}

/**
 * Obtener inscripciones según el usuario
 * @param usuario Usuario actual
 * @param tipo Tipo de inscripción a obtener (por defecto 'artistica')
 * @returns Lista de inscripciones filtradas según permisos del usuario
 */
export async function obtenerInscripciones(usuario: User | null, tipo: 'artistica' = 'artistica'): Promise<InscripcionArtistica[]> {
    if (!usuario) return [];

    try {
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
            return [];
        }

        // Formatear resultados
        return Promise.all(inscripciones.map(async (insc) => {
            return formatearInscripcion(insc, insc.disciplinas.nombre);
        }));
    } catch (error) {
        logger.error('Error al obtener inscripciones', { error });
        
        // Guardar el error en la base de datos
        try {
            await prisma.logs_sistema.create({
                data: {
                    nivel: 'ERROR',
                    mensaje: 'Error al obtener listado de inscripciones',
                    detalles: {
                        error: error instanceof Error ? error.message : 'Error desconocido'
                    }
                }
            });
        } catch (logError) {
            console.error('Error al registrar el error en la base de datos:', logError);
        }

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
        const inscripcion = await prisma.inscripciones_artisticas.findUnique({
            where: { id },
            include: {
                disciplinas: true,
                integrantes: true
            }
        });

        if (!inscripcion) return null;

        // Obtener los integrantes por tipo
        const integrantesEnEscena = inscripcion.integrantes.filter(i => i.tipo === 'en_escena');
        const integrantesFueraEscena = inscripcion.integrantes.filter(i => i.tipo === 'fuera_escena');
        const elenco = inscripcion.integrantes.filter(i => i.tipo === 'elenco');
        const integrantes = inscripcion.integrantes.filter(i => i.tipo === 'integrante');
        const colaboradores = inscripcion.integrantes.filter(i => i.tipo === 'colaborador');
        const equipoTecnico = inscripcion.integrantes.filter(i => i.tipo === 'equipo_tecnico');

        return {
            id: inscripcion.id,
            nombre: inscripcion.nombre,
            disciplina_id: inscripcion.disciplina_id,
            disciplina: inscripcion.disciplinas.nombre,
            email: inscripcion.email,
            telefono: inscripcion.telefono,
            descripcion: inscripcion.descripcion || undefined,
            tipo_contenido: inscripcion.tipo_contenido as 'archivo' | 'link',
            link_contenido: inscripcion.link_contenido || undefined,
            archivo_contenido: inscripcion.archivo_contenido || undefined,
            estado: inscripcion.estado as 'pendiente' | 'aprobado' | 'rechazado',
            usuario_id: inscripcion.usuario_id,
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
    } catch (error) {
        logger.error('Error al obtener inscripción por ID', { id, error });
        
        // Guardar el error en la base de datos
        try {
            await prisma.logs_sistema.create({
                data: {
                    nivel: 'ERROR',
                    mensaje: `Error al obtener inscripción #${id}`,
                    detalles: {
                        error: error instanceof Error ? error.message : 'Error desconocido'
                    }
                }
            });
        } catch (logError) {
            console.error('Error al registrar el error en la base de datos:', logError);
        }

        throw error;
    }
}

// Función auxiliar para formatear inscripción
function formatearInscripcion(inscripcion: any, nombreDisciplina?: string): InscripcionArtistica {
    return {
        id: inscripcion.id,
        nombre: inscripcion.nombre,
        disciplina_id: inscripcion.disciplina_id,
        disciplina: nombreDisciplina,
        email: inscripcion.email,
        telefono: inscripcion.telefono,
        descripcion: inscripcion.descripcion || undefined,
        tipo_contenido: inscripcion.tipo_contenido as 'archivo' | 'link',
        link_contenido: inscripcion.link_contenido || undefined,
        archivo_contenido: inscripcion.archivo_contenido || undefined,
        estado: inscripcion.estado as 'pendiente' | 'aprobado' | 'rechazado',
        usuario_id: inscripcion.usuario_id,
        fecha_creacion: inscripcion.fecha_creacion,
        fecha_modificacion: inscripcion.fecha_modificacion,
        ficha_artistica: inscripcion.ficha_artistica || undefined,
        historia_solista: inscripcion.historia_solista || undefined,
        autor: inscripcion.autor || undefined,
        duracion: inscripcion.duracion || undefined,
        genero: inscripcion.genero || undefined,
        destinatarios: inscripcion.destinatarios || undefined,
        sinopsis: inscripcion.sinopsis || undefined,
        fechaEstreno: inscripcion.fecha_estreno || undefined,
        numeroFunciones: inscripcion.numero_funciones || undefined,
        nombreGrupo: inscripcion.nombre_grupo || undefined,
        historia: inscripcion.historia || undefined,
        descripcionMaterial: inscripcion.descripcion_material || undefined,
        nombreAutor: inscripcion.nombre_autor || undefined,
        apellidoAutor: inscripcion.apellido_autor || undefined,
        dniAutor: inscripcion.dni_autor || undefined,
        tecnica: inscripcion.tecnica || undefined,
        materialEntregado: inscripcion.material_entregado || undefined,
        nombreReferente: inscripcion.nombre_referente || undefined,
        apellidoReferente: inscripcion.apellido_referente || undefined,
        dniReferente: inscripcion.dni_referente || undefined
    };
} 