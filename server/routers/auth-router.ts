import { createRouter } from 'server/create-router';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { defaultUserSelect } from 'server/domains/users';

export const authRouter = createRouter().mutation('register', {
  input: z.object({
    email: z.string(),
    username: z.string(),
    password: z.string(),
  }),
  async resolve({ input: { email, username, password }, ctx }) {
    return ctx.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: await bcrypt.hash(password, 10),
      },
      select: defaultUserSelect,
    });
  },
});
