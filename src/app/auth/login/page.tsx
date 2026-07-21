"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { LogoIcon, ChevronRightIcon } from '@/components/icons';
import { Player } from '@lottiefiles/react-lottie-player';
import { API_URL } from '@/lib/constants';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const json = await response.json();
      const payload = json.data || json; 
      
      if (payload && payload.accessToken) {
        localStorage.setItem('token', payload.accessToken);
        document.cookie = `token=${payload.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        if (payload.user) {
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-cyan-500/30">
      
      {/* Left Column - Branding & Lottie (Consistent with Register) */}
      <div className="hidden md:flex w-5/12 lg:w-1/3 bg-[#0a0a0a] border-r border-white/5 p-8 flex-col justify-between relative overflow-hidden items-center">
        {/* Clean blue/cyan glow, no purple */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-blue-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-cyan-900/10 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 w-full">
          <Link href="/" className="flex items-center justify-center gap-3 w-full mb-12">
            <LogoIcon className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tighter uppercase">NextGen AI</span>
          </Link>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-sm">
          {/* Lottie Animation instead of text/stars */}
          <Player
            autoplay
            loop
            src="/lottie/login.json"
            style={{ height: '400px', width: '400px' }}
          />
        </div>
        
        <div className="relative z-10 mt-12 w-full text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-white font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-7/12 lg:w-2/3 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-12 w-fit">
            <LogoIcon className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tighter uppercase">NextGen AI</span>
          </div>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to access your marketing AI dashboard.</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8 bg-red-950/30 border-red-900 text-red-400 rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Password</Label>
                <Link href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-none font-bold uppercase tracking-widest mt-8 group flex items-center justify-between px-6">
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
          
          <p className="mt-10 text-sm text-gray-500 text-center md:text-left md:hidden">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-white font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs">
              Create one now
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}