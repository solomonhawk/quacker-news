import { z } from 'zod';
import { PostType } from '@prisma/client';

export const createPostSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(16, 'Title is too short')
      .max(80, 'Please make title < 80 characters'),
    url: z.string().url().optional(),
    content: z
      .string()
      .min(1, 'Text is required')
      .min(32, 'Text is too short')
      .max(1024, 'Your post is too long, please keep it under 1024 characters')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.url && !data.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content'],
        message:
          'The url and text fields can’t both be blank.  Please either supply a url, or if you’re asking a question, put it in the text field.',
      });
    }
  });

export const derivePostType = (title: string, url?: string) => {
  if (title.startsWith('Ask QN: ')) {
    return PostType.ASK;
  }

  if (title.startsWith('Show QN: ')) {
    return PostType.SHOW;
  }

  if (url) {
    return PostType.STORY;
  }

  return PostType.DISCUSSION;
};
