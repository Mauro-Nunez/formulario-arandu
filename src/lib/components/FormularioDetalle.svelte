<script lang="ts">
    import { aprobarInscripcionArtistica, rechazarInscripcionArtistica } from '$lib/services/inscripcionesService';
    import { userStore } from '$lib/stores';
    export let inscripcion: any;
    export let cerrar: () => void;
    export let recargarInscripciones: () => void;

    // Formato para fecha
    function formatearFecha(fecha: string) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Funciones para aprobar y rechazar inscripciones
    async function handleAprobar() {
        try {
            const response = await fetch('/api/inscripciones/aprobar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: inscripcion.id })
            });

            const result = await response.json();
            
            if (result.success) {
                recargarInscripciones();
                cerrar();
            } else {
                console.error('Error al aprobar inscripción:', result.error);
                alert('Error al aprobar la inscripción: ' + result.error);
            }
        } catch (error) {
            console.error('Error al aprobar inscripción:', error);
            alert('Error al aprobar la inscripción');
        }
    }

    async function handleRechazar() {
        try {
            const response = await fetch('/api/inscripciones/rechazar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: inscripcion.id })
            });

            const result = await response.json();
            
            if (result.success) {
                recargarInscripciones();
                cerrar();
            } else {
                console.error('Error al rechazar inscripción:', result.error);
                alert('Error al rechazar la inscripción: ' + result.error);
            }
        } catch (error) {
            console.error('Error al rechazar inscripción:', error);
            alert('Error al rechazar la inscripción');
        }
    }
</script>

<div class="modal-overlay">
    <div class="modal-container">
        <div class="modal-header">
            <div>
                <h2 class="modal-title">{inscripcion.disciplina}: {inscripcion.nombre}</h2>
                <div class="modal-subtitle">
                    <span class={`status-badge ${inscripcion.estado === 'aprobado' ? 'approved' : 
                        inscripcion.estado === 'pendiente' ? 'pending' : 'rejected'}`}
                    >
                        {inscripcion.estado.charAt(0).toUpperCase() + inscripcion.estado.slice(1)}
                    </span>
                    <span class="date-info">Enviado: {formatearFecha(inscripcion.fecha_creacion)}</span>
                </div>
            </div>
            <button 
                onclick={cerrar}
                class="close-button"
                aria-label="Cerrar modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="modal-content">
            <div class="section">
                <h3 class="section-title">Información de Contacto</h3>
                <div class="info-box field-grid">
                    <div>
                        <p class="field-label">Email</p>
                        <p class="field-value">{inscripcion.email}</p>
                    </div>
                    <div>
                        <p class="field-label">Teléfono</p>
                        <p class="field-value">{inscripcion.telefono}</p>
                    </div>
                </div>
            </div>

            <!-- Información específica de la disciplina -->
            {#if inscripcion.disciplina === 'Danza'}
                <div class="section">
                    <div>
                        <h3 class="section-title">Descripción de la Coreografía</h3>
                        <p class="description-box">{inscripcion.descripcion}</p>
                    </div>
                    
                    <div>
                        <h3 class="section-title">Ficha Artística</h3>
                        {#if inscripcion.ficha_artistica || inscripcion.fichaArtistica}
                            <div class="info-box">
                                <a href={`/${inscripcion.ficha_artistica || inscripcion.fichaArtistica}`} 
                                   target="_blank" 
                                   class="download-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver ficha artística
                                </a>
                            </div>
                        {:else}
                            <p class="description-box text-gray-500">No hay ficha artística disponible</p>
                        {/if}
                    </div>
                    
                    <div>
                        <h3 class="section-title">Declaración Jurada</h3>
                        {#if inscripcion.declaracion_jurada || inscripcion.declaracionJurada}
                            <div class="info-box">
                                <a href={`/${inscripcion.declaracion_jurada || inscripcion.declaracionJurada}`} 
                                   target="_blank" 
                                   class="download-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver declaración jurada
                                </a>
                            </div>
                        {:else}
                            <p class="description-box text-gray-500">No hay declaración jurada disponible</p>
                        {/if}
                    </div>
                    
                    <div>
                        <h3 class="section-title">Historia</h3>
                        <p class="description-box">{inscripcion.historia_solista || inscripcion.historiaSolista || 'No disponible'}</p>
                    </div>

                    <div>
                        <h3 class="section-title">Integrantes en Escena</h3>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>DNI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each inscripcion.integrantesEnEscena || [] as integrante}
                                        <tr>
                                            <td>{integrante.nombre}</td>
                                            <td>{integrante.apellido}</td>
                                            <td>{integrante.dni}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {#if inscripcion.integrantesFueraEscena && inscripcion.integrantesFueraEscena.length > 0}
                        <div>
                            <h3 class="section-title">Integrantes Fuera de Escena</h3>
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rol</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>DNI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each inscripcion.integrantesFueraEscena as integrante}
                                            <tr>
                                                <td>{integrante.rol}</td>
                                                <td>{integrante.nombre}</td>
                                                <td>{integrante.apellido}</td>
                                                <td>{integrante.dni}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else if inscripcion.disciplina === 'Teatro'}
                <div class="section">
                    <div class="info-box field-grid">
                        <div>
                            <p class="field-label">Autor</p>
                            <p class="field-value">{inscripcion.autor}</p>
                        </div>
                        <div>
                            <p class="field-label">Duración</p>
                            <p class="field-value">{inscripcion.duracion}</p>
                        </div>
                        <div>
                            <p class="field-label">Género</p>
                            <p class="field-value">{inscripcion.genero}</p>
                        </div>
                        <div>
                            <p class="field-label">Destinatarios</p>
                            <p class="field-value">{inscripcion.destinatarios}</p>
                        </div>
                        <div>
                            <p class="field-label">Grupo Teatral</p>
                            <p class="field-value">{inscripcion.nombreGrupo || inscripcion.nombre_grupo || 'No especificado'}</p>
                        </div>
                        <div>
                            <p class="field-label">Estreno</p>
                            <p class="field-value">{inscripcion.fechaEstreno || inscripcion.fecha_estreno ? formatearFecha(inscripcion.fechaEstreno || inscripcion.fecha_estreno) : 'No especificado'}</p>
                        </div>
                        <div>
                            <p class="field-label">Número de Funciones</p>
                            <p class="field-value">{inscripcion.numeroFunciones || inscripcion.numero_funciones || 'No especificado'}</p>
                        </div>
                        <div>
                            <p class="field-label">Tipo</p>
                            <p class="field-value">{inscripcion.es_concertado ? 'Espectáculo concertado' : 'Espectáculo no concertado'}</p>
                        </div>
                    </div>

                    <div>
                        <h3 class="section-title">Sinopsis</h3>
                        <p class="description-box">{inscripcion.sinopsis || 'No disponible'}</p>
                    </div>
                    
                    <div>
                        <h3 class="section-title">Ficha Artística</h3>
                        {#if inscripcion.ficha_artistica || inscripcion.fichaArtistica}
                            <div class="info-box">
                                <a href={`/${inscripcion.ficha_artistica || inscripcion.fichaArtistica}`} 
                                   target="_blank" 
                                   class="download-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver ficha artística
                                </a>
                            </div>
                        {:else}
                            <p class="description-box text-gray-500">No hay ficha artística disponible</p>
                        {/if}
                    </div>
                    
                    <div>
                        <h3 class="section-title">Declaración Jurada</h3>
                        {#if inscripcion.declaracion_jurada || inscripcion.declaracionJurada}
                            <div class="info-box">
                                <a href={`/${inscripcion.declaracion_jurada || inscripcion.declaracionJurada}`} 
                                   target="_blank" 
                                   class="download-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver declaración jurada
                                </a>
                            </div>
                        {:else}
                            <p class="description-box text-gray-500">No hay declaración jurada disponible</p>
                        {/if}
                    </div>

                    {#if inscripcion.elenco && inscripcion.elenco.length > 0}
                        <div>
                            <h3 class="section-title">Elenco</h3>
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rol</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>DNI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each inscripcion.elenco as integrante}
                                            <tr>
                                                <td>{integrante.rol}</td>
                                                <td>{integrante.nombre}</td>
                                                <td>{integrante.apellido}</td>
                                                <td>{integrante.dni}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else if inscripcion.disciplina === 'Música'}
                <div class="section">
                    <div>
                        <h3 class="section-title">Descripción</h3>
                        <p class="description-box">{inscripcion.descripcion}</p>
                    </div>
                    
                    <div>
                        <h3 class="section-title">Material Entregado</h3>
                        <p class="description-box">{inscripcion.descripcionMaterial}</p>
                    </div>
                    
                    <div>
                        <h3 class="section-title">Historia</h3>
                        <p class="description-box">{inscripcion.historia}</p>
                    </div>

                    <div>
                        <h3 class="section-title">Integrantes</h3>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>DNI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each inscripcion.integrantes || [] as integrante}
                                        <tr>
                                            <td>{integrante.nombre}</td>
                                            <td>{integrante.apellido}</td>
                                            <td>{integrante.dni}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {#if inscripcion.colaboradores && inscripcion.colaboradores.length > 0}
                        <div>
                            <h3 class="section-title">Colaboradores</h3>
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rol</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>DNI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each inscripcion.colaboradores as colaborador}
                                            <tr>
                                                <td>{colaborador.rol}</td>
                                                <td>{colaborador.nombre}</td>
                                                <td>{colaborador.apellido}</td>
                                                <td>{colaborador.dni}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="section">
                    <div>
                        <h3 class="section-title">Descripción</h3>
                        <p class="description-box">{inscripcion.descripcion}</p>
                    </div>
                    
                    <div class="info-box field-grid">
                        {#if inscripcion.nombreAutor}
                            <div>
                                <p class="field-label">Autor/a</p>
                                <p class="field-value">{inscripcion.nombreAutor} {inscripcion.apellidoAutor}</p>
                            </div>
                        {/if}
                        
                        {#if inscripcion.dniAutor}
                            <div>
                                <p class="field-label">DNI</p>
                                <p class="field-value">{inscripcion.dniAutor}</p>
                            </div>
                        {/if}

                        {#if inscripcion.tecnica}
                            <div>
                                <p class="field-label">Técnica</p>
                                <p class="field-value">{inscripcion.tecnica}</p>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}

            <!-- Contenido del Proyecto -->
            <div class="section">
                <h3 class="section-title">Contenido de la Presentación</h3>
                {#if inscripcion.tipo_contenido === 'archivo' || inscripcion.tipoContenido === 'archivo'}
                    <div class="info-box">
                        <p class="field-label">Archivo</p>
                        {#if inscripcion.archivo_contenido || inscripcion.archivoContenido}
                            <a href={`/${inscripcion.archivo_contenido || inscripcion.archivoContenido}`} 
                               target="_blank" 
                               class="download-link">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Ver archivo
                            </a>
                        {:else}
                            <p class="field-value text-gray-500">No hay archivo disponible</p>
                        {/if}
                    </div>
                {:else}
                    <div class="info-box">
                        <p class="field-label">Enlace</p>
                        {#if inscripcion.link_contenido || inscripcion.linkContenido}
                            <a href={inscripcion.link_contenido || inscripcion.linkContenido} 
                               target="_blank" 
                               class="external-link">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Ver contenido
                            </a>
                        {:else}
                            <p class="field-value text-gray-500">No hay enlace disponible</p>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Acciones de Formulario para inscripciones pendientes -->
            {#if $userStore?.es_admin && inscripcion.estado === 'pendiente'}
                <div class="actions">
                    <button class="button reject" onclick={handleRechazar}>
                        Rechazar
                    </button>
                    <button class="button approve" onclick={handleAprobar}>
                        Aprobar
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Overlay para el modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        z-index: 50;
    }

    /* Contenedor del modal */
    .modal-container {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        width: 100%;
        max-width: 56rem;
        max-height: 90vh;
        overflow-y: auto;
        margin: 0 1rem;
    }

    /* Encabezado del modal */
    .modal-header {
        position: sticky;
        top: 0;
        background-color: white;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .modal-subtitle {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .status-badge {
        padding: 0.35rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .status-badge.approved {
        background-color: #DEF7EC;
        color: #046C4E;
        border: 1px solid #BEE3D4;
    }

    .status-badge.pending {
        background-color: #FEF3C7;
        color: #92400E;
        border: 1px solid #FDE68A;
    }

    .status-badge.rejected {
        background-color: #FDE2E2;
        color: #C81E1E;
        border: 1px solid #FDB5B5;
    }

    .date-info {
        font-size: 0.875rem;
        color: #6B7280;
    }

    .close-button {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 9999px;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-button:hover {
        background-color: #F3F4F6;
        color: #4B5563;
    }
    
    .close-icon {
        width: 1.25rem;
        height: 1.25rem;
    }

    /* Contenido del modal */
    .modal-content {
        padding: 2rem;
    }

    .section {
        margin-bottom: 2.5rem;
    }

    .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
    }

    .info-box {
        background-color: #F9FAFB;
        border-radius: 0.75rem;
        padding: 1.5rem 2rem;
        margin-bottom: 1.5rem;
    }

    .field-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .field-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .field-label {
        font-size: 0.875rem;
        color: #6B7280;
        margin-bottom: 0.5rem;
    }

    .field-value {
        font-weight: 500;
        color: #1F2937;
    }

    .text-gray-500 {
        color: #6B7280 !important;
        font-weight: normal;
    }

    .description-box {
        background-color: #F9FAFB;
        border-radius: 0.75rem;
        padding: 1.5rem 2rem;
        margin-bottom: 1.5rem;
        white-space: pre-line;
        color: #374151;
    }

    /* Tablas */
    .table-container {
        overflow-x: auto;
        background-color: white;
        border-radius: 0.75rem;
        border: 1px solid #E5E7EB;
    }

    table {
        min-width: 100%;
        border-collapse: collapse;
    }

    thead {
        background-color: #F9FAFB;
    }

    th {
        padding: 1rem 1.5rem;
        text-align: left;
        font-size: 0.75rem;
        font-weight: 600;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    td {
        padding: 1rem 1.5rem;
        font-size: 0.875rem;
        color: #1F2937;
    }

    tbody tr {
        border-top: 1px solid #E5E7EB;
        transition: background-color 0.2s;
    }

    tbody tr:hover {
        background-color: #F9FAFB;
    }

    /* Enlaces */
    a.download-link, a.external-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: #2563EB;
        transition: color 0.2s;
    }

    a.download-link:hover, a.external-link:hover {
        color: #1D4ED8;
    }

    /* Acciones */
    .actions {
        display: flex;
        justify-content: flex-end;
        padding-top: 1.5rem;
        margin-top: 2rem;
        border-top: 1px solid #E5E7EB;
    }

    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s;
    }

    .button.reject {
        background-color: #EF4444;
        color: white;
        margin-right: 0.75rem;
    }

    .button.reject:hover {
        background-color: #DC2626;
    }

    .button.approve {
        background-color: #10B981;
        color: white;
    }

    .button.approve:hover {
        background-color: #059669;
    }

    /* Iconos */
    .close-icon {
        width: 1.25rem;
        height: 1.25rem;
    }
    
    .icon-link {
        width: 0.875rem;
        height: 0.875rem;
        margin-right: 0.5rem;
    }
</style> 