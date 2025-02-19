'use client';

import Error from '@/app/[locale]/components/error';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Error error={error} reset={reset} />;
}
