"use client";

import { cn } from '@/lib/utils';
import { ReactNode, createContext, useContext, useState, useRef, useEffect } from 'react';

// DropdownMenu Context
const DropdownContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

// Root
interface DropdownMenuProps {
  children: ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

// Trigger
interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer">
      {children}
    </div>
  );
}

// Content
interface DropdownMenuContentProps {
  children: ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
}

export function DropdownMenuContent({ children, align = 'end', className }: DropdownMenuContentProps) {
  const { open, setOpen } = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[12rem] overflow-hidden rounded-xl border shadow-xl',
        'dropdown-menu-content',
        align === 'end' && 'right-0',
        align === 'start' && 'left-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        'top-full mt-2',
        className
      )}
    >
      {children}
    </div>
  );
}

// Label
interface DropdownMenuLabelProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <div className={cn('px-3 py-2 text-xs font-semibold uppercase tracking-wider dropdown-menu-label', className)}>
      {children}
    </div>
  );
}

// Separator
export function DropdownMenuSeparator() {
  return <div className="dropdown-menu-separator -mx-1 my-1 h-px" />;
}

// Item
interface DropdownMenuItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DropdownMenuItem({ children, className, onClick }: DropdownMenuItemProps) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg mx-1 px-3 py-2 text-sm outline-none transition-colors dropdown-menu-item',
        className
      )}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}
