'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="px-6 text-center">
        <div className="relative mb-6 inline-block">
          <Shield className="text-destructive h-16 w-16" />
          <AlertTriangle className="text-destructive absolute -bottom-1 -right-1 h-8 w-8 animate-pulse" />
        </div>
        <h1 className="font-heading mb-2 text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="text-muted-foreground/60 mt-2 block font-mono text-xs">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="cyber" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
