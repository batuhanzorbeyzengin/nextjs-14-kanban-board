import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create the PrismaClient instance or reuse the existing one if available in the global variable.
// This setup helps to avoid creating multiple instances of PrismaClient in a development environment.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

// In a development environment, assign the PrismaClient instance to the global variable.
// This ensures that the same PrismaClient instance is reused across hot-reloads,
// preventing the creation of multiple instances which could lead to connection issues.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
