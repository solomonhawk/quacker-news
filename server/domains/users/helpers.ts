import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
});

export const userSelectPublicProfile = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  createdAt: true,
});

export const userSelectAuthedProfile = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
  createdAt: true,
});
