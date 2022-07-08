import { InferQueryOutput } from 'helpers/trpc';
import Link from 'next/link';

type UserQueryByUsernamePublic = NonNullable<InferQueryOutput<'user.byUsername.public'>>;

export const PublicUserProfile = ({ user }: { user: UserQueryByUsernamePublic }) => {
  return (
    <div className="p-4">
      <table>
        <tbody>
          <tr>
            <td className="font-semibold pr-2">Username:</td>
            <td>{user.username}</td>
          </tr>

          <tr>
            <td className="font-semibold pr-2">Created:</td>
            <td>
              {user.createdAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </td>
          </tr>

          <tr>
            <td className="font-semibold">Karma:</td>
            <td>{user.karma}</td>
          </tr>

          <tr className="align-top">
            <td className="font-semibold">About:</td>
            <td>
              <Link href={`/submitted?id=${user.username}`}>
                <a className="block underline opacity-60 hover:opacity-100">submissions ({user._count.posts})</a>
              </Link>

              <Link href={`/threads?id=${user.username}`}>
                <a className="block underline opacity-60 hover:opacity-100">comments ({user._count.comments})</a>
              </Link>

              <Link href={`/favorites?id=${user.username}`}>
                <a className="block underline opacity-60 hover:opacity-100">favorites ({user._count.favorite})</a>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
