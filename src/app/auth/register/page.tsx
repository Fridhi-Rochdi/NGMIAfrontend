"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { LogoIcon, ChevronRightIcon, ChevronLeftIcon } from '@/components/icons';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { API_URL } from '@/lib/constants';
import registerAnimation from '../../../../public/lottie/register.json';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Brand AI Context Fields
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('professional');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTenantNameChange = (value: string) => {
    setTenantName(value);
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setTenantSlug(slug);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !password || password.length < 8) {
        setError("Please fill all required fields (Password must be 8+ characters).");
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!tenantName || tenantName.length < 2) {
      setError('Company name must be at least 2 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName: name, 
          tenantName, 
          tenantSlug,
          industry,
          description,
          targetAudience,
          tone
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Registration failed');
        throw new Error(errorMessage);
      }

      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-cyan-500/30">
      
      {/* Left Column - Branding & Lottie */}
      <div className="flex w-full h-[300px] md:h-auto md:min-h-screen md:w-5/12 lg:w-1/3 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 flex-col justify-between relative overflow-hidden items-center">
        {/* Clean blue/cyan glow, no purple */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-blue-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-cyan-900/10 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 w-full">
          <Link href="/" className="flex items-center justify-center gap-3 w-full md:mb-12">
            <LogoIcon className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tighter uppercase">NextGen AI</span>
          </Link>
        </div>
        
        <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-sm">
          {/* Lottie Animation instead of text/stars */}
          <Player
            autoplay
            loop
            src={registerAnimation}
            style={{ height: '100%', width: '100%', maxHeight: '400px' }}
          />
        </div>
        
        <div className="relative z-10 md:mt-12 w-full text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-white font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-7/12 lg:w-2/3 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#050505]">
        <div className="w-full max-w-xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {step === 1 ? 'Create your account' : 'Tell us about your startup'}
            </h2>
            <p className="text-gray-400">
              {step === 1 
                ? "Let's get started with your personal details." 
                : "This context allows our AI to generate perfectly tailored content for your brand."}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8 bg-red-950/30 border-red-900 text-red-400 rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
                />
              </div>
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
                <Label htmlFor="password" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Password</Label>
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
              
              <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-none font-bold uppercase tracking-widest mt-8 group flex items-center justify-between px-6">
                <span>Continue</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tenantName" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Company Name *</Label>
                  <Input
                    id="tenantName"
                    type="text"
                    placeholder="Acme Corp"
                    value={tenantName}
                    onChange={(e) => handleTenantNameChange(e.target.value)}
                    required
                    className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Industry</Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="e.g., SaaS, E-commerce, Agency"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300 uppercase tracking-widest text-xs font-bold">What does your company do?</Label>
                <Textarea
                  id="description"
                  placeholder="We provide an AI-powered platform for small businesses to automate their marketing and save time."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4 py-4 min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    type="text"
                    placeholder="e.g., Gen Z, Startup Founders"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-gray-300 uppercase tracking-widest text-xs font-bold">Default Brand Tone</Label>
                  <Select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="h-14 bg-[#111] border-white/10 focus:border-cyan-500 rounded-none text-white px-4"
                  >
                    <option value="professional">Professional & Trustworthy</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="bold">Bold & Confident</option>
                    <option value="humorous">Humorous & Witty</option>
                    <option value="inspirational">Inspirational & Visionary</option>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="h-14 bg-transparent border-white/20 text-white hover:bg-white/5 rounded-none font-bold uppercase tracking-widest px-6"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-14 flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-none font-bold uppercase tracking-widest"
                >
                  {loading ? 'Creating AI Workspace...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          )}

          {/* Stepper indicator */}
          <div className="flex justify-center mt-12 gap-2">
            <div className={`h-1.5 w-8 transition-colors ${step === 1 ? 'bg-white' : 'bg-white/20'}`}></div>
            <div className={`h-1.5 w-8 transition-colors ${step === 2 ? 'bg-cyan-400' : 'bg-white/20'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
