import { trpc } from 'lib/trpc';
import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';
import { commentValidator } from 'server/domains/comments/helpers';

type Props = {
  postId: string;
  parentId?: string;
  submitButtonText: string;
  onSuccess?: (newId: string) => void;
};

export const AddCommentForm = ({ postId, parentId, submitButtonText, onSuccess }: Props) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const utils = trpc.useContext();
  const [errors, setErrors] = useState<{ content?: string[] | undefined }>({});
  const textareaRef = useCallback((inputElement: HTMLTextAreaElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const addComment = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['post.all']);
      utils.invalidateQueries(['post.byId', { id: postId }]);

      if (parentId) {
        utils.invalidateQueries(['comment.byId', { id: parentId }]);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const validation = commentValidator.safeParse({
      postId,
      parentId,
      content: (formData.get('content') as string) || undefined,
    });

    if (validation.success) {
      return addComment.mutateAsync(validation.data).then(result => {
        formRef.current?.reset();
        setErrors({});
        onSuccess && onSuccess(result.id);
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
    <form ref={formRef} onSubmit={handleSubmit}>
      <textarea
        name="content"
        ref={textareaRef}
        disabled={addComment.isLoading}
        className="block w-[90%] border border-gray-700 rounded text-lg p-2 mb-2"
        onKeyDown={handleKeyDown}
        rows={8}
        cols={80}
      />

      {errors.content ? <span className="block text-red-500 mb-2">{errors.content[0]}</span> : null}

      <p className="mb-4">
        <span className="opacity-60">If you haven’t already, would you mind reading about HN’s</span>{' '}
        <Link href={`/#TODO`}>
          <a className="underline">approach to comments</a>
        </Link>{' '}
        <span className="opacity-60">and</span>{' '}
        <Link href={`/#TODO`}>
          <a className="underline">site guidelines</a>
        </Link>
        <span className="opacity-60">?</span>
      </p>

      <button
        type="submit"
        disabled={addComment.isLoading}
        className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 rounded border border-gray-700 px-2 font-mono"
      >
        {submitButtonText}
      </button>
    </form>
  );
};
