import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma'; // Asumiendo que tienes prisma client configurado en $lib/prisma.ts
import bcrypt from 'bcryptjs'; // Para la comparación de contraseñas hasheadas
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const user = await prisma.usuarios.findUnique({
      where: { email },
      include: { // Opcional: Incluir datos de la disciplina si es necesario
        disciplinas: true,
      }
    });

    if (!user) {
      logger.info(`Intento de login fallido para email: ${email} (usuario no encontrado)`);
      return json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // IMPORTANTE: Compara la contraseña hasheada
    // Asegúrate de que tus contraseñas en la BD estén hasheadas con bcrypt
    // Si aún no lo están, necesitarás un script para hashearlas o modificar esta lógica temporalmente.
    // const passwordIsValid = await bcrypt.compare(password, user.password);

    // Comparación de contraseña en texto plano (SOLO PARA DESARROLLO SI AÚN NO HAS HASHEADO LAS CONTRASEÑAS)
    // ¡¡¡REEMPLAZA ESTO CON LA COMPARACIÓN DE BCRYPT EN PRODUCCIÓN!!!
    const passwordIsValid = password === user.password;


    if (!passwordIsValid) {
      logger.info(`Intento de login fallido para email: ${email} (contraseña incorrecta)`);
      return json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // No enviar la contraseña al cliente
    const { password: _password, ...userWithoutPassword } = user;
    
    const userDataToReturn = {
      ...userWithoutPassword,
      disciplina: user.disciplinas?.nombre // Añade el nombre de la disciplina
    };

    // Guardar la sesión del usuario en una cookie
    cookies.set('user_session', JSON.stringify(userDataToReturn), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });

    logger.info(`Login exitoso para email: ${email}`);
    return json(userDataToReturn, { status: 200 });

  } catch (error) {
    logger.error('Error en el endpoint de login:', { error: error instanceof Error ? error.message : String(error) });
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}; 