import { writable } from 'svelte/store';

export interface User {
    id: number;
    nombre: string;
    email: string;
    es_admin: boolean;
    disciplina_id: number | null;
    disciplina?: string;
}

// Tienda para el usuario actual
export const userStore = writable<User | null>(null);

// Intentar restaurar la sesión desde localStorage al cargar la aplicación
if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            userStore.set(JSON.parse(savedUser));
        } catch (error) {
            console.error('Error al restaurar la sesión:', error);
        }
    }

    // Guardar el usuario en localStorage cuando cambie
    userStore.subscribe(user => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    });
} 