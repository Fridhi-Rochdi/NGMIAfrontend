"use client";

import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { BellIcon, MenuIcon, UserIcon, LogOutIcon, SettingsIcon, LogoIcon } from '@/components/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user
    ? [user.firstName, user.lastName]
        .filter(Boolean)
        .map((n) => n![0])
        .join('')
        .toUpperCase() || user.email?.[0]?.toUpperCase() || '??'
    : '??';

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-8" />
            <span className="font-bold text-xl">MarketingAI</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.email || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}