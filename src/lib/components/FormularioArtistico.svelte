<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { logger, LogLevel } from '$lib/logger';
    import { userStore } from '$lib/stores';
    
    let disciplinaSeleccionada = '';
    let aceptoBases = false;
    let formData = {
        nombre: '',
        descripcion: '',
        // Campos de contacto comunes
        email: '',
        telefono: '',
        // Campos comunes para contenido multimedia
        tipoContenido: 'archivo', // 'archivo' o 'link'
        linkContenido: '',
        archivoContenido: null as File | null,
        declaracionJurada: null as File | null,
        fichaArtistica:  null as File | null,
        // Campos para teatro
        autor: '',
        duracion: '',
        genero: '',
        destinatarios: '',
        sinopsis: '',
        fechaEstreno: '',
        numeroFunciones: '',
        nombreGrupo: '',
        esConcertado: false,
        responsableNombre: '',
        responsableApellido: '',
        responsableTelefono: '',
        responsableEmail: '',
        elenco: [] as { rol: string, nombre: string, apellido: string, dni: string }[],
        // Campos para música
        historia: '',
        descripcionMaterial: '',
        integrantes: [] as { nombre: string, apellido: string, dni: string }[],
        colaboradores: [] as { rol: string, nombre: string, apellido: string, dni: string }[],
        // Campos para letras
        nombreAutor: '',
        apellidoAutor: '',
        dniAutor: '',
        formatoPresentacion: 'digital',
        // Campos para fotografía y artes visuales
        tecnica: '',
        materialEntregado: '',
        formatoPresentacionFoto: 'digital',
        // Campos para artes visuales
        tipoObra: 'bidimensional', // 'bidimensional', 'tridimensional', 'historieta'
        medidas: {
            ancho: '',
            alto: '',
            profundidad: ''
        },
        dossierTecnico: '',
        sinopsisHistorieta: '',
        numeroPaginas: '',
        formatoHistorieta: 'digital', // 'digital' o 'impreso'
        // Campos para artes audiovisuales
        descripcionProyecto: '',
        nombreReferente: '',
        apellidoReferente: '',
        dniReferente: '',
        equipoTecnico: [] as { rol: string, nombre: string, apellido: string, dni: string }[],
        // Campos para danza
        historiaSolista: '',
        integrantesEnEscena: [] as { nombre: string, apellido: string, dni: string }[],
        integrantesFueraEscena: [] as { rol: string, nombre: string, apellido: string, dni: string }[]
    };

    const disciplinas = [
        { id: 'danza', nombre: 'Danza' },
        { id: 'teatro', nombre: 'Teatro' },
        { id: 'musica', nombre: 'Música' },
        { id: 'letras', nombre: 'Letras' },
        { id: 'fotografia', nombre: 'Fotografía' },
        { id: 'artesVisuales', nombre: 'Artes Visuales' },
        { id: 'artesAudiovisuales', nombre: 'Artes Audiovisuales' }
    ];

    let enviando = false;
    let formularioEnviado = false;
    let mensajeError = '';

    // Obtener el ID de disciplina a partir del texto
    function getDisciplinaId(disciplinaNombre: string): number {
        const disciplinasMap: Record<string, number> = {
            'danza': 1,
            'teatro': 2,
            'musica': 3,
            'letras': 4,
            'fotografia': 5,
            'artesVisuales': 6,
            'artesAudiovisuales': 7
        };
        
        return disciplinasMap[disciplinaNombre] || 0;
    }

    // Log de operación realizada
    function logOperacion(mensaje: string, nivel: LogLevel = LogLevel.INFO, detalles?: any) {
        logger.log(nivel, mensaje, detalles);
    }

    // Función para manejar el envío del formulario
    async function handleSubmit() {
        try {
            enviando = true;
            mensajeError = '';
            
            // Realizar validaciones adicionales
            if (!disciplinaSeleccionada) {
                throw new Error('Debe seleccionar una disciplina artística');
            }
            
            if (!formData.nombre || !formData.email) {
                throw new Error('Faltan campos obligatorios');
            }
            
            // Registrar inicio de operación
            logOperacion('Iniciando envío de formulario artístico', LogLevel.INFO, { 
                disciplina: disciplinaSeleccionada,
                nombre: formData.nombre
            });
            
            // Crear un objeto FormData para enviar tanto datos como archivos
            const formDataToSend = new FormData();
            
            // Agregar datos principales
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('disciplina', disciplinas.find(d => d.id === disciplinaSeleccionada)?.nombre || 'No especificada');
            formDataToSend.append('disciplina_id', getDisciplinaId(disciplinaSeleccionada).toString());
            formDataToSend.append('email', formData.email);
            formDataToSend.append('telefono', formData.telefono);
            formDataToSend.append('descripcion', formData.descripcion || '');
            formDataToSend.append('tipoContenido', formData.tipoContenido);
            formDataToSend.append('linkContenido', formData.linkContenido || '');
            formDataToSend.append('usuario_id', ($userStore?.id || 1).toString());
            
            // Agregar el archivo si existe
            if (formData.tipoContenido === 'archivo' && formData.archivoContenido) {
                formDataToSend.append('archivoContenido', formData.archivoContenido);
                
                logOperacion('Archivo preparado para enviar', LogLevel.INFO, {
                    nombre: formData.archivoContenido.name,
                    tipo: formData.archivoContenido.type,
                    tamaño: `${(formData.archivoContenido.size / 1024).toFixed(2)} KB`
                });
            }
            
            // Agregar campos específicos según disciplina en formato JSON
            if (disciplinaSeleccionada === 'danza') {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('fichaArtistica', formData.fichaArtistica || '');
                formDataToSend.append('historiaSolista', formData.historiaSolista || '');
                formDataToSend.append('integrantesEnEscena', JSON.stringify(formData.integrantesEnEscena || []));
                formDataToSend.append('integrantesFueraEscena', JSON.stringify(formData.integrantesFueraEscena || []));
            }
            
            if (disciplinaSeleccionada === 'teatro') {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('fichaArtistica', formData.fichaArtistica || '');
                formDataToSend.append('autor', formData.autor || '');
                formDataToSend.append('duracion', formData.duracion || '');
                formDataToSend.append('genero', formData.genero || '');
                formDataToSend.append('destinatarios', formData.destinatarios || '');
                formDataToSend.append('sinopsis', formData.sinopsis || '');
                formDataToSend.append('fechaEstreno', formData.fechaEstreno || '');
                formDataToSend.append('numeroFunciones', formData.numeroFunciones || '');
                formDataToSend.append('nombreGrupo', formData.nombreGrupo || '');
                formDataToSend.append('elenco', JSON.stringify(formData.elenco || []));
            }
            
            if (disciplinaSeleccionada === 'musica') {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('fichaArtistica', formData.fichaArtistica || '');
                formDataToSend.append('historia', formData.historia || '');
                formDataToSend.append('descripcionMaterial', formData.descripcionMaterial || '');
                formDataToSend.append('integrantes', JSON.stringify(formData.integrantes || []));
                formDataToSend.append('colaboradores', JSON.stringify(formData.colaboradores || []));
            }
            
            if (disciplinaSeleccionada === 'letras') {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('nombreAutor', formData.nombreAutor || '');
                formDataToSend.append('apellidoAutor', formData.apellidoAutor || '');
                formDataToSend.append('dniAutor', formData.dniAutor || '');
                formDataToSend.append('sinopsis', formData.sinopsis || '');
            }
            
            if (['fotografia', 'artesVisuales'].includes(disciplinaSeleccionada)) {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('nombreAutor', formData.nombreAutor || '');
                formDataToSend.append('apellidoAutor', formData.apellidoAutor || '');
                formDataToSend.append('dniAutor', formData.dniAutor || '');
                formDataToSend.append('tecnica', formData.tecnica || '');
                formDataToSend.append('materialEntregado', formData.materialEntregado || '');
            }
            
            if (disciplinaSeleccionada === 'artesAudiovisuales') {
                formDataToSend.append('declaracionJurada', formData.declaracionJurada || '');
                formDataToSend.append('nombreReferente', formData.nombreReferente || '');
                formDataToSend.append('apellidoReferente', formData.apellidoReferente || '');
                formDataToSend.append('dniReferente', formData.dniReferente || '');
                formDataToSend.append('equipoTecnico', JSON.stringify(formData.equipoTecnico || []));
                formDataToSend.append('sinopsis', formData.sinopsis || '');
                formDataToSend.append('duracion', formData.duracion || '');
                formDataToSend.append('genero', formData.genero || '');
                formDataToSend.append('destinatarios', formData.destinatarios || '');
                formDataToSend.append('descripcionProyecto', formData.descripcionProyecto || '');
            }
            
            // Enviar el formulario con FormData (sin especificar Content-Type para que el navegador lo establezca correctamente)
            const response = await fetch('/api/inscripciones', {
                method: 'POST',
                body: formDataToSend
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar la inscripción');
            }
            
            // Registrar resultado exitoso
            logOperacion('Formulario enviado con éxito', LogLevel.INFO, {
                nombre: formData.nombre,
                disciplina: disciplinas.find(d => d.id === disciplinaSeleccionada)?.nombre
            });
            
            // Marcamos como enviado
            formularioEnviado = true;
            
            // Después de 3 segundos, redirigimos a la página principal
            setTimeout(() => {
                // window.location.reload();
            }, 3000)
        } catch (error) {
            // Capturamos el error y lo registramos
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            mensajeError = `Ha ocurrido un error al enviar el formulario: ${errorMessage}. Por favor, intente nuevamente.`;
            
            // Registrar el error
            logOperacion(`Error al enviar formulario: ${errorMessage}`, LogLevel.ERROR, {
                disciplina: disciplinaSeleccionada,
                nombre: formData.nombre,
                error: error
            });
            
            console.error('Error al enviar formulario:', error);
        } finally {
            enviando = false;
        }
    }

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            formData.declaracionJurada = input.files[0];
        }
    }

    function handleFichaFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            formData.fichaArtistica = input.files[0];
        }
    }

    function handleContenidoChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            formData.archivoContenido = input.files[0];
        }
    }

    function resetContenido() {
        formData.archivoContenido = null;
        formData.linkContenido = '';
    }
</script>

<div class="formulario-container">
    <h1>Premios Arandú - Formulario de Inscripción Artística</h1>
    <p class="subtitulo">Convocatoria Bienal de Artes 2024</p>
    
    {#if mensajeError}
        <div class="mensaje-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{mensajeError}</p>
        </div>
    {/if}
    
    {#if formularioEnviado}
        <div class="mensaje-exito">
            <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 class="text-2xl font-bold mt-4">¡Inscripción Enviada con Éxito!</h2>
            <p class="mt-2">Gracias por participar en la Convocatoria Bienal de Artes .</p>
            <p class="mt-2">Será redirigido en unos segundos...</p>
        </div>
    {:else}
        <div class="bases-condiciones">
            <h2>BASES Y CONDICIONES DE PARTICIPACIÓN PREMIOS ARANDÚ</h2>
            
            <div class="info-importante">
                <h3>Período de Evaluación</h3>
                <p>Se evaluará la producción artística bienal comprendida desde la conformación del jurado hasta 40 días antes de la premiación (según lo establecido en Art. 13 del CAPÍTULO II REGLAMENTO DE LOS PREMIOS establecido en el ANEXO ÚNICO de la ORDENANZA III Nº 121).</p>
            </div>

            <div class="requisitos-generales">
                <h3>Requisitos Generales</h3>
                <ul>
                    <li>Ser mayor de edad</li>
                    <li>Tener residencia en la ciudad de Posadas con un mínimo de dos años en la misma</li>
                    <li>La residencia se demostrará con la presentación del documento nacional de identidad a la comisión organizadora</li>
                </ul>
            </div>

            <div class="restricciones">
                <h3>Restricciones</h3>
                <p>No podrán participar:</p>
                <ul>
                    <li>Funcionarios/as</li>
                    <li>Elenco artísticos estatales</li>
                    <li>Obras/producciones que hayan sido premiadas en ediciones anteriores</li>
                    <li>Personas con relación de parentesco hasta el segundo (2º) grado consanguíneo y/o de afinidad con algún miembro del jurado</li>
                </ul>
            </div>

            <div class="aceptacion-bases">
                <label class="checkbox-container">
                    <input type="checkbox" bind:checked={aceptoBases}>
                    <span>He leído y acepto las bases y condiciones de participación</span>
                </label>
            </div>
        </div>

        {#if aceptoBases}
            <form on:submit|preventDefault={handleSubmit}>
                <div class="form-section">
                    <label for="disciplina">Disciplina Artística:</label>
                    <select 
                        id="disciplina" 
                        bind:value={disciplinaSeleccionada} 
                        required
                    >
                        <option value="">Seleccione una disciplina</option>
                        {#each disciplinas as disciplina}
                            <option value={disciplina.id}>{disciplina.nombre}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-section">
                    <label for="nombre">Nombre de la obra/artista:</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        bind:value={formData.nombre} 
                        required
                    />
                </div>

                <div class="form-section contacto-section">
                    <h3>Información de Contacto</h3>
                    <div class="contacto-grid">
                        <div class="form-group">
                            <label for="email">Correo Electrónico:</label>
                            <input 
                                type="email" 
                                id="email" 
                                bind:value={formData.email} 
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="telefono">Teléfono:</label>
                            <input 
                                type="tel" 
                                id="telefono" 
                                bind:value={formData.telefono} 
                                placeholder="+54 376 XXXXXXX"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h4>Contenido de la presentación</h4>
                    <div class="info-box">
                        {#if disciplinaSeleccionada === 'danza' || disciplinaSeleccionada === 'teatro' || disciplinaSeleccionada === 'musica'}
                            <p>La obra puede presentarse de forma presencial o en formato digital. En caso de presentación digital, el video debe estar filmado a una sola cámara y en una sola toma, sin edición.</p>
                        {:else if disciplinaSeleccionada === 'letras'}
                            <p>La obra puede presentarse en formato digital (PDF) o presencial (tres copias impresas).</p>
                        {:else if disciplinaSeleccionada === 'fotografia'}
                            <p>La obra puede presentarse en formato digital (JPG o PDF) o presencial (tres copias impresas, tamaño mínimo 15x21 cm).</p>
                        {:else if disciplinaSeleccionada === 'artesVisuales'}
                            {#if formData.tipoObra === 'bidimensional'}
                                <p>Presentación presencial. Tamaño mínimo 15x21 cm, máximo 200 cm (incluyendo marco y/o soporte).</p>
                            {:else if formData.tipoObra === 'tridimensional'}
                                <p>Presentación presencial. Tamaño mínimo 15x21x5 cm, máximo 200 cm.</p>
                            {:else}
                                <p>Extensión máxima de 90 páginas, todas numeradas. Presentación en formato digital (PDF) o presencial (tres ejemplares impresos).</p>
                            {/if}
                        {:else if disciplinaSeleccionada === 'artesAudiovisuales'}
                            <p>Presentación en formato digital (video o link de visualización web).</p>
                        {/if}
                    </div>

                    <div class="contenido-options">
                        <div class="radio-option">
                            <input 
                                type="radio" 
                                id="tipoArchivo" 
                                name="tipoContenido" 
                                value="archivo" 
                                bind:group={formData.tipoContenido}
                                on:change={resetContenido}
                            />
                            <label for="tipoArchivo">Subir archivo</label>
                        </div>

                        <div class="radio-option">
                            <input 
                                type="radio" 
                                id="tipoLink" 
                                name="tipoContenido" 
                                value="link" 
                                bind:group={formData.tipoContenido}
                                on:change={resetContenido}
                            />
                            <label for="tipoLink">Enlace</label>
                        </div>
                    </div>

                    {#if formData.tipoContenido === 'archivo'}
                        <div class="archivo-upload">
                            <label for="archivoContenido">Archivo de presentación:</label>
                            <input 
                                type="file" 
                                id="archivoContenido" 
                                accept=".mp4,.mov,.avi,.pdf,.jpg,.jpeg,.png" 
                                on:change={handleContenidoChange}
                                required
                            />
                            <p class="formato-descripcion">
                                Formatos aceptados: MP4, MOV, AVI, PDF, JPG, JPEG, PNG
                            </p>
                        </div>
                    {:else}
                        <div class="link-input">
                            <label for="linkContenido">Enlace a la presentación:</label>
                            <input 
                                type="url" 
                                id="linkContenido" 
                                bind:value={formData.linkContenido} 
                                placeholder="https://..."
                                required
                            />
                        </div>
                    {/if}
                </div>

                {#if disciplinaSeleccionada === 'danza'}
                    <div class="form-section">
                        <label for="descripcion">Descripción de la coreografía/obra:</label>
                        <textarea 
                            id="descripcion" 
                            bind:value={formData.descripcion} 
                            required
                        ></textarea>

                        <label for="declaracionJurada">Declaración Jurada:</label>
                        <input 
                            type="file" 
                            id="declaracionJurada" 
                            accept=".pdf,.doc,.docx" 
                            on:change={handleFileChange}
                        />

                        <label for="fichaArtistica">Ficha artística y técnica:</label>
                        <input type="file" id="fichaArtistica" accept=".pdf,.doc,.docx" on:change={handleFichaFileChange} required />
                        <label for="historiaSolista">Breve historia del/a solista o grupo:</label>
                        <textarea 
                            id="historiaSolista" 
                            bind:value={formData.historiaSolista} 
                            required
                        ></textarea>

                        <h4>Integrantes en escena</h4>
                        {#each formData.integrantesEnEscena as integrante, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Nombre" bind:value={integrante.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={integrante.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={integrante.dni} required />
                                <button type="button" on:click={() => formData.integrantesEnEscena = formData.integrantesEnEscena.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.integrantesEnEscena = [...formData.integrantesEnEscena, { nombre: '', apellido: '', dni: '' }]}>
                            Agregar integrante en escena
                        </button>

                        <h4>Integrantes fuera de escena</h4>
                        {#each formData.integrantesFueraEscena as integrante, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Rol" bind:value={integrante.rol} required />
                                <input type="text" placeholder="Nombre" bind:value={integrante.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={integrante.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={integrante.dni} required />
                                <button type="button" on:click={() => formData.integrantesFueraEscena = formData.integrantesFueraEscena.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.integrantesFueraEscena = [...formData.integrantesFueraEscena, { rol: '', nombre: '', apellido: '', dni: '' }]}>
                            Agregar integrante fuera de escena
                        </button>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'teatro'}
                    <div class="form-section">
                        <label for="autor">Autor:</label>
                        <input type="text" id="autor" bind:value={formData.autor} required />

                        <label for="autorizacion">Autorización del autor o Argentores:</label>
                        <input type="file" id="autorizacion" accept=".pdf,.doc,.docx" on:change={handleFileChange} required />

                        <label for="duracion">Duración del espectáculo:</label>
                        <input type="text" id="duracion" bind:value={formData.duracion} required />

                        <label for="genero">Género:</label>
                        <input type="text" id="genero" bind:value={formData.genero} required />

                        <label for="destinatarios">Destinatarios:</label>
                        <input type="text" id="destinatarios" bind:value={formData.destinatarios} required />

                        <label for="sinopsis">Síntesis argumental (sinopsis):</label>
                        <textarea id="sinopsis" bind:value={formData.sinopsis} required></textarea>

                        <h4>Funciones</h4>
                        <label for="fechaEstreno">Fecha de estreno:</label>
                        <input type="date" id="fechaEstreno" bind:value={formData.fechaEstreno} required />

                        <label for="numeroFunciones">Número de funciones realizadas:</label>
                        <input type="number" id="numeroFunciones" bind:value={formData.numeroFunciones} min="0" required />

                        <h4>Grupo Teatral</h4>
                        <label for="nombreGrupo">Nombre del grupo:</label>
                        <input type="text" id="nombreGrupo" bind:value={formData.nombreGrupo} required />

                        <div class="checkbox-container">
                            <input type="checkbox" id="esConcertado" bind:checked={formData.esConcertado} />
                            <label for="esConcertado">Espectáculo concertado</label>
                        </div>

                        <h4>Contacto del responsable</h4>
                        <div class="contacto-form">
                            <input type="text" placeholder="Nombre" bind:value={formData.responsableNombre} required />
                            <input type="text" placeholder="Apellido" bind:value={formData.responsableApellido} required />
                            <input type="tel" placeholder="Teléfono" bind:value={formData.responsableTelefono} required />
                            <input type="email" placeholder="E-mail" bind:value={formData.responsableEmail} required />
                        </div>

                        <label for="fichaArtistica">Ficha artística:</label>
                        <input type="file" id="fichaArtistica" accept=".pdf,.doc,.docx" on:change={handleFichaFileChange} required />

                        <h4>Elenco</h4>
                        {#each formData.elenco as integrante, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Rol" bind:value={integrante.rol} required />
                                <input type="text" placeholder="Nombre" bind:value={integrante.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={integrante.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={integrante.dni} required />
                                <button type="button" on:click={() => formData.elenco = formData.elenco.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.elenco = [...formData.elenco, { rol: '', nombre: '', apellido: '', dni: '' }]}>
                            Agregar integrante al elenco
                        </button>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'musica'}
                    <div class="form-section">
                        <label for="descripcionMusica">Descripción de la misma:</label>
                        <textarea id="descripcionMusica" bind:value={formData.descripcion} required></textarea>

                        <label for="declaracionJurada">Declaración jurada sobre derecho de autor:</label>
                        <input type="file" id="declaracionJurada" accept=".pdf,.doc,.docx" on:change={handleFileChange} />

                        <label for="fichaArtistica">Ficha artística y técnica:</label>
                        <input type="file" id="fichaArtistica" accept=".pdf,.doc,.docx" on:change={handleFichaFileChange} required />

                        <label for="historia">Breve historia del solista/duo/banda:</label>
                        <textarea id="historia" bind:value={formData.historia} required></textarea>

                        <label for="descripcionMaterial">Descripción del material entregado:</label>
                        <textarea id="descripcionMaterial" bind:value={formData.descripcionMaterial} required></textarea>

                        <h4>Integrantes</h4>
                        {#each formData.integrantes as integrante, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Nombre" bind:value={integrante.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={integrante.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={integrante.dni} required />
                                <button type="button" on:click={() => formData.integrantes = formData.integrantes.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.integrantes = [...formData.integrantes, { nombre: '', apellido: '', dni: '' }]}>
                            Agregar integrante
                        </button>

                        <h4>Integrantes/Colaboradores</h4>
                        {#each formData.colaboradores as colaborador, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Rol" bind:value={colaborador.rol} required />
                                <input type="text" placeholder="Nombre" bind:value={colaborador.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={colaborador.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={colaborador.dni} required />
                                <button type="button" on:click={() => formData.colaboradores = formData.colaboradores.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.colaboradores = [...formData.colaboradores, { rol: '', nombre: '', apellido: '', dni: '' }]}>
                            Agregar colaborador
                        </button>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'letras'}
                    <div class="form-section">
                        <label for="sinopsisLetras">Breve sinopsis:</label>
                        <textarea id="sinopsisLetras" bind:value={formData.sinopsis} required></textarea>

                        <label for="declaracionJuradaLetras">Declaración jurada sobre derechos de autor:</label>
                        <input type="file" id="declaracionJuradaLetras" accept=".pdf,.doc,.docx" on:change={handleFileChange} required />

                        <h4>Datos personales del autor</h4>
                        <div class="datos-personales">
                            <input type="text" placeholder="Nombre" bind:value={formData.nombreAutor} required />
                            <input type="text" placeholder="Apellido" bind:value={formData.apellidoAutor} required />
                            <input type="text" placeholder="DNI" bind:value={formData.dniAutor} required />
                        </div>

                        <h4>Formato de presentación</h4>
                        <div class="formato-presentacion">
                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="formatoDigital" 
                                    name="formatoPresentacion" 
                                    value="digital" 
                                    bind:group={formData.formatoPresentacion}
                                />
                                <label for="formatoDigital">Formato Digital</label>
                                <p class="formato-descripcion">
                                    Deberá ser enviado en formato PDF con el asunto "Obra – Arandú – Rubro Letras" 
                                    y adjuntar datos del autor/a y de la producción (breve reseña o descripción de la obra)
                                </p>
                            </div>

                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="formatoImpreso" 
                                    name="formatoPresentacion" 
                                    value="impreso" 
                                    bind:group={formData.formatoPresentacion}
                                />
                                <label for="formatoImpreso">Formato Impreso</label>
                                <p class="formato-descripcion">
                                    Se deberán entregar tres (3) copias del material editado
                                </p>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'fotografia'}
                    <div class="form-section">
                        <label for="descripcionFotografia">Descripción de la obra:</label>
                        <textarea id="descripcionFotografia" bind:value={formData.descripcion} required></textarea>

                        <label for="declaracionJuradaFotografia">Declaración jurada sobre derechos de autor:</label>
                        <input type="file" id="declaracionJuradaFotografia" accept=".pdf,.doc,.docx" on:change={handleFileChange} required />

                        <label for="tecnica">Técnica / Descripción del material entregado:</label>
                        <textarea id="tecnica" bind:value={formData.tecnica} required></textarea>

                        <h4>Datos personales del autor</h4>
                        <div class="datos-personales">
                            <input type="text" placeholder="Nombre" bind:value={formData.nombreAutor} required />
                            <input type="text" placeholder="Apellido" bind:value={formData.apellidoAutor} required />
                            <input type="text" placeholder="DNI" bind:value={formData.dniAutor} required />
                        </div>

                        <h4>Formato de presentación</h4>
                        <div class="formato-presentacion">
                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="formatoDigitalFoto" 
                                    name="formatoPresentacionFoto" 
                                    value="digital" 
                                    bind:group={formData.formatoPresentacionFoto}
                                />
                                <label for="formatoDigitalFoto">Formato Digital</label>
                                <p class="formato-descripcion">
                                    Deberá enviarse el material en formato JPG ó PDF con el asunto "Obra – Arandú – Rubro Fotografía" 
                                    y adjuntar datos del autor/a y de la producción (breve reseña o descripción de la obra)
                                </p>
                            </div>

                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="formatoImpresoFoto" 
                                    name="formatoPresentacionFoto" 
                                    value="impreso" 
                                    bind:group={formData.formatoPresentacionFoto}
                                />
                                <label for="formatoImpresoFoto">Formato Impreso</label>
                                <p class="formato-descripcion">
                                    Se deberán entregar tres (3) copias con un tamaño mínimo de 15x21 cm
                                </p>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'artesVisuales'}
                    <div class="form-section">
                        <label for="descripcionArtesVisuales">Descripción de la obra:</label>
                        <textarea id="descripcionArtesVisuales" bind:value={formData.descripcion} required></textarea>

                        <label for="declaracionJuradaArtesVisuales">Declaración jurada sobre derecho de autor:</label>
                        <input type="file" id="declaracionJuradaArtesVisuales" accept=".pdf,.doc,.docx" on:change={handleFileChange} required />

                        <label for="tecnicaArtesVisuales">Técnica:</label>
                        <input type="text" id="tecnicaArtesVisuales" bind:value={formData.tecnica} required />

                        <h4>Datos personales</h4>
                        <div class="datos-personales">
                            <input type="text" placeholder="Nombre" bind:value={formData.nombreAutor} required />
                            <input type="text" placeholder="Apellido" bind:value={formData.apellidoAutor} required />
                            <input type="text" placeholder="DNI" bind:value={formData.dniAutor} required />
                        </div>

                        <h4>Tipo de obra</h4>
                        <div class="tipo-obra">
                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="tipoBidimensional" 
                                    name="tipoObra" 
                                    value="bidimensional" 
                                    bind:group={formData.tipoObra}
                                />
                                <label for="tipoBidimensional">Obra Bidimensional (pintura, ilustración, grabado, dibujo)</label>
                                <p class="formato-descripcion">
                                    Tamaño mínimo: 15x21 cm<br>
                                    Tamaño máximo: 200 cm (incluyendo marco y/o soporte)
                                </p>
                            </div>

                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="tipoTridimensional" 
                                    name="tipoObra" 
                                    value="tridimensional" 
                                    bind:group={formData.tipoObra}
                                />
                                <label for="tipoTridimensional">Obra Tridimensional (escultura, objetos, instalaciones)</label>
                                <p class="formato-descripcion">
                                    Tamaño mínimo: 15x21x5 cm<br>
                                    Tamaño máximo: 200 cm
                                </p>
                            </div>

                            <div class="radio-option">
                                <input 
                                    type="radio" 
                                    id="tipoHistorieta" 
                                    name="tipoObra" 
                                    value="historieta" 
                                    bind:group={formData.tipoObra}
                                />
                                <label for="tipoHistorieta">Historieta/Comic</label>
                                <p class="formato-descripcion">
                                    Extensión máxima: 90 páginas<br>
                                    Todas las páginas deben estar numeradas
                                </p>
                            </div>
                        </div>

                        {#if formData.tipoObra !== 'historieta'}
                            <h4>Medidas de la obra</h4>
                            <div class="medidas-form">
                                <div class="medida-input">
                                    <label for="ancho">Ancho (cm):</label>
                                    <input type="number" id="ancho" bind:value={formData.medidas.ancho} required min="15" max="200" />
                                </div>
                                <div class="medida-input">
                                    <label for="alto">Alto (cm):</label>
                                    <input type="number" id="alto" bind:value={formData.medidas.alto} required min="21" max="200" />
                                </div>
                                {#if formData.tipoObra === 'tridimensional'}
                                    <div class="medida-input">
                                        <label for="profundidad">Profundidad (cm):</label>
                                        <input type="number" id="profundidad" bind:value={formData.medidas.profundidad} required min="5" max="200" />
                                    </div>
                                {/if}
                            </div>

                            <label for="dossierTecnico">Dossier técnico (descripción de materiales, técnica, pesos, medidas, plano, etc.):</label>
                            <textarea id="dossierTecnico" bind:value={formData.dossierTecnico} required></textarea>
                        {:else}
                            <h4>Formato de presentación</h4>
                            <div class="formato-presentacion">
                                <div class="radio-option">
                                    <input 
                                        type="radio" 
                                        id="formatoDigitalHistorieta" 
                                        name="formatoHistorieta" 
                                        value="digital" 
                                        bind:group={formData.formatoHistorieta}
                                    />
                                    <label for="formatoDigitalHistorieta">Formato Digital</label>
                                    <p class="formato-descripcion">
                                        Deberá enviarse en formato PDF
                                    </p>
                                </div>

                                <div class="radio-option">
                                    <input 
                                        type="radio" 
                                        id="formatoImpresoHistorieta" 
                                        name="formatoHistorieta" 
                                        value="impreso" 
                                        bind:group={formData.formatoHistorieta}
                                    />
                                    <label for="formatoImpresoHistorieta">Formato Impreso</label>
                                    <p class="formato-descripcion">
                                        Se deberán entregar tres (3) ejemplares
                                    </p>
                                </div>
                            </div>

                            <label for="sinopsisHistorieta">Síntesis argumental (sinopsis de hasta 1 carilla):</label>
                            <textarea id="sinopsisHistorieta" bind:value={formData.sinopsisHistorieta} required></textarea>

                            <label for="numeroPaginas">Número de páginas:</label>
                            <input type="number" id="numeroPaginas" bind:value={formData.numeroPaginas} required min="1" max="90" />
                        {/if}

                        <label for="materialEntregado">Descripción del material entregado:</label>
                        <textarea id="materialEntregado" bind:value={formData.materialEntregado} required></textarea>
                    </div>
                {/if}

                {#if disciplinaSeleccionada === 'artesAudiovisuales'}
                    <div class="form-section">
                        <label for="sinopsisAudiovisual">Breve sinopsis:</label>
                        <textarea id="sinopsisAudiovisual" bind:value={formData.sinopsis} required></textarea>

                        <label for="descripcionProyecto">Descripción del proyecto:</label>
                        <textarea 
                            id="descripcionProyecto" 
                            bind:value={formData.descripcionProyecto} 
                            required 
                            placeholder="Propuesta narrativa, artística y estética: recursos expresivos y formales, tratamiento audiovisual y referencias"
                        ></textarea>

                        <label for="declaracionJuradaAudiovisual">Declaración jurada sobre derecho de autor:</label>
                        <input type="file" id="declaracionJuradaAudiovisual" accept=".pdf,.doc,.docx" on:change={handleFileChange} required />

                        <div class="grid-form">
                            <div class="form-group">
                                <label for="duracionAudiovisual">Duración:</label>
                                <input type="text" id="duracionAudiovisual" bind:value={formData.duracion} required />
                            </div>

                            <div class="form-group">
                                <label for="generoAudiovisual">Género:</label>
                                <input type="text" id="generoAudiovisual" bind:value={formData.genero} required />
                            </div>

                            <div class="form-group">
                                <label for="destinatariosAudiovisual">Destinatarios:</label>
                                <input type="text" id="destinatariosAudiovisual" bind:value={formData.destinatarios} required />
                            </div>
                        </div>

                        <h4>Datos del referente del proyecto</h4>
                        <div class="datos-personales">
                            <input type="text" placeholder="Nombre" bind:value={formData.nombreReferente} required />
                            <input type="text" placeholder="Apellido" bind:value={formData.apellidoReferente} required />
                            <input type="text" placeholder="DNI" bind:value={formData.dniReferente} required />
                        </div>

                        <h4>Equipo técnico, colaboradores e integrantes</h4>
                        {#each formData.equipoTecnico as integrante, i}
                            <div class="integrante-form">
                                <input type="text" placeholder="Rol" bind:value={integrante.rol} required />
                                <input type="text" placeholder="Nombre" bind:value={integrante.nombre} required />
                                <input type="text" placeholder="Apellido" bind:value={integrante.apellido} required />
                                <input type="text" placeholder="DNI" bind:value={integrante.dni} required />
                                <button type="button" on:click={() => formData.equipoTecnico = formData.equipoTecnico.filter((_, index) => index !== i)}>Eliminar</button>
                            </div>
                        {/each}
                        <button type="button" on:click={() => formData.equipoTecnico = [...formData.equipoTecnico, { rol: '', nombre: '', apellido: '', dni: '' }]}>
                            Agregar integrante/colaborador
                        </button>

                        <div class="info-box">
                            <p><strong>Nota:</strong> El material deberá ser enviado en formato de video o un link de visualización web, con el asunto "Obra – Arandú – Rubro Audiovisual".</p>
                        </div>
                    </div>
                {/if}

                <button type="submit" disabled={enviando}>
                    {#if enviando}
                        <span class="spinner"></span>
                        Enviando...
                    {:else}
                        Enviar Formulario
                    {/if}
                </button>
            </form>
        {:else}
            <div class="mensaje-aceptacion">
                <p>Para continuar con la inscripción, por favor lea y acepte las bases y condiciones de participación.</p>
            </div>
        {/if}
    {/if}
</div>

<style>
    .formulario-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
    }

    h1 {
        text-align: center;
        margin-bottom: 15px;
        color: #2c3e50;
        font-size: 2.8em;
        font-weight: 700;
        letter-spacing: -0.5px;
    }

    .form-section {
        background-color: white;
        margin-bottom: 25px;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .form-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .form-section + .form-section {
        margin-top: 30px;
    }

    label {
        display: block;
        margin-bottom: 12px;
        font-weight: 500;
        color: #2c3e50;
        font-size: 1.1em;
    }

    input, select, textarea {
        width: 100%;
        padding: 12px;
        margin-bottom: 20px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1em;
        transition: border-color 0.2s ease;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    textarea {
        min-height: 120px;
        resize: vertical;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 14px 28px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1em;
        font-weight: 500;
        width: 100%;
        margin-top: 20px;
        transition: background-color 0.2s ease, transform 0.2s ease;
    }

    button:hover {
        background-color: #45a049;
        transform: translateY(-1px);
    }

    button:active {
        transform: translateY(1px);
    }

    h4 {
        color: #2c3e50;
        font-size: 1.3em;
        margin: 25px 0 15px;
        font-weight: 500;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 10px;
        letter-spacing: -0.2px;
    }

    input[type="file"] {
        padding: 15px;
        background-color: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        cursor: pointer;
    }

    .contenido-options {
        display: flex;
        gap: 30px;
        margin: 20px 0;
    }

    .radio-option {
        flex: 1;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 2px solid #e9ecef;
        transition: all 0.2s ease;
    }

    .radio-option:hover {
        border-color: #4CAF50;
        background-color: #f0f7f0;
    }

    .radio-option input[type="radio"] {
        width: auto;
        margin-right: 10px;
    }

    .radio-option label {
        display: inline;
        margin-left: 5px;
        font-size: 1.1em;
    }

    .formato-descripcion {
        margin: 15px 0 0 25px;
        font-size: 0.95em;
        color: #6c757d;
        line-height: 1.4;
    }

    .datos-personales {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }

    .integrante-form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 15px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        align-items: center;
    }

    .integrante-form button {
        margin: 0;
        padding: 8px 16px;
        background-color: #dc3545;
        font-size: 0.9em;
    }

    .integrante-form button:hover {
        background-color: #c82333;
    }

    .grid-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin: 25px 0;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .archivo-upload, .link-input {
        margin-top: 20px;
    }

    .archivo-upload input[type="file"] {
        padding: 15px;
        background-color: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        width: 100%;
        cursor: pointer;
    }

    .archivo-upload input[type="file"]:hover {
        border-color: #4CAF50;
        background-color: #f0f7f0;
    }

    .link-input input[type="url"] {
        width: 100%;
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1em;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }

    .checkbox-container input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .checkbox-container label {
        margin: 0;
    }

    .medidas-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 25px;
        margin: 25px 0;
    }

    .medida-input {
        display: flex;
        flex-direction: column;
    }

    .medida-input label {
        margin-bottom: 10px;
    }

    .medida-input input {
        width: 100%;
    }

    .bases-condiciones {
        background-color: white;
        margin-bottom: 35px;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .bases-condiciones h2 {
        color: #2c3e50;
        font-size: 2.2em;
        margin-bottom: 35px;
        text-align: center;
        font-weight: 700;
        letter-spacing: -0.5px;
    }

    .bases-condiciones h3 {
        color: #2c3e50;
        font-size: 1.5em;
        margin: 30px 0 20px;
        font-weight: 600;
        letter-spacing: -0.3px;
    }

    .info-importante {
        background-color: #e8f5e9;
        padding: 25px;
        border-radius: 8px;
        margin-bottom: 25px;
    }

    .info-importante p {
        margin: 12px 0;
        line-height: 1.6;
        color: #2c3e50;
    }

    .requisitos-generales, .restricciones {
        background-color: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        margin-bottom: 25px;
    }

    .requisitos-generales ul, .restricciones ul {
        list-style-type: none;
        padding-left: 20px;
    }

    .requisitos-generales li, .restricciones li {
        margin: 12px 0;
        position: relative;
        padding-left: 25px;
        line-height: 1.6;
    }

    .requisitos-generales li:before, .restricciones li:before {
        content: "•";
        color: #4CAF50;
        font-weight: bold;
        position: absolute;
        left: 0;
        font-size: 1.2em;
    }

    .aceptacion-bases {
        margin-top: 35px;
        padding: 25px;
        background-color: #f8f9fa;
        border-radius: 8px;
        text-align: center;
    }

    .aceptacion-bases .checkbox-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 0;
        padding: 0;
        background: none;
    }

    .aceptacion-bases input[type="checkbox"] {
        width: 20px;
        height: 20px;
        margin: 0;
    }

    .aceptacion-bases span {
        font-size: 1.1em;
        color: #2c3e50;
    }

    .mensaje-aceptacion {
        background-color: #fff3cd;
        color: #856404;
        padding: 25px;
        border-radius: 8px;
        text-align: center;
        margin-top: 25px;
        border: 1px solid #ffeeba;
    }

    .mensaje-aceptacion p {
        margin: 0;
        font-size: 1.1em;
        line-height: 1.5;
    }

    .subtitulo {
        text-align: center;
        color: #666;
        font-size: 1.4em;
        margin-top: -10px;
        margin-bottom: 40px;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        .formulario-container {
            padding: 15px;
        }

        .form-section {
            padding: 20px;
        }

        .integrante-form {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .contenido-options {
            flex-direction: column;
            gap: 15px;
        }

        .bases-condiciones {
            padding: 20px;
        }

        .bases-condiciones h2 {
            font-size: 1.8em;
        }

        .bases-condiciones h3 {
            font-size: 1.3em;
        }

        h1 {
            font-size: 2.2em;
        }

        .subtitulo {
            font-size: 1.2em;
            margin-bottom: 30px;
        }

        h2 {
            font-size: 1.8em;
        }

        h3 {
            font-size: 1.4em;
        }

        h4 {
            font-size: 1.2em;
        }
    }
    
    /* Estilos para el mensaje de éxito */
    .mensaje-exito {
        background-color: white;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 30px auto;
        max-width: 600px;
    }
    
    .mensaje-exito h2 {
        color: #2c3e50;
        margin-bottom: 15px;
    }
    
    .mensaje-exito p {
        color: #5a6268;
        font-size: 1.1em;
        line-height: 1.5;
    }

    /* Añadir estilos para mensajes de error */
    .mensaje-error {
        display: flex;
        align-items: center;
        background-color: #FEE2E2;
        color: #B91C1C;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid #FECACA;
    }

    .mensaje-error p {
        margin: 0;
        font-size: 1rem;
    }
    
    /* Estilos para el botón con estado de carga */
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style> 
