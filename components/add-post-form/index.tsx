import { ProtectedLink } from 'components/protected-link';
import { trpc } from 'lib/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { createPostSchema } from 'server/domains/posts/helpers';

export const AddPostForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleError = useErrorHandler();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<{
    title?: string[] | undefined;
    url?: string[] | undefined;
    content?: string[] | undefined;
  }>({});

  const addPost = trpc.useMutation('post.create', {
    onSuccess: async post => {
      return router.push(`/item?id=${post.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const validation = createPostSchema.safeParse({
      title: formData.get('title') || undefined,
      url: formData.get('url') || undefined,
      content: formData.get('content') || undefined,
    });

    if (validation.success) {
      return addPost.mutateAsync(validation.data).catch(e => {
        if (e.data.code !== 'CONFLICT') {
          handleError(e);
        }
      });
    }

    setErrors(validation.error.formErrors.fieldErrors);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-[#f6f6ef] p-4">
      {addPost.error ? <span className="block text-red-500 mb-2">{addPost.error.message}</span> : null}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block" htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            name="title"
            className="border border-gray-700 rounded-sm p-1 w-full max-w-xl"
          />
        </div>

        {errors.title ? <span className="block text-red-500 mb-2">{errors.title[0]}</span> : null}

        <div className="mb-4">
          <label className="block" htmlFor="url">
            URL
          </label>

          <input id="url" type="text" name="url" className="border border-gray-700 rounded-sm p-1 w-full max-w-xl" />
        </div>

        {errors.url ? <span className="block text-red-500 mb-2">{errors.url[0]}</span> : null}

        <span className="font-bold">OR</span>

        <div className="mt-4 mb-2">
          <label className="block" htmlFor="content">
            Text
          </label>

          <textarea
            name="content"
            className="block w-full max-w-xl border border-gray-700 rounded text-lg p-2 mb-2"
            onKeyDown={handleKeyDown}
            rows={8}
            cols={80}
          />
        </div>

        {errors.content ? <span className="block text-red-500 mb-2">{errors.content[0]}</span> : null}

        <p className="mb-4">
          <span className="opacity-60">
            Leave url blank to submit a question for discussion. If there is no url, the text (if any) will appear at
            the top of the thread.
          </span>
        </p>

        {session ? (
          <button
            type="submit"
            disabled={addPost.isLoading}
            className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-200 rounded border border-gray-700 px-2 font-mono"
          >
            submit
          </button>
        ) : (
          <ProtectedLink href="/submit">
            <a className="inline-block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-200 rounded border border-gray-700 px-2 font-mono">
              submit
            </a>
          </ProtectedLink>
        )}
      </form>
    </div>
  );
};
