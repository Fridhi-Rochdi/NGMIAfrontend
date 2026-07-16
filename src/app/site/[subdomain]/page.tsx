"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/lib/constants';

interface WebsiteData {
  id: string;
  businessName: string;
  html: string;
  css: string;
  subdomain: string;
  status: string;
}

export default function SitePage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subdomain) return;

    async function fetchWebsite() {
      try {
        const res = await fetch(`${API_URL}/websites/subdomain/${subdomain}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Website not found or not published yet.');
          } else {
            setError('Failed to load website.');
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setWebsite(data);
        setLoading(false);
      } catch {
        setError('Failed to load website.');
        setLoading(false);
      }
    }

    fetchWebsite();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading website...</p>
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
            href="https://maketingai.dev"
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
      <style dangerouslySetInnerHTML={{ __html: website?.css || '' }} />
      <div dangerouslySetInnerHTML={{ __html: website?.html || '' }} />
    </div>
  );
}