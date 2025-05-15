export interface Formulario {
    id: number;
    usuario_id: number;
    disciplina_id: number;
    titulo: string;
    descripcion: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    estado: 'borrador' | 'publicado' | 'cerrado';
    disciplina: string;
    creador: string;
}

// Datos de ejemplo para formularios basados en las disciplinas
export const mockFormularios: Formulario[] = [
    {
        id: 1,
        usuario_id: 1,
        disciplina_id: 1,
        titulo: 'Inscripción a Taller de Danza Contemporánea',
        descripcion: 'Formulario para inscribirse al taller de danza contemporánea que se realizará durante el mes de agosto. Se ofrecerán clases de nivel básico, intermedio y avanzado.',
        fecha_creacion: '2023-06-15T10:00:00',
        fecha_modificacion: '2023-06-15T10:00:00',
        estado: 'publicado',
        disciplina: 'Danza',
        creador: 'Administrador'
    },
    {
        id: 2,
        usuario_id: 1,
        disciplina_id: 2,
        titulo: 'Audición para Obra de Teatro',
        descripcion: 'Formulario para participar en las audiciones de la nueva obra "El Sueño de una Noche de Verano" que se presentará en septiembre.',
        fecha_creacion: '2023-06-14T15:30:00',
        fecha_modificacion: '2023-06-14T15:30:00',
        estado: 'publicado',
        disciplina: 'Teatro',
        creador: 'Administrador'
    },
    {
        id: 3,
        usuario_id: 1,
        disciplina_id: 3,
        titulo: 'Concurso de Composición Musical',
        descripcion: 'Formulario para inscribirse al concurso anual de composición musical. Se aceptan obras de todos los géneros.',
        fecha_creacion: '2023-06-10T09:15:00',
        fecha_modificacion: '2023-06-10T09:15:00',
        estado: 'publicado',
        disciplina: 'Música',
        creador: 'Administrador'
    },
    {
        id: 4,
        usuario_id: 1,
        disciplina_id: 4,
        titulo: 'Taller de Escritura Creativa',
        descripcion: 'Inscripción para el taller de narrativa y poesía que se realizará durante julio y agosto.',
        fecha_creacion: '2023-06-05T11:20:00',
        fecha_modificacion: '2023-06-05T11:20:00',
        estado: 'publicado',
        disciplina: 'Letras',
        creador: 'Administrador'
    },
    {
        id: 5,
        usuario_id: 1,
        disciplina_id: 5,
        titulo: 'Exposición Fotográfica Anual',
        descripcion: 'Registro para participar en la exposición fotográfica que se realizará en octubre en la galería central.',
        fecha_creacion: '2023-06-03T14:45:00',
        fecha_modificacion: '2023-06-03T14:45:00',
        estado: 'publicado',
        disciplina: 'Fotografía',
        creador: 'Administrador'
    },
    {
        id: 6,
        usuario_id: 1,
        disciplina_id: 6,
        titulo: 'Concurso de Artes Visuales',
        descripcion: 'Formulario para participar en el concurso de artes visuales con premios para las mejores obras.',
        fecha_creacion: '2023-06-01T10:30:00',
        fecha_modificacion: '2023-06-01T10:30:00',
        estado: 'publicado',
        disciplina: 'Artes Visuales',
        creador: 'Administrador'
    },
    {
        id: 7,
        usuario_id: 1,
        disciplina_id: 7,
        titulo: 'Festival de Cortometrajes',
        descripcion: 'Inscripción de obras para el festival de cortometrajes que se celebrará en noviembre.',
        fecha_creacion: '2023-05-28T16:00:00',
        fecha_modificacion: '2023-05-28T16:00:00',
        estado: 'publicado',
        disciplina: 'Artes Audiovisuales',
        creador: 'Administrador'
    },
    {
        id: 8,
        usuario_id: 2,
        disciplina_id: 1,
        titulo: 'Evaluación de Técnica de Ballet',
        descripcion: 'Formulario para evaluar el desempeño en técnica clásica de los estudiantes de ballet.',
        fecha_creacion: '2023-05-25T09:00:00',
        fecha_modificacion: '2023-05-25T09:00:00',
        estado: 'publicado',
        disciplina: 'Danza',
        creador: 'Profesor de Danza'
    },
    {
        id: 9,
        usuario_id: 3,
        disciplina_id: 2,
        titulo: 'Registro para Curso de Improvisación',
        descripcion: 'Inscripción al curso intensivo de improvisación teatral que se realizará los fines de semana de julio.',
        fecha_creacion: '2023-05-20T11:30:00',
        fecha_modificacion: '2023-05-20T11:30:00',
        estado: 'borrador',
        disciplina: 'Teatro',
        creador: 'Profesor de Teatro'
    },
    {
        id: 10,
        usuario_id: 4,
        disciplina_id: 3,
        titulo: 'Préstamo de Instrumentos Musicales',
        descripcion: 'Solicitud para préstamo de instrumentos del conservatorio para prácticas y presentaciones.',
        fecha_creacion: '2023-05-18T14:15:00',
        fecha_modificacion: '2023-05-18T14:15:00',
        estado: 'publicado',
        disciplina: 'Música',
        creador: 'Profesor de Música'
    },
    {
        id: 11,
        usuario_id: 5,
        disciplina_id: 4,
        titulo: 'Concurso de Poesía',
        descripcion: 'Inscripción para el concurso de poesía con temática libre. Abierto a todos los estudiantes.',
        fecha_creacion: '2023-05-15T10:45:00',
        fecha_modificacion: '2023-05-15T10:45:00',
        estado: 'publicado',
        disciplina: 'Letras',
        creador: 'Profesor de Letras'
    },
    {
        id: 12,
        usuario_id: 6,
        disciplina_id: 5,
        titulo: 'Salida Fotográfica Urbana',
        descripcion: 'Registro para la salida fotográfica por el centro histórico que se realizará el próximo mes.',
        fecha_creacion: '2023-05-12T09:30:00',
        fecha_modificacion: '2023-05-12T09:30:00',
        estado: 'borrador',
        disciplina: 'Fotografía',
        creador: 'Profesor de Fotografía'
    },
    {
        id: 13,
        usuario_id: 7,
        disciplina_id: 6,
        titulo: 'Solicitud de Espacio de Exposición',
        descripcion: 'Formulario para solicitar espacio en la galería para exponer obras durante el semestre.',
        fecha_creacion: '2023-05-10T13:00:00',
        fecha_modificacion: '2023-05-10T13:00:00',
        estado: 'publicado',
        disciplina: 'Artes Visuales',
        creador: 'Profesor de Artes Visuales'
    },
    {
        id: 14,
        usuario_id: 8,
        disciplina_id: 7,
        titulo: 'Casting para Proyecto Audiovisual',
        descripcion: 'Registro de actores para próximo proyecto audiovisual que se grabará durante agosto.',
        fecha_creacion: '2023-05-05T15:45:00',
        fecha_modificacion: '2023-05-05T15:45:00',
        estado: 'publicado',
        disciplina: 'Artes Audiovisuales',
        creador: 'Profesor de Artes Audiovisuales'
    }
];

// Función para obtener los formularios según el usuario
export function getFormularios(userId: number, esAdmin: boolean, disciplinaId: number | null): Formulario[] {
    if (esAdmin) {
        // El administrador ve todos los formularios
        return [...mockFormularios].sort((a, b) => 
            new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );
    } else if (disciplinaId) {
        // Usuario regular ve solo los formularios de su disciplina
        return [...mockFormularios]
            .filter(form => form.disciplina_id === disciplinaId)
            .sort((a, b) => 
                new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
            );
    }
    
    return [];
} 