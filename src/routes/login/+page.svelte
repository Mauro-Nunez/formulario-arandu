<script lang="ts">
    import { goto } from '$app/navigation';
    import { userStore } from '$lib/stores';
    import { login } from '$lib/auth';
    
    let email = '';
    let password = '';
    let error = '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        error = '';
        
        try {
            const user = await login(email, password);
            $userStore = user;
            goto('/formularios');
        } catch (err) {
            console.error('Error de inicio de sesión:', err);
            error = 'Credenciales inválidas. Por favor, intente de nuevo.';
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Iniciar Sesión | Formularios por Disciplina</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
    <div class="max-w-xs w-full mx-auto my-8">
        <!-- Card con glasmorfismo -->
        <div class="backdrop-blur-md bg-white/70 border border-white/30 shadow-xl rounded-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h1>

            <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
                {#if error}
                    <div class="bg-red-50 border border-red-300 text-red-700 p-2 text-xs rounded-md" role="alert">
                        <p>{error}</p>
                    </div>
                {/if}

                <div class="space-y-1">
                    <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        required
                        class="block w-full border border-gray-300 px-3 py-2 text-sm bg-white/80 transition-colors duration-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="ejemplo@dominio.com"
                    />
                </div>

                <div class="space-y-1">
                    <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        bind:value={password}
                        required
                        class="block w-full border border-gray-300 px-3 py-2 text-sm bg-white/80 transition-colors duration-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Tu contraseña"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    class="w-full bg-indigo-600 text-white font-medium py-2 px-3 text-sm mt-3 transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span class="flex items-center justify-center">
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Procesando...</span>
                        {:else}
                            <span>Iniciar Sesión</span>
                        {/if}
                    </span>
                </button>
            </form>
        </div>
        
        <div class="text-center text-gray-600 text-xs mt-4">
            <p>Sistema de Formularios por Disciplina © {new Date().getFullYear()}</p>
        </div>
    </div>
</div> 