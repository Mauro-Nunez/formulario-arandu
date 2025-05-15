import { goto } from '$app/navigation';
import { userStore, type User } from './stores';
import { logger } from './logger';

// Simula una conexión a la base de datos para fines de demostración
// En una aplicación real, esto sería una llamada a API o servicio backend
const mockUsers = [
    {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@example.com',
        // En producción nunca guardar contraseñas en texto plano, usar hash
        password: 'admin123',
        es_admin: true,
        disciplina_id: null,
        disciplina: null
    },
    {
        id: 2,
        nombre: 'Profesor de Danza',
        email: 'danza@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 1,
        disciplina: 'Danza'
    },
    {
        id: 3,
        nombre: 'Profesor de Teatro',
        email: 'teatro@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 2,
        disciplina: 'Teatro'
    },
    {
        id: 4,
        nombre: 'Profesor de Música',
        email: 'musica@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 3,
        disciplina: 'Música'
    },
    {
        id: 5,
        nombre: 'Profesor de Letras',
        email: 'letras@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 4,
        disciplina: 'Letras'
    },
    {
        id: 6,
        nombre: 'Profesor de Fotografía',
        email: 'fotografia@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 5,
        disciplina: 'Fotografía'
    },
    {
        id: 7,
        nombre: 'Profesor de Artes Visuales',
        email: 'artesvisuales@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 6,
        disciplina: 'Artes Visuales'
    },
    {
        id: 8,
        nombre: 'Profesor de Artes Audiovisuales',
        email: 'artesaudiovisuales@example.com',
        password: 'usuario123',
        es_admin: false,
        disciplina_id: 7,
        disciplina: 'Artes Audiovisuales'
    }
];

// Función para iniciar sesión llamando al API endpoint
export async function login(email: string, password: string): Promise<User> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            logger.error('Error en la respuesta del API de login:', { status: response.status, data });
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Asumimos que el API devuelve el objeto User completo (sin la contraseña)
        return data as User;

    } catch (err) {
        // Loguear el error original antes de lanzar uno nuevo más genérico si es necesario
        logger.error('Error durante el proceso de login en auth.ts:', { 
            message: err instanceof Error ? err.message : String(err),
            originalError: err
        });
        // Re-lanzar el error para que sea manejado por el componente de UI
        throw err; 
    }
}

// Función para cerrar sesión
export function logout() {
    userStore.set(null);
    // Considera redirigir desde el componente o un hook si es más apropiado para tu flujo
    if (typeof window !== 'undefined') {
        goto('/login');
    }
}

// Función para verificar si el usuario está autenticado
// Esta función podría necesitar ajustarse si la sesión se maneja en el servidor
export function isAuthenticated(): boolean {
    let authenticated = false;
    const unsubscribe = userStore.subscribe(currentUser => {
        authenticated = !!currentUser;
    });
    unsubscribe(); // Evitar memory leaks
    return authenticated;
}

// Middleware para proteger rutas que requieren autenticación
// Este es un protector del lado del cliente. Para protección robusta, usa hooks del servidor.
export function requireAuth() {
    if (typeof window !== 'undefined') { // Asegurar que solo se ejecute en el cliente
        if (!isAuthenticated()) {
            goto('/login');
        }
    }
} 