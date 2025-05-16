import type { User } from './stores';

export interface Inscripcion {
    id: number;
    nombre: string;
    disciplina: string;
    disciplina_id: number;
    email: string;
    telefono: string;
    descripcion: string;
    tipoContenido: 'archivo' | 'link';
    linkContenido?: string;
    archivoContenido?: string;
    declaracionJurada?: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    usuario_id: number;
    
    // Campos específicos para Danza
    fichaArtistica?: string;
    historiaSolista?: string;
    integrantesEnEscena?: Array<{nombre: string, apellido: string, dni: string}>;
    integrantesFueraEscena?: Array<{rol: string, nombre: string, apellido: string, dni: string}>;
    
    // Campos específicos para Teatro
    autor?: string;
    duracion?: string;
    genero?: string;
    destinatarios?: string;
    sinopsis?: string;
    fechaEstreno?: string;
    numeroFunciones?: string;
    nombreGrupo?: string;
    elenco?: Array<{rol: string, nombre: string, apellido: string, dni: string}>;
    
    // Campos específicos para Música
    historia?: string;
    descripcionMaterial?: string;
    integrantes?: Array<{nombre: string, apellido: string, dni: string}>;
    colaboradores?: Array<{rol: string, nombre: string, apellido: string, dni: string}>;
    
    // Campos específicos para otras disciplinas
    nombreAutor?: string;
    apellidoAutor?: string;
    dniAutor?: string;
    tecnica?: string;
    
    // Campos específicos para Artes Audiovisuales
    nombreReferente?: string;
    apellidoReferente?: string;
    dniReferente?: string;
    equipoTecnico?: Array<{rol: string, nombre: string, apellido: string, dni: string}>;
    
    // Campo para control de edición (solo administradores)
    esEditable?: boolean;
}

// Datos de ejemplo para inscripciones basados en el FormularioArtistico
export const mockInscripciones: Inscripcion[] = [
    // Inscripciones de Danza
    {
        id: 1,
        nombre: 'Danza Contemporánea: "Reflexiones"',
        disciplina: 'Danza',
        disciplina_id: 1,
        email: 'laura.martinez@example.com',
        telefono: '555-123-4567',
        descripcion: 'Coreografía que explora los espacios internos y externos del ser a través del movimiento fluido y expresivo.',
        tipoContenido: 'archivo',
        archivoContenido: 'reflexiones_video.mp4',
        fecha_creacion: '2023-09-15T14:30:00',
        fecha_modificacion: '2023-09-15T14:30:00',
        estado: 'aprobado',
        usuario_id: 2,
        fichaArtistica: 'Dirección: Laura Martínez\nIluminación: Carlos Vega\nMúsica original: Alejandro Sanz',
        historiaSolista: 'Grupo formado en 2018, con presentaciones en diversos festivales nacionales e internacionales.',
        integrantesEnEscena: [
            {nombre: 'Laura', apellido: 'Martínez', dni: '28456789'},
            {nombre: 'Carlos', apellido: 'Rodríguez', dni: '29567890'},
            {nombre: 'Ana', apellido: 'Gómez', dni: '30678901'}
        ],
        integrantesFueraEscena: [
            {rol: 'Iluminación', nombre: 'Miguel', apellido: 'Sánchez', dni: '31789012'},
            {rol: 'Vestuario', nombre: 'Lucía', apellido: 'Fernández', dni: '32890123'}
        ]
    },
    {
        id: 2,
        nombre: 'Ballet Clásico: "El Lago"',
        disciplina: 'Danza',
        disciplina_id: 1,
        email: 'academia.ballet@example.com',
        telefono: '555-234-5678',
        descripcion: 'Adaptación contemporánea del clásico "El lago de los cisnes", con elementos de danza moderna.',
        tipoContenido: 'link',
        linkContenido: 'https://vimeo.com/example/ellago',
        fecha_creacion: '2023-08-28T10:15:00',
        fecha_modificacion: '2023-08-30T16:45:00',
        estado: 'pendiente',
        usuario_id: 2,
        fichaArtistica: 'Dirección: Carmen Díaz\nCoreografía: Ricardo López\nEscenografía: Estudio Visual Arts',
        historiaSolista: 'Academia de Ballet fundada en 2005, dedicada a la enseñanza y difusión del ballet clásico y contemporáneo.',
        integrantesEnEscena: [
            {nombre: 'Carmen', apellido: 'Díaz', dni: '27345678'},
            {nombre: 'Ricardo', apellido: 'López', dni: '28456789'},
            {nombre: 'Julia', apellido: 'Torres', dni: '29567890'},
            {nombre: 'Martín', apellido: 'Suárez', dni: '30678901'}
        ]
    },
    
    // Inscripciones de Teatro
    {
        id: 3,
        nombre: 'La Casa de Bernarda Alba',
        disciplina: 'Teatro',
        disciplina_id: 2,
        email: 'teatro.independiente@example.com',
        telefono: '555-345-6789',
        descripcion: 'Adaptación de la obra de Federico García Lorca, ambientada en la actualidad.',
        tipoContenido: 'archivo',
        archivoContenido: 'casa_bernarda_alba.mp4',
        fecha_creacion: '2023-09-05T18:20:00',
        fecha_modificacion: '2023-09-10T12:30:00',
        estado: 'aprobado',
        usuario_id: 3,
        autor: 'Federico García Lorca (Adaptación: Juan Pérez)',
        duracion: '90 minutos',
        genero: 'Drama',
        destinatarios: 'Público adulto',
        sinopsis: 'Tras la muerte de su segundo marido, Bernarda Alba impone a sus cinco hijas un riguroso luto que las confina en casa durante ocho años, aislándolas del mundo exterior. La adaptación traslada la historia al contexto social contemporáneo.',
        fechaEstreno: '2023-07-15',
        numeroFunciones: '12',
        nombreGrupo: 'Teatro Independiente "La Máscara"',
        elenco: [
            {rol: 'Bernarda Alba', nombre: 'María', apellido: 'Sánchez', dni: '26234567'},
            {rol: 'Adela', nombre: 'Carolina', apellido: 'Martínez', dni: '27345678'},
            {rol: 'Angustias', nombre: 'Sofía', apellido: 'López', dni: '28456789'},
            {rol: 'Director', nombre: 'Juan', apellido: 'Pérez', dni: '25123456'}
        ]
    },
    {
        id: 4,
        nombre: 'Esperando a Godot',
        disciplina: 'Teatro',
        disciplina_id: 2,
        email: 'colectivo.teatro@example.com',
        telefono: '555-456-7890',
        descripcion: 'Nueva interpretación de la obra clásica de Samuel Beckett, con elementos de teatro físico y multimedia.',
        tipoContenido: 'link',
        linkContenido: 'https://youtube.com/example/godot',
        fecha_creacion: '2023-07-20T16:40:00',
        fecha_modificacion: '2023-07-25T11:15:00',
        estado: 'rechazado',
        usuario_id: 3,
        autor: 'Samuel Beckett (Adaptación: Colectivo Teatro Absurdo)',
        duracion: '110 minutos',
        genero: 'Teatro del absurdo',
        destinatarios: 'Público adulto y joven adulto',
        sinopsis: 'Vladimir y Estragón esperan junto a un árbol a un tal Godot, con quien tienen una cita. La espera se prolonga y Godot nunca llega. La adaptación incorpora elementos de video mapping y música en vivo.',
        fechaEstreno: '2023-06-10',
        numeroFunciones: '8',
        nombreGrupo: 'Colectivo Teatro Absurdo',
        elenco: [
            {rol: 'Vladimir', nombre: 'Hernán', apellido: 'González', dni: '26234567'},
            {rol: 'Estragón', nombre: 'Luis', apellido: 'Fernández', dni: '27345678'},
            {rol: 'Pozzo', nombre: 'Diego', apellido: 'Torres', dni: '28456789'},
            {rol: 'Lucky', nombre: 'Martín', apellido: 'Giménez', dni: '29567890'},
            {rol: 'Directora', nombre: 'Lucía', apellido: 'Romero', dni: '25123456'}
        ]
    },
    
    // Inscripciones de Música
    {
        id: 5,
        nombre: 'Sinfonía del Amanecer',
        disciplina: 'Música',
        disciplina_id: 3,
        email: 'ana.compositora@example.com',
        telefono: '555-567-8901',
        descripcion: 'Obra sinfónica inspirada en los amaneceres de la cordillera, fusionando elementos de música clásica contemporánea con sonidos ancestrales.',
        tipoContenido: 'archivo',
        archivoContenido: 'sinfonia_amanecer.mp3',
        fecha_creacion: '2023-08-05T09:30:00',
        fecha_modificacion: '2023-08-10T14:20:00',
        estado: 'aprobado',
        usuario_id: 4,
        historia: 'Ana Sánchez es una compositora con formación clásica que ha explorado la fusión de sonidos tradicionales con técnicas contemporáneas durante los últimos 10 años.',
        descripcionMaterial: 'Partitura completa y grabación en estudio con orquesta de cámara (15 músicos).',
        integrantes: [
            {nombre: 'Ana', apellido: 'Sánchez', dni: '28456789'},
            {nombre: 'Orquesta de Cámara Contemporánea', apellido: '', dni: ''}
        ],
        colaboradores: [
            {rol: 'Director de orquesta', nombre: 'Roberto', apellido: 'Alonso', dni: '27345678'},
            {rol: 'Ingeniero de sonido', nombre: 'Carlos', apellido: 'Martínez', dni: '29567890'},
            {rol: 'Productor', nombre: 'Laura', apellido: 'Gómez', dni: '30678901'}
        ]
    },
    
    // Inscripciones de Letras
    {
        id: 6,
        nombre: 'Crónicas del Olvido',
        disciplina: 'Letras',
        disciplina_id: 4,
        email: 'escritor@example.com',
        telefono: '555-678-9012',
        descripcion: 'Colección de cuentos cortos que exploran la memoria, el olvido y la identidad en contextos urbanos contemporáneos.',
        tipoContenido: 'archivo',
        archivoContenido: 'cronicas_olvido.pdf',
        fecha_creacion: '2023-07-15T11:45:00',
        fecha_modificacion: '2023-07-20T16:30:00',
        estado: 'pendiente',
        usuario_id: 5,
        nombreAutor: 'Eduardo',
        apellidoAutor: 'Martínez',
        dniAutor: '26234567',
        sinopsis: 'Una colección de 12 relatos interconectados que exploran las vidas de personajes urbanos enfrentados a la pérdida de memoria personal y colectiva en una sociedad cada vez más fragmentada.'
    },
    
    // Inscripciones de Fotografía
    {
        id: 7,
        nombre: 'Retratos de lo Invisible',
        disciplina: 'Fotografía',
        disciplina_id: 5,
        email: 'fotografo@example.com',
        telefono: '555-789-0123',
        descripcion: 'Serie fotográfica que captura emociones y sentimientos normalmente invisibles a través de retratos en blanco y negro de alta exposición.',
        tipoContenido: 'link',
        linkContenido: 'https://portfolio.example.com/invisible',
        fecha_creacion: '2023-09-01T14:20:00',
        fecha_modificacion: '2023-09-05T10:15:00',
        estado: 'aprobado',
        usuario_id: 6,
        nombreAutor: 'Javier',
        apellidoAutor: 'Rodríguez',
        dniAutor: '27345678',
        tecnica: 'Fotografía digital en blanco y negro, alta exposición, impresión en papel fotográfico mate.'
    },
    
    // Inscripciones de Artes Visuales
    {
        id: 8,
        nombre: 'Memorias Fragmentadas',
        disciplina: 'Artes Visuales',
        disciplina_id: 6,
        email: 'artista.visual@example.com',
        telefono: '555-890-1234',
        descripcion: 'Instalación que combina técnicas de collage, pintura acrílica y objetos encontrados para explorar la fragilidad de la memoria colectiva.',
        tipoContenido: 'archivo',
        archivoContenido: 'memorias_fragmentadas.pdf',
        fecha_creacion: '2023-08-20T13:10:00',
        fecha_modificacion: '2023-08-25T15:45:00',
        estado: 'pendiente',
        usuario_id: 7,
        nombreAutor: 'Lucia',
        apellidoAutor: 'González',
        dniAutor: '28456789',
        tecnica: 'Instalación mixta: collage, pintura acrílica, objetos encontrados y proyección de video.'
    },
    
    // Inscripciones de Artes Audiovisuales
    {
        id: 9,
        nombre: 'El Último Refugio',
        disciplina: 'Artes Audiovisuales',
        disciplina_id: 7,
        email: 'productor.audiovisual@example.com',
        telefono: '555-901-2345',
        descripcion: 'Cortometraje de ficción que explora temas de migración y pertenencia a través de una narrativa no lineal.',
        tipoContenido: 'link',
        linkContenido: 'https://vimeo.com/example/ultimorefugio',
        fecha_creacion: '2023-08-10T17:30:00',
        fecha_modificacion: '2023-08-15T12:20:00',
        estado: 'aprobado',
        usuario_id: 8,
        nombreReferente: 'Miguel',
        apellidoReferente: 'Torres',
        dniReferente: '29567890',
        sinopsis: 'En un futuro cercano, un grupo de personas busca un refugio mítico que promete aceptación y pertenencia. A través de flashbacks y narrativa no lineal, el cortometraje explora las razones que llevaron a cada personaje a emprender el viaje.',
        duracion: '18 minutos',
        genero: 'Drama/Ciencia Ficción',
        destinatarios: 'Público general',
        equipoTecnico: [
            {rol: 'Director', nombre: 'Miguel', apellido: 'Torres', dni: '29567890'},
            {rol: 'Guionista', nombre: 'Laura', apellido: 'Sánchez', dni: '30678901'},
            {rol: 'Director de Fotografía', nombre: 'Carlos', apellido: 'Rodríguez', dni: '31789012'},
            {rol: 'Montaje', nombre: 'Ana', apellido: 'Martínez', dni: '32890123'}
        ]
    }
];

// Función para obtener las inscripciones según el usuario
export function getInscripciones(usuario: User | null): Inscripcion[] {
    if (!usuario) {
        return [];
    }
    
    let resultado;
    
    if (usuario.es_admin) {
        // Los administradores ven todas las inscripciones
        resultado = [...mockInscripciones];
    } else if (usuario.disciplina_id) {
        // Los usuarios regulares ven solo las inscripciones de su disciplina
        resultado = mockInscripciones.filter(
            inscripcion => inscripcion.disciplina_id === usuario.disciplina_id
        );
    } else {
        return [];
    }
    
    // Agregar flag para edición si es admin
    if (usuario.es_admin) {
        resultado = resultado.map(inscripcion => ({
            ...inscripcion,
            esEditable: inscripcion.estado === 'pendiente'
        }));
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    return resultado.sort((a, b) => 
        new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
    );
}

// Función para obtener una inscripción por ID
export function getInscripcionPorId(id: number): Inscripcion | undefined {
    return mockInscripciones.find(inscripcion => inscripcion.id === id);
}

// Función para aprobar una inscripción
export function aprobarInscripcion(id: number): Inscripcion | undefined {
    const index = mockInscripciones.findIndex(insc => insc.id === id);
    if (index !== -1) {
        mockInscripciones[index].estado = 'aprobado';
        mockInscripciones[index].fecha_modificacion = new Date().toISOString();
        return { ...mockInscripciones[index] };
    }
    return undefined;
}

// Función para rechazar una inscripción
export function rechazarInscripcion(id: number): Inscripcion | undefined {
    const index = mockInscripciones.findIndex(insc => insc.id === id);
    if (index !== -1) {
        mockInscripciones[index].estado = 'rechazado';
        mockInscripciones[index].fecha_modificacion = new Date().toISOString();
        return { ...mockInscripciones[index] };
    }
    return undefined;
}

// Función para generar un nuevo ID para inscripciones
function generarNuevoId(): number {
    const ids = mockInscripciones.map(insc => insc.id);
    return Math.max(...ids, 0) + 1;
}

// Función para guardar una nueva inscripción
export function guardarInscripcion(inscripcion: Partial<Inscripcion>): Inscripcion {
    const fecha = new Date().toISOString();
    
    // Generar un objeto de inscripción completo
    const nuevaInscripcion: Inscripcion = {
        id: generarNuevoId(),
        nombre: inscripcion.nombre || 'Sin nombre',
        disciplina: inscripcion.disciplina || 'No especificada',
        disciplina_id: inscripcion.disciplina_id || 0,
        email: inscripcion.email || '',
        telefono: inscripcion.telefono || '',
        descripcion: inscripcion.descripcion || '',
        tipoContenido: inscripcion.tipoContenido || 'archivo',
        linkContenido: inscripcion.linkContenido,
        archivoContenido: inscripcion.archivoContenido,
        fecha_creacion: fecha,
        fecha_modificacion: fecha,
        estado: 'pendiente',
        usuario_id: inscripcion.usuario_id || 1,
        
        // Campos opcionales específicos por disciplina
        fichaArtistica: inscripcion.fichaArtistica,
        historiaSolista: inscripcion.historiaSolista,
        integrantesEnEscena: inscripcion.integrantesEnEscena,
        integrantesFueraEscena: inscripcion.integrantesFueraEscena,
        autor: inscripcion.autor,
        duracion: inscripcion.duracion,
        genero: inscripcion.genero,
        destinatarios: inscripcion.destinatarios,
        sinopsis: inscripcion.sinopsis,
        fechaEstreno: inscripcion.fechaEstreno,
        numeroFunciones: inscripcion.numeroFunciones,
        nombreGrupo: inscripcion.nombreGrupo,
        elenco: inscripcion.elenco,
        historia: inscripcion.historia,
        descripcionMaterial: inscripcion.descripcionMaterial,
        integrantes: inscripcion.integrantes,
        colaboradores: inscripcion.colaboradores,
        nombreAutor: inscripcion.nombreAutor,
        apellidoAutor: inscripcion.apellidoAutor,
        dniAutor: inscripcion.dniAutor,
        tecnica: inscripcion.tecnica,
        nombreReferente: inscripcion.nombreReferente,
        apellidoReferente: inscripcion.apellidoReferente,
        dniReferente: inscripcion.dniReferente,
        equipoTecnico: inscripcion.equipoTecnico
    };
    
    // Agregar la nueva inscripción al array de inscripciones
    mockInscripciones.push(nuevaInscripcion);
    
    return nuevaInscripcion;
} 
