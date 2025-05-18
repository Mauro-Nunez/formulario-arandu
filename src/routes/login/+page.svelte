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

<div class="login-container">
    <div class="login-box">
        <h1>Iniciar Sesión</h1>
        
        {#if error}
            <div class="error-message">
                <p>{error}</p>
            </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
            <input
                type="email"
                id="email"
                bind:value={email}
                required
                placeholder="usuario"
            />

            <input
                type="password"
                id="password"
                bind:value={password}
                required
                placeholder="contraseña"
            />

            <button
                type="submit"
                disabled={loading}
            >
                {#if loading}
                    <span>Procesando...</span>
                {:else}
                    <span>ingresar</span>
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #f9fafb; /* Fondo gris muy claro en lugar de azul */
    }

    .login-box {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        text-align: center;
        color: #4b5563;
        font-size: 1.75rem;
        font-weight: normal;
        margin-bottom: 1.5rem;
    }

    .error-message {
        background-color: #fee2e2;
        border: 1px solid #fca5a5;
        color: #b91c1c;
        padding: 0.5rem;
        font-size: 0.875rem;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        width: 100%;
        background-color: #f3f4f6;
        border: none;
        padding: 0.75rem;
        color: #4b5563;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        background-color: #4b5563; /* Botón gris en lugar de azul */
        color: white;
        border: none;
        padding: 0.75rem;
        margin-top: 0.5rem;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style> 