"use client";
import React from 'react';
import Link from 'next/link';
import { Ghost, Home } from 'lucide-react';
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";

export default function DashboardNotFound() {
  return (
    <InnerDashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-card rounded-2xl border border-border mt-6">
        <div className="p-6 bg-card2 rounded-full border border-border mb-8 animate-bounce transition-all duration-300">
          <Ghost size={64} className="text-muted" />
        </div>

        <h1 className="text-8xl font-black tracking-tighter text-foreground mb-2">404</h1>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Page Not Found</h2>

        <p className="text-muted font-medium max-w-md mx-auto mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-8 py-3.5 bg-card2 border border-border rounded-xl font-bold text-foreground hover:bg-muted/10 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>
      </div>
    </InnerDashboardLayout>
  );
}
