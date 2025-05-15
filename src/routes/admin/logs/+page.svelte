<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userStore } from '$lib/stores';
    import { logger, LogLevel, type LogEvent } from '$lib/logger';
    import { requireAuth } from '$lib/auth';

    let logs: LogEvent[] = [];
    let filtroNivel: string = 'ALL';
    let busqueda: string = '';

    onMount(() => {
        requireAuth();
        
        if (!$userStore || !$userStore.es_admin) {
            goto('/login');
            return;
        }
        
        cargarLogs();
    });
    
    function cargarLogs() {
        logs = logger.getLogs();
    }
    
    function obtenerLogsFiltrados(): LogEvent[] {
        let resultado = [...logs];
        
        // Filtrar por nivel
        if (filtroNivel !== 'ALL') {
            resultado = resultado.filter(log => log.level === filtroNivel);
        }
        
        // Filtrar por búsqueda
        if (busqueda.trim() !== '') {
            const terminoBusqueda = busqueda.toLowerCase();
            resultado = resultado.filter(log => 
                log.message.toLowerCase().includes(terminoBusqueda) || 
                (log.details && JSON.stringify(log.details).toLowerCase().includes(terminoBusqueda))
            );
        }
        
        // Ordenar por timestamp descendiente (más reciente primero)
        return resultado.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
    
    function formatearFecha(fechaIso: string): string {
        const fecha = new Date(fechaIso);
        return fecha.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    function getNivelColor(nivel: LogLevel): string {
        switch (nivel) {
            case LogLevel.INFO:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case LogLevel.WARNING:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case LogLevel.ERROR:
                return 'bg-red-100 text-red-800 border-red-200';
            case LogLevel.DEBUG:
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }
    
    function borrarLogs() {
        if (confirm('¿Estás seguro de que deseas borrar todos los logs? Esta acción no se puede deshacer.')) {
            logger.clearLogs();
            cargarLogs();
        }
    }
</script>

<svelte:head>
    <title>Registros del Sistema | Administración</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-6 max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
                <h1 class="text-2xl font-serif text-indigo-600 tracking-wide">Sistema de Formularios</h1>
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-800">{$userStore?.nombre || 'Usuario'}</span>
                        <span class="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-md font-medium">
                            Administrador
                        </span>
                    </div>
                    
                    <a href="/formularios" class="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Volver
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Título principal -->
        <div class="bg-white text-gray-800 p-6 rounded-lg shadow-sm mb-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div class="w-full">
                    <h1 class="text-2xl font-bold mb-2">Registros del Sistema</h1>
                    <p class="text-gray-600">
                        Vista de administrador para monitoreo de eventos y errores del sistema.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Filtros -->
        <div class="bg-white p-6 rounded shadow-sm mb-8">
            <div class="flex flex-row flex-nowrap justify-center items-center gap-8 overflow-x-auto py-4">
                <div class="min-w-[250px] max-w-sm">
                    <input
                        type="text"
                        id="busqueda"
                        bind:value={busqueda}
                        placeholder="Buscar en logs..."
                        class="block w-full text-lg h-14 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div class="min-w-[250px] max-w-sm">
                    <select
                        id="filtroNivel"
                        bind:value={filtroNivel}
                        class="w-full text-lg h-14 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-colors font-medium"
                    >
                        <option value="ALL">Todos los niveles</option>
                        <option value={LogLevel.INFO}>Información</option>
                        <option value={LogLevel.WARNING}>Advertencia</option>
                        <option value={LogLevel.ERROR}>Error</option>
                        <option value={LogLevel.DEBUG}>Depuración</option>
                    </select>
                </div>
                <div class="min-w-[150px]">
                    <button
                        on:click={borrarLogs}
                        class="w-full h-14 text-base bg-red-500 hover:bg-red-600 text-white font-medium px-5 rounded-md transition-colors"
                    >
                        Borrar Logs
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Tabla de logs -->
        <div class="bg-white rounded-lg shadow-sm p-6 overflow-hidden">
            {#if obtenerLogsFiltrados().length === 0}
                <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">No hay registros disponibles</h3>
                    <p class="mt-2 text-sm text-gray-500">
                        {#if filtroNivel !== 'ALL' || busqueda}
                            No se encontraron registros que coincidan con los filtros seleccionados.
                        {:else}
                            No hay registros en el sistema actualmente.
                        {/if}
                    </p>
                </div>
            {:else}
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nivel
                                </th>
                                <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mensaje
                                </th>
                                <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Detalles
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#each obtenerLogsFiltrados() as log, i (i)}
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatearFecha(log.timestamp)}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full border {getNivelColor(log.level)}">
                                            {log.level}
                                        </span>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 max-w-md truncate">
                                        {log.message}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500">
                                        {#if log.details}
                                            <pre class="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-auto">{JSON.stringify(log.details, null, 2)}</pre>
                                        {:else}
                                            <span class="text-gray-400">-</span>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 