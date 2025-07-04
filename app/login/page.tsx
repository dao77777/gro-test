'use client';

import { useSignInWithGithub } from '../_api';
import { Button } from '../_components/Button';

export default function LoginPage() {
  const { mutateAsync: signInWithGithub, error, isPending } = useSignInWithGithub();

  return (
    <div className="flex min-h-screen items-center justify-center">
      {
        error ? (
          <div>
            error
          </div>
        ) : (
          <Button
            onClick={() => signInWithGithub()}
            disabled={isPending}
            loading={isPending}
          >
            Login with GitHub
          </Button>

        )
      }
    </div>
  );
}