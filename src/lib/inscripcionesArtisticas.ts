import type { Inscripcion } from './inscripciones';
import { logger, LogLevel } from './logger';
import * as db from './db';
import type { User } from './stores';

/**
 * Guarda una inscripción artística en la base de datos
 * @param inscripcion Datos de la inscripción artística
 * @returns La inscripción creada con ID
 */
export async function guardarInscripcionArtistica(inscripcion: Partial<Inscripcion>): Promise<Inscripcion> {
    try {
        // Log de inicio de operación
        logger.info('Iniciando guardado de inscripción en base de datos', {
            disciplina: inscripcion.disciplina,
            nombre: inscripcion.nombre
        });

        // Preparar datos para tabla principal
        const inscripcionData = {
            nombre: inscripcion.nombre,
            disciplina_id: inscripcion.disciplina_id,
            email: inscripcion.email,
            telefono: inscripcion.telefono,
            descripcion: inscripcion.descripcion,
            tipo_contenido: inscripcion.tipoContenido,
            link_contenido: inscripcion.linkContenido,
            archivo_contenido: inscripcion.archivoContenido,
            // usuario_id: inscripcion.usuario_id,
            // Campos específicos según disciplina
            ficha_artistica: inscripcion.fichaArtistica,
            historia_solista: inscripcion.historiaSolista,
            autor: inscripcion.autor,
            duracion: inscripcion.duracion,
            genero: inscripcion.genero,
            destinatarios: inscripcion.destinatarios,
            sinopsis: inscripcion.sinopsis,
            fecha_estreno: inscripcion.fechaEstreno,
            numero_funciones: inscripcion.numeroFunciones,
            nombre_grupo: inscripcion.nombreGrupo,
            es_concertado: inscripcion.elenco ? true : false,
            historia: inscripcion.historia,
            descripcion_material: inscripcion.descripcionMaterial,
            nombre_autor: inscripcion.nombreAutor,
            apellido_autor: inscripcion.apellidoAutor,
            dni_autor: inscripcion.dniAutor,
            tecnica: inscripcion.tecnica,
            nombre_referente: inscripcion.nombreReferente,
            apellido_referente: inscripcion.apellidoReferente,
            dni_referente: inscripcion.dniReferente,
            declaracion_jurada: inscripcion.declaracionJurada,
            responsableNombre: inscripcion.responsableNombre,
            responsableApellido: inscripcion.responsableApellido,
            responsableTelefono: inscripcion.responsableTelefono,
            responsableEmail: inscripcion.responsableEmail
        };

        // Usar transacción para mantener consistencia
        return await db.transaction(async (connection) => {
            // Insertar inscripción
            const inscripcionId = await db.insert('inscripciones_artisticas', inscripcionData);
            
            // Insertar integrantes en escena si hay
            if (inscripcion.integrantesEnEscena && inscripcion.integrantesEnEscena.length > 0) {
                for (const integrante of inscripcion.integrantesEnEscena) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'en_escena',
                        nombre: integrante.nombre,
                        apellido: integrante.apellido,
                        dni: integrante.dni
                    });
                }
            }
            
            // Insertar integrantes fuera de escena si hay
            if (inscripcion.integrantesFueraEscena && inscripcion.integrantesFueraEscena.length > 0) {
                for (const integrante of inscripcion.integrantesFueraEscena) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'fuera_escena',
                        rol: integrante.rol,
                        nombre: integrante.nombre,
                        apellido: integrante.apellido,
                        dni: integrante.dni
                    });
                }
            }
            
            // Insertar elenco si hay
            if (inscripcion.elenco && inscripcion.elenco.length > 0) {
                for (const miembro of inscripcion.elenco) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'elenco',
                        rol: miembro.rol,
                        nombre: miembro.nombre,
                        apellido: miembro.apellido,
                        dni: miembro.dni
                    });
                }
            }
            
            // Insertar integrantes si hay
            if (inscripcion.integrantes && inscripcion.integrantes.length > 0) {
                for (const integrante of inscripcion.integrantes) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'integrante',
                        nombre: integrante.nombre,
                        apellido: integrante.apellido,
                        dni: integrante.dni
                    });
                }
            }
            
            // Insertar colaboradores si hay
            if (inscripcion.colaboradores && inscripcion.colaboradores.length > 0) {
                for (const colaborador of inscripcion.colaboradores) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'colaborador',
                        rol: colaborador.rol,
                        nombre: colaborador.nombre,
                        apellido: colaborador.apellido,
                        dni: colaborador.dni
                    });
                }
            }
            
            // Insertar equipo técnico si hay
            if (inscripcion.equipoTecnico && inscripcion.equipoTecnico.length > 0) {
                for (const tecnico of inscripcion.equipoTecnico) {
                    await db.insert('integrantes_inscripcion', {
                        inscripcion_id: inscripcionId,
                        tipo: 'equipo_tecnico',
                        rol: tecnico.rol,
                        nombre: tecnico.nombre,
                        apellido: tecnico.apellido,
                        dni: tecnico.dni
                    });
                }
            }
            
            // Consultar la inscripción completa
            const inscripcionCompletaData = await db.getById('inscripciones_artisticas', inscripcionId);
            
            // Formatear los datos para retornar
            const inscripcionCompleta: Inscripcion = {
                id: inscripcionCompletaData.id,
                nombre: inscripcionCompletaData.nombre,
                disciplina: getDisciplinaNombre(inscripcionCompletaData.disciplina_id),
                disciplina_id: inscripcionCompletaData.disciplina_id,
                email: inscripcionCompletaData.email,
                telefono: inscripcionCompletaData.telefono,
                descripcion: inscripcionCompletaData.descripcion,
                tipoContenido: inscripcionCompletaData.tipo_contenido as 'archivo' | 'link',
                linkContenido: inscripcionCompletaData.link_contenido,
                archivoContenido: inscripcionCompletaData.archivo_contenido,
                fecha_creacion: inscripcionCompletaData.fecha_creacion,
                fecha_modificacion: inscripcionCompletaData.fecha_modificacion,
                estado: inscripcionCompletaData.estado as 'pendiente' | 'aprobado' | 'rechazado',
                usuario_id: inscripcionCompletaData.usuario_id,
                
                // Campos específicos
                fichaArtistica: inscripcionCompletaData.ficha_artistica,
                historiaSolista: inscripcionCompletaData.historia_solista,
                autor: inscripcionCompletaData.autor,
                duracion: inscripcionCompletaData.duracion,
                genero: inscripcionCompletaData.genero,
                destinatarios: inscripcionCompletaData.destinatarios,
                sinopsis: inscripcionCompletaData.sinopsis,
                fechaEstreno: inscripcionCompletaData.fecha_estreno,
                numeroFunciones: inscripcionCompletaData.numero_funciones,
                nombreGrupo: inscripcionCompletaData.nombre_grupo,
                historia: inscripcionCompletaData.historia,
                descripcionMaterial: inscripcionCompletaData.descripcion_material,
                nombreAutor: inscripcionCompletaData.nombre_autor,
                apellidoAutor: inscripcionCompletaData.apellido_autor,
                dniAutor: inscripcionCompletaData.dni_autor,
                tecnica: inscripcionCompletaData.tecnica,
                nombreReferente: inscripcionCompletaData.nombre_referente,
                apellidoReferente: inscripcionCompletaData.apellido_referente,
                dniReferente: inscripcionCompletaData.dni_referente
            };
            
            // Guardar log de éxito
            logger.info('Inscripción guardada correctamente en base de datos', {
                id: inscripcionCompleta.id,
                disciplina: inscripcionCompleta.disciplina
            });
            
            // Registrar en la tabla de logs
            await db.insertLog(LogLevel.INFO, 'Inscripción artística guardada', {
                id: inscripcionCompleta.id,
                disciplina: inscripcionCompleta.disciplina
            });
            
            return inscripcionCompleta;
        });
        
    } catch (error) {
        // Registrar error
        logger.error('Error al guardar inscripción en base de datos', { 
            error,
            inscripcion
        });
        
        // Registrar en la tabla de logs
        await db.insertLog(LogLevel.ERROR, 'Error al guardar inscripción artística', {
            error: error instanceof Error ? error.message : 'Error desconocido',
            nombre: inscripcion.nombre,
            disciplina: inscripcion.disciplina
        });
        
        throw error;
    }
}

/**
 * Aprobar una inscripción artística
 * @param id ID de la inscripción
 * @returns La inscripción actualizada o undefined si no existe
 */
export async function aprobarInscripcionArtistica(id: number): Promise<Inscripcion | undefined> {
    try {
        const inscripcion = await db.getById('inscripciones_artisticas', id);
        if (!inscripcion) return undefined;
        
        // Crear la fecha en formato MySQL: YYYY-MM-DD HH:MM:SS
        const ahora = new Date();
        const fechaFormateada = ahora.toISOString().slice(0, 19).replace('T', ' ');
        
        await db.update('inscripciones_artisticas', id, { 
            estado: 'aprobado',
            fecha_modificacion: fechaFormateada
        });
        
        const inscripcionActualizada = await db.getById('inscripciones_artisticas', id);
        
        // Registrar log
        await db.insertLog(LogLevel.INFO, `Inscripción #${id} aprobada`, {
            id,
            disciplina: getDisciplinaNombre(inscripcionActualizada.disciplina_id)
        });
        
        return formatearInscripcion(inscripcionActualizada);
    } catch (error) {
        logger.error('Error al aprobar inscripción', { id, error });
        await db.insertLog(LogLevel.ERROR, `Error al aprobar inscripción #${id}`, { error });
        throw error;
    }
}

/**
 * Rechazar una inscripción artística
 * @param id ID de la inscripción
 * @returns La inscripción actualizada o undefined si no existe
 */
export async function rechazarInscripcionArtistica(id: number): Promise<Inscripcion | undefined> {
    try {
        const inscripcion = await db.getById('inscripciones_artisticas', id);
        if (!inscripcion) return undefined;
        
        // Crear la fecha en formato MySQL: YYYY-MM-DD HH:MM:SS
        const ahora = new Date();
        const fechaFormateada = ahora.toISOString().slice(0, 19).replace('T', ' ');
        
        await db.update('inscripciones_artisticas', id, { 
            estado: 'rechazado',
            fecha_modificacion: fechaFormateada
        });
        
        const inscripcionActualizada = await db.getById('inscripciones_artisticas', id);
        
        // Registrar log
        await db.insertLog(LogLevel.INFO, `Inscripción #${id} rechazada`, {
            id,
            disciplina: getDisciplinaNombre(inscripcionActualizada.disciplina_id)
        });
        
        return formatearInscripcion(inscripcionActualizada);
    } catch (error) {
        logger.error('Error al rechazar inscripción', { id, error });
        await db.insertLog(LogLevel.ERROR, `Error al rechazar inscripción #${id}`, { error });
        throw error;
    }
}

/**
 * Obtener inscripciones según el usuario
 * @param usuario Usuario actual
 * @returns Lista de inscripciones filtradas según permisos del usuario
 */
export async function obtenerInscripciones(usuario: User | null): Promise<Inscripcion[]> {
    if (!usuario) return [];
    
    try {
        let inscripcionesData = [];
        
        if (usuario.es_admin) {
            // Los administradores ven todas las inscripciones
            inscripcionesData = await db.query('SELECT * FROM inscripciones_artisticas');
        } else if (usuario.disciplina_id) {
            // Usuarios regulares ven solo las inscripciones de su disciplina
            inscripcionesData = await db.getByConditions('inscripciones_artisticas', {
                disciplina_id: usuario.disciplina_id
            });
        }
        
        // Formatear resultados
        const inscripciones = await Promise.all(inscripcionesData.map(async (insc) => {
            return formatearInscripcion(insc);
        }));
        
        // Ordenar por fecha de creación (más recientes primero)
        return inscripciones.sort((a, b) => 
            new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );
    } catch (error) {
        logger.error('Error al obtener inscripciones', { error });
        await db.insertLog(LogLevel.ERROR, 'Error al obtener listado de inscripciones', { error });
        return [];
    }
}

/**
 * Obtener una inscripción por ID
 * @param id ID de la inscripción
 * @returns La inscripción encontrada o undefined
 */
export async function obtenerInscripcionPorId(id: number): Promise<Inscripcion | undefined> {
    try {
        const inscripcion = await db.getById('inscripciones_artisticas', id);
        if (!inscripcion) return undefined;
        
        return await formatearInscripcion(inscripcion);
    } catch (error) {
        logger.error('Error al obtener inscripción por ID', { id, error });
        await db.insertLog(LogLevel.ERROR, `Error al obtener inscripción #${id}`, { error });
        throw error;
    }
}

// Función auxiliar para formatear inscripción desde la BD
async function formatearInscripcion(inscripcionData: any): Promise<Inscripcion> {
    // Obtener integrantes relacionados
    const integrantesEnEscena = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'en_escena'
    });
    
    const integrantesFueraEscena = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'fuera_escena'
    });
    
    const elenco = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'elenco'
    });
    
    const integrantes = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'integrante'
    });
    
    const colaboradores = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'colaborador'
    });
    
    const equipoTecnico = await db.getByConditions('integrantes_inscripcion', {
        inscripcion_id: inscripcionData.id,
        tipo: 'equipo_tecnico'
    });
    
    // Mapear los datos al formato esperado
    return {
        id: inscripcionData.id,
        nombre: inscripcionData.nombre,
        disciplina: getDisciplinaNombre(inscripcionData.disciplina_id),
        disciplina_id: inscripcionData.disciplina_id,
        email: inscripcionData.email,
        telefono: inscripcionData.telefono,
        descripcion: inscripcionData.descripcion,
        tipoContenido: inscripcionData.tipo_contenido,
        linkContenido: inscripcionData.link_contenido,
        archivoContenido: inscripcionData.archivo_contenido,
        fecha_creacion: inscripcionData.fecha_creacion,
        fecha_modificacion: inscripcionData.fecha_modificacion,
        estado: inscripcionData.estado,
        usuario_id: inscripcionData.usuario_id,
        
        // Campos específicos
        fichaArtistica: inscripcionData.ficha_artistica,
        historiaSolista: inscripcionData.historia_solista,
        integrantesEnEscena: integrantesEnEscena.map(ie => ({
            nombre: ie.nombre,
            apellido: ie.apellido,
            dni: ie.dni
        })),
        integrantesFueraEscena: integrantesFueraEscena.map(ife => ({
            rol: ife.rol,
            nombre: ife.nombre,
            apellido: ife.apellido,
            dni: ife.dni
        })),
        autor: inscripcionData.autor,
        duracion: inscripcionData.duracion,
        genero: inscripcionData.genero,
        destinatarios: inscripcionData.destinatarios,
        sinopsis: inscripcionData.sinopsis,
        fechaEstreno: inscripcionData.fecha_estreno,
        numeroFunciones: inscripcionData.numero_funciones,
        nombreGrupo: inscripcionData.nombre_grupo,
        elenco: elenco.map(e => ({
            rol: e.rol,
            nombre: e.nombre,
            apellido: e.apellido,
            dni: e.dni
        })),
        historia: inscripcionData.historia,
        descripcionMaterial: inscripcionData.descripcion_material,
        integrantes: integrantes.map(i => ({
            nombre: i.nombre,
            apellido: i.apellido,
            dni: i.dni
        })),
        colaboradores: colaboradores.map(c => ({
            rol: c.rol,
            nombre: c.nombre,
            apellido: c.apellido,
            dni: c.dni
        })),
        nombreAutor: inscripcionData.nombre_autor,
        apellidoAutor: inscripcionData.apellido_autor,
        dniAutor: inscripcionData.dni_autor,
        tecnica: inscripcionData.tecnica,
        nombreReferente: inscripcionData.nombre_referente,
        apellidoReferente: inscripcionData.apellido_referente,
        dniReferente: inscripcionData.dni_referente,
        equipoTecnico: equipoTecnico.map(et => ({
            rol: et.rol,
            nombre: et.nombre,
            apellido: et.apellido,
            dni: et.dni
        }))
    };
}

// Función auxiliar para convertir ID de disciplina a nombre
function getDisciplinaNombre(disciplinaId: number): string {
    const disciplinas = [
        { id: 1, nombre: 'Danza' },
        { id: 2, nombre: 'Teatro' },
        { id: 3, nombre: 'Música' },
        { id: 4, nombre: 'Letras' },
        { id: 5, nombre: 'Fotografía' },
        { id: 6, nombre: 'Artes Visuales' },
        { id: 7, nombre: 'Artes Audiovisuales' }
    ];
    
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    return disciplina ? disciplina.nombre : 'No especificada';
} 
