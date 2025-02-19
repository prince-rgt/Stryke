'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({ error, reset }: { error?: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" />
            <span>Error Occurred</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">An unexpected error has occurred.</p>
          {/* {error?.message && (
            <p className="mt-2 text-center text-sm text-muted-foreground">Error details: {error.message}</p>
          )} */}
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button variant={'secondary'} onClick={() => reset()}>
            Reload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
