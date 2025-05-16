import fs, { writeFile } from 'fs';
import path from 'path';

import {mkdirp} from 'mkdirp';
import { env } from '$env/dynamic/private';
import { MEDIA_ROOT } from '$env/static/private';

export class FileService {
	static basePath = path.join(process.cwd(), 'private');

	static async writeFile(file: File, fileHref: string, basePath?: string) {
		await mkdirp(path.join(basePath ?? FileService.basePath, path.dirname(fileHref)));
		await writeFile(
			(basePath ?? FileService.basePath) + '/' + fileHref,
			Buffer.from(await file.arrayBuffer()),
			(err) => {
				if (err) console.log('ERROR', err);
			}
		);
	}

	static async readFile(fileHref: string, basePath?: string) {
		const buffer = fs.readFileSync((basePath ?? FileService.basePath) + '/' + fileHref);
		return buffer;
	}

	static async deleteFile(fileHref: string, basePath?: string) {
		try {
			fs.rmSync((basePath ?? FileService.basePath) + '/' + fileHref);
		} catch (e) { }
	}
}

export class ImageService {
	static async writeFile(file: File, filename: string) {
		const path = 'image/' + filename;
		await FileService.writeFile(file, path, env.SECRET_BASE_FILE_PATH);
		return { path: MEDIA_ROOT + '/' + path };
	}

	static async readFile(filename: string) {
		return await FileService.readFile('image/' + filename, env.SECRET_BASE_FILE_PATH);
	}

	static async deleteFile(filename: string) {
		return await FileService.deleteFile('image/' + filename, env.SECRET_BASE_FILE_PATH).catch();
	}
}

export class PDFService {
	static async writeFile(file: File, filename: string) {
		const path = 'pdf/' + filename;
		await FileService.writeFile(file, path);
		return { path };
	}

	static async readFile(filename: string) {
		return await FileService.readFile('pdf/' + filename);
	}
}

export class AudioService {
	static async writeFile(file: File, filename: string) {
		const path = 'audio/' + filename;
		await FileService.writeFile(file, path, env.SECRET_BASE_FILE_PATH);
		return { path: MEDIA_ROOT + '/' + path };
	}

	static async readFile(filename: string) {
		return await FileService.readFile('audio/' + filename, env.SECRET_BASE_FILE_PATH);
	}

	static async deleteFile(filename: string) {
		return await FileService.deleteFile('audio/' + filename, env.SECRET_BASE_FILE_PATH).catch();
	}
}

export class InscriptionFileService {
	static async writeFile(file: File, filename: string) {
		const path = 'inscription/' + filename;
		await FileService.writeFile(file, path, env.SECRET_BASE_FILE_PATH);
		return { path: MEDIA_ROOT + '/' + path };
	}

	static async readFile(filename: string) {
		return await FileService.readFile('inscription/' + filename, env.SECRET_BASE_FILE_PATH);
	}

	static async deleteFile(filename: string) {
		return await FileService.deleteFile('inscription/' + filename, env.SECRET_BASE_FILE_PATH).catch();
	}
}
