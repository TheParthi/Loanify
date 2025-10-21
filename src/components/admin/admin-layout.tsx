'use client';

import { ReactNode } from 'react';
import { AdminNavbar } from './admin-navbar';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminNavbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}