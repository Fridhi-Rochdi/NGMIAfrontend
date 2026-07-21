"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/lib/constants';

interface MenuData {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  description?: string;
  categories: any[];
  template: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  html: string;
  css: string;
  status: string;
  slug: string;
  publishedAt?: string;
}

export default function MenuViewPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchMenu() {
      try {
        const res = await fetch(`${API_URL}/menus/slug/${slug}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Menu not found or not published yet.');
          } else {
            setError('Failed to load menu.');
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setMenu(data);
        setLoading(false);
      } catch {
        setError('Failed to load menu.');
        setLoading(false);
      }
    }

    fetchMenu();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Oops!</h1>
          <p className="text-gray-600">{error}</p>
          <a
            href="https://marketingai.dev"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Go to MarketingAI
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: menu?.css || '' }} />
      <div dangerouslySetInnerHTML={{ __html: menu?.html || '' }} />
    </div>
  );
}