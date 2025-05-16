import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { FileService } from '$lib/server/file.service.js'
// import { isFileForbiden } from './isFileForbiden'

export async function GET({ request, locals, params }) {
    // if (isFileForbiden(pathName)) throw error(403) // use 403 (forbiden) here

    try {
        const file = await FileService.readFile(params.path, env.SECRET_BASE_FILE_PATH)
        return new Response(file)
    } catch {
        throw error(404) // use 404 (not found) here
    }
}