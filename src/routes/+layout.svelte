<script lang="ts">
	import '../app.css';
	import { userStore } from '$lib/stores';
	import { logout } from '$lib/auth';

	let { children } = $props();
</script>

<div class="layout">
	<main class="main">
		{@render children()}
	</main>

	<footer class="footer">
		<div class="container">
			<p>Sistema de Formularios por Disciplina © {new Date().getFullYear()}</p>
		</div>
	</footer>
</div>

<style>
	/* Layout principal */
	.layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* Estilos del contenido principal */
	.main {
		flex-grow: 1;
	}

	/* Estilos del pie de página */
	.footer {
		background-color: #f5f5f5;
		border-top: 1px solid #e5e5e5;
		padding: 1rem 0;
		text-align: center;
		color: #666;
		font-size: 0.875rem;
	}

	/* Contenedor común */
	.container {
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
	}
</style>
