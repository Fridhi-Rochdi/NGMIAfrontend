'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

interface AppearanceContextType {
  appearance: AppearanceSettings;
  setAppearance: (settings: AppearanceSettings) => void;
}

const STORAGE_KEY = 'appearance-preferences';

const defaults: AppearanceSettings = {
  theme: 'light',
  fontSize: 'medium',
  compactMode: false,
};

const AppearanceContext = createContext<AppearanceContextType>({
  appearance: defaults,
  setAppearance: () => {},
});

function applyAppearance(settings: AppearanceSettings) {
  const root = document.documentElement;

  // --- Theme ---
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && prefersDark);

  root.classList.toggle('dark', isDark);

  // --- Font Size ---
  const fontSizeMap = { small: '13px', medium: '15px', large: '17px' };
  root.style.fontSize = fontSizeMap[settings.fontSize];

  // --- Compact Mode ---
  root.classList.toggle('compact', settings.compactMode);
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = useState<AppearanceSettings>(defaults);

  // Load from localStorage on mount and apply
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as AppearanceSettings) : defaults;
    setAppearanceState(parsed);
    applyAppearance(parsed);
  }, []);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (appearance.theme === 'system') applyAppearance(appearance);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [appearance]);

  const setAppearance = (settings: AppearanceSettings) => {
    setAppearanceState(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAppearance(settings);
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
