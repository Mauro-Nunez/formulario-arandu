-- Crear tabla para disciplinas
CREATE TABLE IF NOT EXISTS disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Crear tabla para usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE,
    disciplina_id INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE SET NULL
);

-- Crear tabla para formularios
CREATE TABLE IF NOT EXISTS formularios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('borrador', 'publicado', 'cerrado') DEFAULT 'borrador',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
);

-- Crear tabla para campos de formulario
CREATE TABLE IF NOT EXISTS campos_formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formulario_id INT NOT NULL,
    etiqueta VARCHAR(255) NOT NULL,
    tipo ENUM('texto', 'numero', 'email', 'fecha', 'seleccion', 'multiple', 'archivo', 'parrafo') NOT NULL,
    obligatorio BOOLEAN DEFAULT FALSE,
    opciones JSON NULL,
    orden INT NOT NULL DEFAULT 0,
    FOREIGN KEY (formulario_id) REFERENCES formularios(id) ON DELETE CASCADE
);

-- Crear tabla para respuestas
CREATE TABLE IF NOT EXISTS respuestas_formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formulario_id INT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_remitente VARCHAR(45),
    datos JSON NOT NULL,
    FOREIGN KEY (formulario_id) REFERENCES formularios(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_formularios_usuario ON formularios(usuario_id);
CREATE INDEX idx_formularios_disciplina ON formularios(disciplina_id);
CREATE INDEX idx_campos_formulario ON campos_formulario(formulario_id);
CREATE INDEX idx_respuestas_formulario ON respuestas_formulario(formulario_id);
CREATE INDEX idx_usuarios_disciplina ON usuarios(disciplina_id); 