import * as z from 'zod';

export const paginationValidator = z
  .object({
    page: z.number().default(1),
    perPage: z.number().default(25),
  })
  .default({});
