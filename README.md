# Aplicación de Formularios para Disciplinas Artísticas

Aplicación para crear y gestionar formularios personalizados para diferentes disciplinas artísticas, construida con SvelteKit y MySQL.

## Requisitos

- Node.js
- Docker

## Configuración de la Base de Datos

El proyecto utiliza MySQL en Docker para almacenar los datos de los formularios. Para iniciar la base de datos:

```bash
# Iniciar el contenedor de MySQL
docker compose up -d
```

La base de datos se configurará automáticamente con las tablas necesarias y algunos datos de ejemplo. Para más detalles, consulta la [documentación de la base de datos](./init-db/README.md).

## Desarrollo

Una vez que hayas configurado la base de datos e instalado las dependencias con `npm install`, inicia el servidor de desarrollo:

```bash
npm run dev

# o inicia el servidor y abre la aplicación en una nueva pestaña del navegador
npm run dev -- --open
```

## Construcción para Producción

Para crear una versión de producción de tu aplicación:

```bash
npm run build
```

Puedes previsualizar la compilación de producción con `npm run preview`.

> Para desplegar tu aplicación, es posible que necesites instalar un [adaptador](https://svelte.dev/docs/kit/adapters) para tu entorno de destino.

## Estructura de la Base de Datos

La base de datos contiene las siguientes tablas:

1. **disciplinas** - Almacena las diferentes disciplinas artísticas
2. **usuarios** - Almacena información de los usuarios que crean formularios
3. **formularios** - Contiene los formularios creados por los usuarios
4. **campos_formulario** - Almacena los campos que componen cada formulario
5. **respuestas_formulario** - Guarda las respuestas enviadas para cada formulario

## Sistema de Permisos

La aplicación implementa el siguiente sistema de permisos:

- **Usuarios regulares**: Solo pueden ver los formularios de la disciplina correspondiente a su usuario
- **Administradores**: Pueden ver todos los formularios de todas las disciplinas

## Disciplinas Artísticas

La aplicación está diseñada para gestionar formularios de las siguientes disciplinas:

1. Danza
2. Teatro
3. Música
4. Letras
5. Fotografía
6. Artes Visuales
7. Artes Audiovisuales

Cada formulario está asociado a una disciplina específica, y los usuarios regulares solo pueden acceder a los formularios de su disciplina asignada.

## Usuarios de Prueba

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

Y otros usuarios para cada disciplina. Consulta la [documentación de la base de datos](./init-db/README.md) para más detalles.
