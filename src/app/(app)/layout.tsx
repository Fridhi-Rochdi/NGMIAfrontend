import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden flex-col bg-gray-50">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
