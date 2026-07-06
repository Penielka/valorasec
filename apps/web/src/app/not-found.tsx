import Link from 'next/link';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="px-6 text-center">
        <Shield className="text-muted-foreground mx-auto mb-6 h-16 w-16" />
        <h1 className="font-heading mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-2 text-xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="cyber">
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
