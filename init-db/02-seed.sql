-- Insertar disciplinas de ejemplo
INSERT INTO disciplinas (nombre, descripcion)
VALUES
    ('Danza', 'Expresión artística que utiliza el movimiento del cuerpo como forma de comunicación'),
    ('Teatro', 'Arte escénico donde actores representan historias ante un público'),
    ('Música', 'Arte de organizar sensible y lógicamente sonidos y silencios'),
    ('Letras', 'Disciplina artística enfocada en la expresión escrita y literatura'),
    ('Fotografía', 'Arte y técnica de obtener imágenes mediante la captura de luz'),
    ('Artes Visuales', 'Formas de arte que se enfocan en la creación de obras visuales'),
    ('Artes Audiovisuales', 'Formas de expresión artística que combinan imágenes y sonidos');

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, email, password, es_admin, disciplina_id)
VALUES 
    ('Administrador', 'admin@example.com', '$2a$10$JwbW5Aeu1JR8sd7GqFJ1r.o4r5wlrGC5PbuV5rH1tCq9d1nwOcmVG', TRUE, NULL), -- password: admin123
    ('Profesor de Danza', 'danza@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 1), -- password: usuario123
    ('Profesor de Teatro', 'teatro@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 2), -- password: usuario123
    ('Profesor de Música', 'musica@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 3), -- password: usuario123
    ('Profesor de Letras', 'letras@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 4), -- password: usuario123
    ('Profesor de Fotografía', 'fotografia@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 5), -- password: usuario123
    ('Profesor de Artes Visuales', 'artesvisuales@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 6), -- password: usuario123
    ('Profesor de Artes Audiovisuales', 'artesaudiovisuales@example.com', '$2a$10$lzVTr6CV.Nz9V7hBtT/BK.EYZGTBnGFnZx2YW.N9FPpZyIU9CJ9sK', FALSE, 7); -- password: usuario123

-- Insertar formularios de ejemplo
INSERT INTO formularios (usuario_id, disciplina_id, titulo, descripcion, estado)
VALUES 
    (1, 1, 'Inscripción a Taller de Danza Contemporánea', 'Formulario para inscribirse al taller de danza contemporánea', 'publicado'),
    (1, 2, 'Audición para Obra de Teatro', 'Formulario para participar en las audiciones de la nueva obra', 'publicado'),
    (1, 3, 'Concurso de Composición Musical', 'Formulario para inscribirse al concurso anual de composición', 'publicado'),
    (1, 4, 'Taller de Escritura Creativa', 'Inscripción para el taller de narrativa y poesía', 'publicado'),
    (1, 5, 'Exposición Fotográfica Anual', 'Registro para participar en la exposición fotográfica', 'publicado'),
    (1, 6, 'Concurso de Artes Visuales', 'Formulario para participar en el concurso de artes visuales', 'publicado'),
    (1, 7, 'Festival de Cortometrajes', 'Inscripción de obras para el festival de cortometrajes', 'publicado'),
    (2, 1, 'Evaluación de Técnica de Ballet', 'Formulario para evaluar el desempeño en técnica clásica', 'publicado'),
    (3, 2, 'Registro para Curso de Improvisación', 'Inscripción al curso intensivo de improvisación teatral', 'borrador'),
    (4, 3, 'Préstamo de Instrumentos Musicales', 'Solicitud para préstamo de instrumentos del conservatorio', 'publicado'),
    (5, 4, 'Concurso de Poesía', 'Inscripción para el concurso de poesía', 'publicado'),
    (6, 5, 'Salida Fotográfica Urbana', 'Registro para la salida fotográfica por el centro histórico', 'borrador'),
    (7, 6, 'Solicitud de Espacio de Exposición', 'Formulario para solicitar espacio en la galería', 'publicado'),
    (8, 7, 'Casting para Proyecto Audiovisual', 'Registro de actores para próximo proyecto audiovisual', 'publicado');

-- Insertar campos para el formulario de danza
INSERT INTO campos_formulario (formulario_id, etiqueta, tipo, obligatorio, opciones, orden)
VALUES 
    (1, 'Nombre Completo', 'texto', TRUE, NULL, 1),
    (1, 'Correo Electrónico', 'email', TRUE, NULL, 2),
    (1, 'Teléfono', 'texto', TRUE, NULL, 3),
    (1, 'Edad', 'numero', TRUE, NULL, 4),
    (1, 'Nivel de Experiencia', 'seleccion', TRUE, '["Principiante", "Intermedio", "Avanzado"]', 5),
    (1, 'Experiencia Previa', 'parrafo', FALSE, NULL, 6);

-- Insertar campos para el formulario de teatro
INSERT INTO campos_formulario (formulario_id, etiqueta, tipo, obligatorio, opciones, orden)
VALUES 
    (2, 'Nombre Artístico', 'texto', TRUE, NULL, 1),
    (2, 'Email', 'email', TRUE, NULL, 2),
    (2, 'Edad', 'numero', TRUE, NULL, 3),
    (2, 'Experiencia Teatral', 'parrafo', TRUE, NULL, 4),
    (2, 'Personaje al que aplica', 'seleccion', TRUE, '["Protagonista", "Secundario", "Figurante"]', 5),
    (2, 'Disponibilidad Horaria', 'multiple', TRUE, '["Mañana", "Tarde", "Noche", "Fines de semana"]', 6);

-- Insertar campos para el formulario de música
INSERT INTO campos_formulario (formulario_id, etiqueta, tipo, obligatorio, opciones, orden)
VALUES 
    (3, 'Nombre del Compositor', 'texto', TRUE, NULL, 1),
    (3, 'Email de Contacto', 'email', TRUE, NULL, 2),
    (3, 'Título de la Obra', 'texto', TRUE, NULL, 3),
    (3, 'Género Musical', 'seleccion', TRUE, '["Clásica", "Jazz", "Popular", "Experimental", "Fusión"]', 4),
    (3, 'Duración en minutos', 'numero', TRUE, NULL, 5),
    (3, 'Descripción de la Obra', 'parrafo', TRUE, NULL, 6),
    (3, 'Archivo de Partitura', 'archivo', TRUE, NULL, 7);

-- Insertar algunas respuestas de ejemplo
INSERT INTO respuestas_formulario (formulario_id, ip_remitente, datos)
VALUES 
    (1, '192.168.1.100', '{"Nombre Completo": "Laura Martínez", "Correo Electrónico": "laura@example.com", "Teléfono": "555-123-4567", "Edad": "24", "Nivel de Experiencia": "Intermedio", "Experiencia Previa": "5 años de danza clásica y 2 de contemporánea"}'),
    (2, '192.168.1.101', '{"Nombre Artístico": "Carlos Vega", "Email": "carlos@example.com", "Edad": "31", "Experiencia Teatral": "Actor de teatro independiente desde 2015, 10 obras realizadas", "Personaje al que aplica": "Protagonista", "Disponibilidad Horaria": ["Tarde", "Noche"]}'),
    (3, '192.168.1.102', '{"Nombre del Compositor": "Ana Sánchez", "Email de Contacto": "ana@example.com", "Título de la Obra": "Sinfonía del Amanecer", "Género Musical": "Clásica", "Duración en minutos": "15", "Descripción de la Obra": "Pieza para orquesta de cámara inspirada en los amaneceres de la cordillera"}'); 