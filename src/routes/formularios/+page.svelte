<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userStore } from '$lib/stores';
    import { requireAuth, logout, loadUserIntoStore } from '$lib/auth';
    import FormularioDetalle from '$lib/components/FormularioDetalle.svelte';
    import { obtenerInscripciones, obtenerInscripcionPorId, type InscripcionArtistica } from '$lib/services/inscripcionesService';

    let inscripciones: InscripcionArtistica[] = [];
    let filtroEstado: 'todos' | 'pendiente' | 'aprobado' | 'rechazado' = 'todos';
    let filtroDisciplina: number | null = null;
    let cargando = true;
    let inscripcionSeleccionada: InscripcionArtistica | null = null;
    let busqueda = "";
    let error = "";

    // Array de disciplinas para el filtro (solo para administrador)
    const todasDisciplinas = [
        { id: 1, nombre: 'Danza' },
        { id: 2, nombre: 'Teatro' },
        { id: 3, nombre: 'Música' },
        { id: 4, nombre: 'Letras' },
        { id: 5, nombre: 'Fotografía' },
        { id: 6, nombre: 'Artes Visuales' },
        { id: 7, nombre: 'Artes Audiovisuales' }
    ];

    onMount(async () => {
        console.log("onMount en formularios, verificando usuario...");
        await requireAuth();
        
        console.log("Estado de userStore después de requireAuth:", $userStore);
        if (!$userStore) {
            console.log("No hay usuario en userStore después de requireAuth, intentando cargarlo...");
            const loadSuccess = await loadUserIntoStore();
            
            if (!loadSuccess) {
                console.log("No se pudo cargar el usuario, redirigiendo a login");
                goto('/login');
                return;
            }
        }

        console.log("Usuario verificado, cargando inscripciones...");
        await cargarInscripciones();
    });

    async function cargarInscripciones() {
        cargando = true;
        error = "";
        
        try {
            if ($userStore) {
                // Obtener inscripciones según el usuario usando el servicio real
                // Llamamos sin el segundo parámetro para usar el valor por defecto 'artistica'
                const listaInscripciones = await obtenerInscripciones($userStore);
                
                // Aplicar filtros si están seleccionados
                inscripciones = filtrarInscripciones(listaInscripciones);
            }
        } catch (err) {
            console.error("Error al cargar inscripciones:", err);
            error = "No se pudieron cargar las inscripciones. Intente nuevamente más tarde.";
            inscripciones = [];
        } finally {
            cargando = false;
        }
    }

    function filtrarInscripciones(lista: InscripcionArtistica[]): InscripcionArtistica[] {
        let resultado = [...lista];
        
        // Primero filtrar por disciplina del usuario si no es administrador
        if ($userStore && !$userStore.es_admin && $userStore.disciplina_id) {
            resultado = resultado.filter(inscripcion => inscripcion.disciplina_id === $userStore.disciplina_id);
        }
        
        // Filtrar por estado
        if (filtroEstado !== 'todos') {
            resultado = resultado.filter(inscripcion => inscripcion.estado === filtroEstado);
        }
        
        // Si es admin y hay filtro de disciplina
        if ($userStore?.es_admin && filtroDisciplina) {
            resultado = resultado.filter(inscripcion => inscripcion.disciplina_id === filtroDisciplina);
        }
        
        // Filtrar por búsqueda
        if (busqueda.trim() !== "") {
            const terminoBusqueda = busqueda.toLowerCase();
            resultado = resultado.filter(inscripcion => 
                inscripcion.nombre.toLowerCase().includes(terminoBusqueda) || 
                inscripcion.email.toLowerCase().includes(terminoBusqueda) ||
                (inscripcion.descripcion?.toLowerCase().includes(terminoBusqueda) || false)
            );
        }
        
        return resultado;
    }

    // Handler para cambios en los filtros
    async function handleFiltroEstadoChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        filtroEstado = target.value as any;
        await cargarInscripciones();
    }

    async function handleFiltroDisciplinaChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        filtroDisciplina = parseInt(target.value) || null;
        await cargarInscripciones();
    }

    async function handleBusquedaChange() {
        await cargarInscripciones();
    }

    // Función para formatear fechas
    function formatearFecha(fechaStr: string | Date): string {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Obtener el color de badge según el estado
    function getBadgeColor(estado: string): string {
        switch (estado) {
            case 'aprobado':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'pendiente':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'rechazado':
                return 'bg-rose-100 text-rose-800 border border-rose-200';
            default:
                return 'bg-slate-100 text-slate-800 border border-slate-200';
        }
    }

    // Ver detalles de una inscripción - adaptado para usar el servicio real
    async function verDetalles(inscripcion: InscripcionArtistica) {
        try {
            cargando = true;
            // Verificación para valores posiblemente undefined
            if (inscripcion.id === undefined) {
                throw new Error("ID de inscripción no válido");
            }
            const detalleCompleto = await obtenerInscripcionPorId(inscripcion.id);
            inscripcionSeleccionada = detalleCompleto;
        } catch (err) {
            console.error("Error al obtener detalles:", err);
            error = "No se pudieron cargar los detalles de la inscripción.";
        } finally {
            cargando = false;
        }
    }

    // Cerrar modal de detalles
    function cerrarDetalles() {
        inscripcionSeleccionada = null;
    }
</script>

<svelte:head>
    <title>Inscripciones | Sistema de Formularios por Disciplina</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-6 max-w-6xl">
        <!-- Header más colorido y amigable -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
                <h1 class="text-2xl font-serif text-indigo-600 tracking-wide">Sistema de Formularios</h1>
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center">
                        {#if $userStore?.disciplina}
                            <span class="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-md font-medium border border-emerald-200">
                                {$userStore.disciplina}
                            </span>
                        {:else if $userStore?.es_admin}
                            <span class="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-md font-medium">
                                Administrador
                            </span>
                        {/if}
                    </div>
                    
                    <button 
                        onclick={logout} 
                        class="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Encabezado de la página -->
        <div class="bg-white text-gray-800 p-6 rounded-lg shadow-sm mb-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div class="w-full text-center">
                    <h1 class="text-2xl font-bold mb-2">
                        {#if $userStore?.es_admin}
                            Todos los Formularios de Inscripción
                        {:else if $userStore?.disciplina}
                            Inscripciones de {$userStore.disciplina}
                        {:else}
                            Inscripciones
                        {/if}
                    </h1>
                    <p class="text-gray-600">
                        {#if $userStore?.es_admin}
                            Vista de administrador con acceso a todas las inscripciones de todas las disciplinas.
                        {:else}
                            Inscripciones recibidas para tu disciplina.
                        {/if}
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Filtros más grandes y con más margen -->
        <div class="bg-white p-6 rounded shadow-sm mb-8">
            <div class="flex flex-row flex-nowrap justify-center items-center gap-8 overflow-x-auto py-4">
                <div class="min-w-[250px] max-w-sm">
                    <input
                        type="text"
                        id="busqueda"
                        bind:value={busqueda}
                        oninput={handleBusquedaChange}
                        placeholder="Buscar..."
                        class="block w-full text-lg h-14 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div class="min-w-[250px] max-w-sm">
                    <select
                        id="filtroEstado"
                        bind:value={filtroEstado}
                        onchange={handleFiltroEstadoChange}
                        class="w-full text-lg h-14 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-colors font-medium"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                </div>
                {#if $userStore?.es_admin}
                    <div class="min-w-[250px] max-w-sm">
                        <select
                            id="filtroDisciplina"
                            onchange={handleFiltroDisciplinaChange}
                            class="w-full text-lg h-14 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-colors font-medium"
                        >
                            <option value="0">Todas las disciplinas</option>
                            {#each todasDisciplinas as disc}
                                <option value={disc.id}>{disc.nombre}</option>
                            {/each}
                        </select>
                    </div>
                {/if}
            </div>
        </div>
        
        <!-- Lista de inscripciones estilizada explícitamente con CSS -->
        {#if cargando}
            <div class="loading flex justify-center items-center py-12">
                <div class="spinner animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-600"></div>
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                <strong class="font-bold">Error:</strong>
                <span class="block sm:inline">{error}</span>
            </div>
        {:else if inscripciones.length === 0}
            <div class="empty-state bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="empty-icon inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-4">
                    <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay inscripciones disponibles</h3>
                <p class="text-gray-600 max-w-md mx-auto">
                    {#if filtroEstado !== 'todos' || filtroDisciplina || busqueda.trim() !== ""}
                        No se encontraron inscripciones con los filtros seleccionados. Prueba a modificar los criterios de búsqueda.
                    {:else}
                        No hay inscripciones disponibles para tu disciplina en este momento.
                    {/if}
                </p>
            </div>
        {:else}
            <div class="cards-grid">
                {#each inscripciones as inscripcion}
                    <div class="card">
                        <div class="card-body">
                            <div class="card-header">
                                <span class={`badge ${getBadgeColor(inscripcion.estado || 'pendiente')}`}>
                                    {(inscripcion.estado || 'pendiente').charAt(0).toUpperCase() + (inscripcion.estado || 'pendiente').slice(1)}
                                </span>
                                {#if $userStore?.es_admin && inscripcion.disciplina}
                                    <span class="badge badge-discipline">
                                        {inscripcion.disciplina}
                                    </span>
                                {/if}
                            </div>
                            
                            <h3 class="card-title">{inscripcion.nombre}</h3>
                            
                            <p class="card-description">
                                {inscripcion.descripcion || "Sin descripción"}
                            </p>
                            
                            <div class="card-meta">
                                <div class="meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatearFecha(inscripcion.fecha_creacion || new Date())}</span>
                                </div>
                                
                                <div class="meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span class="truncate">{inscripcion.email}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="card-actions">
                                <button 
                                    onclick={() => verDetalles(inscripcion)}
                                    class="action-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

{#if inscripcionSeleccionada}
    <FormularioDetalle 
        inscripcion={inscripcionSeleccionada} 
        cerrar={cerrarDetalles} 
        recargarInscripciones={cargarInscripciones}
    />
{/if}

<style>
  /* Ajustes generales */
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
    color: #333;
  }

  /* Iconos de interfaz (más pequeños) */
  :global(.search-icon),
  :global(.filter-icon) {
    width: 0.75rem;
    height: 0.75rem;
  }
  
  /* Icono del botón crear */
  :global(.create-icon) {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.5rem;
  }

  /* Grid de tarjetas */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  @media (min-width: 1280px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (min-width: 1536px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    }
  }

  /* Tarjeta */
  .card {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f1f1;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .card-body {
    padding: 1.25rem;
    flex-grow: 1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1.25rem;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    text-transform: capitalize;
  }

  .badge-approved {
    background-color: #DEF7EC;
    color: #046C4E;
    border: 1px solid #BCEAD5;
  }

  .badge-pending {
    background-color: #FEF3C7;
    color: #92400E;
    border: 1px solid #FDE68A;
  }

  .badge-rejected {
    background-color: #FDE2E2;
    color: #C81E1E;
    border: 1px solid #FDB5B5;
  }

  .badge-discipline {
    background-color: #F3F4F6;
    color: #4B5563;
    border: 1px solid #E5E7EB;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .card-description {
    margin-bottom: 1.25rem;
    color: #6B7280;
    font-size: 0.875rem;
    min-height: 4.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    color: #6B7280;
    font-size: 0.875rem;
  }

  .meta-icon {
    width: 1.125rem;
    height: 1.125rem;
    margin-right: 0.625rem;
    color: #9CA3AF;
    flex-shrink: 0;
  }

  /* Estado de carga */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .spinner {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top-color: #6b7280;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Estado vacío */
  .empty-state {
    background-color: white;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .empty-icon {
    background-color: #f9fafb;
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .empty-icon svg {
    width: 2.5rem;
    height: 2.5rem;
  }

  .card-footer {
    padding: 0.75rem 1.25rem;
    background-color: #F9FAFB;
    border-top: 1px solid #F3F4F6;
  }

  .card-actions {
    display: flex;
    justify-content: flex-start;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4B5563;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
    padding: 0.625rem 1rem;
    border-radius: 0.375rem;
    margin-right: 0.5rem;
  }

  .action-button:last-child {
    margin-right: 0;
  }

  .action-button:hover {
    color: #1F2937;
    background-color: #F3F4F6;
  }

  .action-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
</style> 