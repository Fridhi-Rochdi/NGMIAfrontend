"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/lib/constants';

interface PublicPoster {
  businessName: string;
  name: string;
  content?: string;
  imageUrl?: string;
}

export default function PublicPosterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [poster, setPoster] = useState<PublicPoster | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/posters/slug/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Poster unavailable');
        const payload = await response.json();
        setPoster(payload?.data ?? payload);
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return <main className="grid min-h-screen place-items-center bg-gray-950 p-6 text-center text-white"><div><h1 className="text-3xl font-semibold">Poster indisponible</h1><p className="mt-3 text-white/60">Ce poster n’existe pas ou n’est pas encore publié.</p></div></main>;
  }
  if (!poster) {
    return <main className="grid min-h-screen place-items-center bg-gray-950"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></main>;
  }
  if (poster.content) {
    return <iframe title={poster.name || poster.businessName} className="min-h-screen w-full border-0" sandbox="" referrerPolicy="no-referrer" srcDoc={poster.content} />;
  }
  return <main className="grid min-h-screen place-items-center bg-gray-950 p-4"><img src={poster.imageUrl} alt={poster.name || poster.businessName} className="max-h-screen max-w-full object-contain" /></main>;
}
