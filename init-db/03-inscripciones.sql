-- Crear tabla para inscripciones artísticas
CREATE TABLE IF NOT EXISTS inscripciones_artisticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    disciplina_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    descripcion TEXT,
    tipo_contenido ENUM('archivo', 'link') NOT NULL DEFAULT 'archivo',
    link_contenido VARCHAR(512),
    archivo_contenido VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    usuario_id INT NOT NULL,

    -- Campos comunes para varios tipos de inscripciones
    ficha_artistica TEXT,
    historia_solista TEXT,
    autor VARCHAR(255),
    duracion VARCHAR(50),
    genero VARCHAR(100),
    destinatarios VARCHAR(255),
    sinopsis TEXT,
    fecha_estreno DATE,
    numero_funciones VARCHAR(20),
    nombre_grupo VARCHAR(255),
    es_concertado BOOLEAN DEFAULT FALSE,
    historia TEXT,
    descripcion_material TEXT,
    nombre_autor VARCHAR(255),
    apellido_autor VARCHAR(255),
    dni_autor VARCHAR(20),
    tecnica VARCHAR(255),
    material_entregado TEXT,
    tipo_obra ENUM('bidimensional', 'tridimensional', 'historieta') DEFAULT NULL,
    medidas_ancho DECIMAL(10,2),
    medidas_alto DECIMAL(10,2),
    medidas_profundidad DECIMAL(10,2),
    dossier_tecnico TEXT,
    sinopsis_historieta TEXT,
    numero_paginas INT,
    formato_presentacion ENUM('digital', 'impreso') DEFAULT NULL,
    nombre_referente VARCHAR(255),
    apellido_referente VARCHAR(255),
    dni_referente VARCHAR(20),
    
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla para integrantes de inscripciones (en escena, fuera de escena, equipo técnico, etc.)
CREATE TABLE IF NOT EXISTS integrantes_inscripcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inscripcion_id INT NOT NULL,
    tipo ENUM('en_escena', 'fuera_escena', 'elenco', 'integrante', 'colaborador', 'equipo_tecnico') NOT NULL,
    rol VARCHAR(100),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    FOREIGN KEY (inscripcion_id) REFERENCES inscripciones_artisticas(id) ON DELETE CASCADE
);

-- Tabla para archivos adjuntos a inscripciones
CREATE TABLE IF NOT EXISTS archivos_inscripcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inscripcion_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(512) NOT NULL,
    tipo_mime VARCHAR(100),
    tamanio INT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inscripcion_id) REFERENCES inscripciones_artisticas(id) ON DELETE CASCADE
);

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS logs_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG') NOT NULL,
    mensaje TEXT NOT NULL,
    detalles JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_inscripciones_disciplina ON inscripciones_artisticas(disciplina_id);
CREATE INDEX idx_inscripciones_usuario ON inscripciones_artisticas(usuario_id);
CREATE INDEX idx_inscripciones_estado ON inscripciones_artisticas(estado);
CREATE INDEX idx_integrantes_inscripcion ON integrantes_inscripcion(inscripcion_id);
CREATE INDEX idx_archivos_inscripcion ON archivos_inscripcion(inscripcion_id); 