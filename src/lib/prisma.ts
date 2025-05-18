import { PrismaClient } from '@prisma/client';

// Crear un espacio global para evitar múltiples instancias en desarrollo
const globalForPrisma: { prisma?: PrismaClient } = typeof window === 'undefined' 
  ? global as unknown as { prisma?: PrismaClient }
  : window as unknown as { prisma?: PrismaClient };

// Usar cliente "global" en desarrollo para evitar múltiples instancias
export const prisma = globalForPrisma.prisma || new PrismaClient();

// Sólo asignar a global en desarrollo y en entorno de servidor
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
} 