import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { InscriptionFileService } from '$lib/server/file.service';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async ({ params }) => {
    try {
        // Extraer el nombre del archivo de la ruta
        const fileName = params.path;
        
        if (!fileName) {
            throw error(400, 'Nombre de archivo no proporcionado');
        }
        
        // Obtener el archivo
        const fileBuffer = await InscriptionFileService.readFile(fileName);
        
        // Determinar el tipo MIME según la extensión
        const extension = fileName.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream'; // Por defecto
        
        switch (extension) {
            case 'pdf':
                contentType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'gif':
                contentType = 'image/gif';
                break;
            case 'mp3':
                contentType = 'audio/mpeg';
                break;
            case 'mp4':
                contentType = 'video/mp4';
                break;
            case 'txt':
                contentType = 'text/plain';
                break;
            case 'docx':
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'xlsx':
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
        }
        
        // Loguear la solicitud del archivo
        logger.info(`Archivo servido: ${fileName}`, { contentType });
        
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileName}"`
            }
        });
    } catch (err) {
        logger.error('Error al servir archivo:', { error: err, path: params.path });
        throw error(404, 'Archivo no encontrado');
    }
} 