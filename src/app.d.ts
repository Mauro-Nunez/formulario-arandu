// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				nombre: string;
				email: string;
				es_admin: boolean;
				disciplina_id?: number;
				disciplina?: string;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
