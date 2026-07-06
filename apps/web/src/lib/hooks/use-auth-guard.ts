'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface UseAuthGuardOptions {
  redirectTo?: string;
}

export function useAuthGuard({ redirectTo = '/login' }: UseAuthGuardOptions = {}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [mounted, isAuthenticated, router, redirectTo]);

  return {
    isAuthenticated,
    mounted,
    shouldRender: mounted && isAuthenticated,
  };
}
