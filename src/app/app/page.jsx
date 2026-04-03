'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { USERTYPE } from '@/lib/constants';

export default function AppEntry() {
  const router = useRouter();
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // auth state resolve hone do
    if (user === undefined) return;

    if (!user) {
      // not logged in → login page
      router.replace('/');
      return;
    }

    // logged in → role based dashboard
    if (user.role === USERTYPE.ADMIN) {
      router.replace('/dashboard/companies');
    } else {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // ⚠️ NO UI — TWA safe blank loader
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-sm text-gray-400">Loading…</div>
    </div>
  );
}
