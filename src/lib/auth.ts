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
        console.log(`Intentando iniciar sesión para: ${email}`);
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Asegurarnos de que la cookie se guarde
        });

        console.log(`Respuesta del servidor login: ${response.status} ${response.statusText}`);
        
        // Verificar cookies recibidas
        if (typeof document !== 'undefined') {
            console.log("Cookies después de login:", document.cookie);
        }

        const data = await response.json();
        console.log("Datos recibidos del login:", data);

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
export async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al cerrar sesión');
        }

        // Limpiar el store localmente
        userStore.set(null);
        
        // Redirigir al login
        if (typeof window !== 'undefined') {
            goto('/login');
        }
    } catch (err) {
        logger.error('Error al cerrar sesión:', { 
            error: err instanceof Error ? err.message : String(err) 
        });
        throw err;
    }
}

// Función para verificar si el usuario está autenticado
// Esta función podría necesitar ajustarse si la sesión se maneja en el servidor
export async function checkAuthenticated(): Promise<boolean> {
    try {
        // Verificar autenticación llamando al endpoint
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            return false;
        }
        
        const data = await response.json();
        return data.authenticated === true;
    } catch (error) {
        logger.error('Error al verificar autenticación:', { error });
        return false;
    }
}

// Verificación síncrona (usando el store)
export function isAuthenticated(): boolean {
    let authenticated = false;
    const unsubscribe = userStore.subscribe(currentUser => {
        authenticated = !!currentUser;
    });
    unsubscribe(); // Evitar memory leaks
    return authenticated;
}

// Función para cargar el usuario en el store desde el servidor
export async function loadUserIntoStore(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            return false;
        }
        
        const data = await response.json();
        
        if (data.authenticated && data.user) {
            userStore.set(data.user);
            return true;
        }
        
        return false;
    } catch (error) {
        logger.error('Error al cargar usuario en el store:', { error });
        return false;
    }
}

// Middleware para proteger rutas que requieren autenticación
// Este es un protector del lado del cliente. Para protección robusta, usa hooks del servidor.
export async function requireAuth() {
    if (typeof window !== 'undefined') { // Asegurar que solo se ejecute en el cliente
        // Primero verificar el store
        if (!isAuthenticated()) {
            // Si no hay usuario en el store, verificar con el servidor
            const isServerAuthenticated = await checkAuthenticated();
            
            if (!isServerAuthenticated) {
                // Si no está autenticado según el servidor, redirigir al login
                logger.info('Usuario no autenticado, redirigiendo a login');
                goto('/login');
            } else {
                // Si está autenticado según el servidor pero no en el store, actualizar el store
                logger.info('Usuario autenticado en servidor pero no en store, actualizando store');
                await loadUserIntoStore();
            }
        }
    }
} 