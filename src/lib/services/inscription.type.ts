
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

    responsableNombre?: string;
    responsableApellido?: string;
    responsableTelefono?: string;
    responsableEmail?: string;
    esConcertado?: boolean;
}
