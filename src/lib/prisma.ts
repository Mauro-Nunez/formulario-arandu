import { PrismaClient } from '@prisma/client';

// Declaración global para evitar múltiples instancias durante desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}

// Usar cliente global en desarrollo para evitar múltiples instancias
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 