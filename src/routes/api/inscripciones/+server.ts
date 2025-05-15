import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { guardarInscripcionArtistica } from '$lib/inscripcionesArtisticas';
import { logger, LogLevel } from '$lib/logger';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import crypto from 'crypto';

// Directorio para almacenar archivos subidos
const UPLOAD_DIR = 'static/uploads';

// Asegurar que el directorio de subidas exista
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Función para generar un UUID v4
function generateUUID(): string {
  return crypto.randomUUID();
}

// Función para generar un nombre único para el archivo
function getUniqueFileName(originalName: string): string {
  // Obtener la extensión del archivo original
  const fileExt = path.extname(originalName);
  // Obtener el nombre base sin extensión
  const baseName = path.basename(originalName, fileExt);
  // Sanitizar el nombre base (eliminar caracteres especiales)
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  // Crear nombre único: UUID + timestamp + nombre sanitizado + extensión
  return `${generateUUID()}-${Date.now()}-${sanitizedName}${fileExt}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Procesar formData
    const formData = await request.formData();
    const inscripcionData: Record<string, any> = {};
    
    // Extraer campos básicos
    for (const [key, value] of formData.entries()) {
      // Si es un array en formato JSON, parsearlo
      if (key.endsWith('Escena') || key === 'elenco' || key === 'integrantes' || 
          key === 'colaboradores' || key === 'equipoTecnico') {
        try {
          inscripcionData[key] = JSON.parse(value as string);
        } catch (e) {
          inscripcionData[key] = [];
        }
      } 
      // Si es un File, procesarlo adecuadamente
      else if (key === 'archivoContenido' && value instanceof File) {
        // Guardar el archivo en disco
        const file = value;
        const fileName = getUniqueFileName(file.name);
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Obtener el ArrayBuffer del archivo
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Escribir el archivo en disco de forma asíncrona
        await fsPromises.writeFile(filePath, buffer);
        
        // Guardar la ruta relativa en la base de datos
        inscripcionData[key] = `uploads/${fileName}`;
        
        logger.info('Archivo guardado correctamente', {
          nombre_original: file.name,
          nombre_guardado: fileName,
          ruta: filePath,
          tamaño: file.size
        });
      } 
      // Para otros campos, convertir el valor string a número si es necesario
      else if (key === 'disciplina_id' || key === 'usuario_id') {
        inscripcionData[key] = parseInt(value as string);
      } 
      // Para el resto de campos, asignar directamente
      else {
        inscripcionData[key] = value;
      }
    }
    
    // Guardar la inscripción usando el servicio existente
    const inscripcionGuardada = await guardarInscripcionArtistica(inscripcionData);
    
    // Devolver respuesta exitosa
    return json({ 
      success: true, 
      inscripcion: inscripcionGuardada 
    }, { status: 201 });
  } catch (error) {
    // Registrar el error
    logger.error('Error al guardar inscripción desde API', { 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
    
    // Devolver error
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al guardar la inscripción' 
    }, { status: 500 });
  }
}; 