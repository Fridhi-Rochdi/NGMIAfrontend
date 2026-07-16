"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MenuIcon, SparklesIcon, CalendarIcon, MessageSquareIcon, UsersIcon, SettingsIcon, HomeIcon, ImageIcon, VideoIcon, GlobeIcon, QrCodeIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/branding', label: 'Branding', icon: SparklesIcon, showFor: ['ADMIN', 'OWNER'] },
    { href: '/content', label: 'Content', icon: MessageSquareIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/images', label: 'Images', icon: ImageIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/reels', label: 'Reels', icon: VideoIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/planner', label: 'Planner', icon: CalendarIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/websites', label: 'Websites', icon: GlobeIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/qrcode', label: 'QR Codes', icon: QrCodeIcon, showFor: ['ADMIN', 'OWNER', 'MEMBER'] },
    { href: '/social', label: 'Social', icon: UsersIcon, showFor: ['ADMIN', 'OWNER'] },
    { href: '/settings', label: 'Settings', icon: SettingsIcon, showFor: ['ADMIN', 'OWNER'] },
  ].filter(item => item.showFor.includes(user?.role || 'MEMBER'));


  return (
    <aside className="hidden w-64 flex-col border-r bg-white md:flex">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <Button variant="outline" className="w-full">
            <SparklesIcon className="mr-2 h-4 w-4" />
            Generate Content
          </Button>
        </div>
      </div>
    </aside>
  );
}