# Base de Datos MySQL para Gestión de Formularios

Este directorio contiene los scripts necesarios para inicializar una base de datos MySQL en Docker que almacenará los datos de los formularios.

## Estructura de la Base de Datos

La base de datos contiene las siguientes tablas:

1. **disciplinas** - Almacena las diferentes disciplinas artísticas
2. **usuarios** - Almacena información de los usuarios que crean formularios
3. **formularios** - Contiene los formularios creados por los usuarios
4. **campos_formulario** - Almacena los campos que componen cada formulario
5. **respuestas_formulario** - Guarda las respuestas enviadas para cada formulario

## Sistema de Permisos

El sistema implementa los siguientes permisos:

- **Usuarios regulares**: Solo pueden ver los formularios de la disciplina correspondiente a su usuario
- **Administradores**: Pueden ver todos los formularios de todas las disciplinas

## Archivos SQL de Inicialización

- **01-schema.sql** - Crea la estructura de tablas
- **02-seed.sql** - Inserta datos de ejemplo

## Cómo Iniciar la Base de Datos

1. Asegúrate de tener Docker instalado en tu sistema
2. Desde el directorio raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

Esto iniciará un contenedor MySQL con la base de datos configurada y accesible en el puerto 3306.

## Credenciales de Acceso

- **Base de datos**: formularios_db
- **Usuario**: formulario_user
- **Contraseña**: formulario_password

## Conexión a la Base de Datos

### Desde la línea de comandos:

```bash
docker exec -it formulario-mysql mysql -uformulario_user -pformulario_password formularios_db
```

### Desde una aplicación:

```
Host: localhost
Puerto: 3306
Usuario: formulario_user
Contraseña: formulario_password
Base de datos: formularios_db
```

## Disciplinas Artísticas Disponibles

1. Danza
2. Teatro
3. Música
4. Letras
5. Fotografía
6. Artes Visuales
7. Artes Audiovisuales

## Usuarios de Ejemplo

Para pruebas, se han creado los siguientes usuarios:

1. **Administrador**
   - Email: admin@example.com
   - Contraseña: admin123
   - Rol: Administrador (puede ver todos los formularios)

2. **Profesor de Danza**
   - Email: danza@example.com
   - Contraseña: usuario123
   - Disciplina: Danza
   - Rol: Usuario regular (solo ve formularios de danza)

3. **Profesor de Teatro**
   - Email: teatro@example.com
   - Contraseña: usuario123
   - Disciplina: Teatro
   - Rol: Usuario regular (solo ve formularios de teatro)

4. **Profesor de Música**
   - Email: musica@example.com
   - Contraseña: usuario123
   - Disciplina: Música
   - Rol: Usuario regular (solo ve formularios de música)

5. **Profesor de Letras**
   - Email: letras@example.com
   - Contraseña: usuario123
   - Disciplina: Letras
   - Rol: Usuario regular (solo ve formularios de letras)

6. **Profesor de Fotografía**
   - Email: fotografia@example.com
   - Contraseña: usuario123
   - Disciplina: Fotografía
   - Rol: Usuario regular (solo ve formularios de fotografía)

7. **Profesor de Artes Visuales**
   - Email: artesvisuales@example.com
   - Contraseña: usuario123
   - Disciplina: Artes Visuales
   - Rol: Usuario regular (solo ve formularios de artes visuales)

8. **Profesor de Artes Audiovisuales**
   - Email: artesaudiovisuales@example.com
   - Contraseña: usuario123
   - Disciplina: Artes Audiovisuales
   - Rol: Usuario regular (solo ve formularios de artes audiovisuales) 