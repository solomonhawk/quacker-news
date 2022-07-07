import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
const prismaOpts: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaOpts);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaOpts);
  }

  prisma = global.prisma;
}

export const QueryError = {
  UniqueConstraintViolation: 'P2002',
} as const;

interface UniqueConstraintViolation {
  code: 'P2002';
  meta: {
    target: string[];
  };
}

export const isUniqueConstraintViolation = (error: { code: string }): error is UniqueConstraintViolation => {
  return error.code === QueryError.UniqueConstraintViolation;
};

export { prisma };
