<script lang="ts">
    import { onMount } from 'svelte';
    import FormularioArtistico from '$lib/components/FormularioArtistico.svelte';
    import { userStore } from '$lib/stores';

    let cargando = true;

    onMount(() => {
        // Solo verificamos si hay usuario para mostrar información adicional si es necesario
        setTimeout(() => {
            cargando = false;
        }, 200);
    });
</script>

{#if cargando}
    <div class="flex items-center justify-center min-h-screen">
        <div class="p-8 rounded-lg shadow-md bg-white text-center">
            <h1 class="text-2xl mb-4">Cargando...</h1>
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        </div>
    </div>
{:else}
    <FormularioArtistico />
{/if}
