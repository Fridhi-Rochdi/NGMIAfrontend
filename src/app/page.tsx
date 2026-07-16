"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, ChartBarIcon, MessageSquareIcon, CheckCircleIcon, CalendarIcon, LogoIcon, SocialPlatformIcon } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-gray-100 selection:bg-cyan-500 selection:text-white">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tighter text-white uppercase">NextGen AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-semibold tracking-wide text-gray-400 hover:text-white transition-colors uppercase">
              Log in
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-none h-10 px-6 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(6,182,212,1)] hover:shadow-[0px_0px_0px_0px_rgba(6,182,212,1)] hover:translate-x-1 hover:translate-y-1 transition-all border border-cyan-500 bg-black text-white uppercase tracking-wider">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-32 pb-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/20 blur-[120px] rounded-full -z-10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full -z-10" />
          
          <div className="container mx-auto px-6 text-center lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[1.1]">
                AUTOMATE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500">
                  MARKETING
                </span> <br />
                AT SCALE.
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-gray-400 max-w-2xl mx-auto font-light">
                NextGen MarketingAI uses advanced artificial intelligence to create, schedule, and optimize your content across all social media platforms in seconds.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/auth/register">
                  <Button size="lg" className="rounded-none h-14 px-8 text-lg font-bold shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] hover:shadow-[0px_0px_0px_0px_rgba(6,182,212,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all border-2 border-cyan-500 bg-black text-white uppercase tracking-wider">
                    Start 14-day trial
                  </Button>
                </Link>
                <Link href="#features" className="group flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-white hover:text-cyan-400 transition-colors">
                  Explore Platform
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section id="features" className="py-32 border-y border-white/10 bg-[#0a0a0a]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-sm font-bold leading-7 text-cyan-400 uppercase tracking-[0.2em] mb-4">Architecture of Growth</h2>
              <p className="text-4xl font-black tracking-tighter text-white sm:text-5xl uppercase">Deploy Faster. Scale Harder.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative bg-[#111] border border-white/10 p-10 hover:border-cyan-500 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-0 bg-cyan-500 group-hover:h-full transition-all duration-500" />
                <div className="h-14 w-14 mb-8 bg-black border border-cyan-500/30 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                  <SparklesIcon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">AI Generation</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Generate high-converting copy tailored to your brand voice for Facebook, Instagram, LinkedIn, and Twitter in just one click.
                </p>
              </div>

              <div className="group relative bg-[#111] border border-white/10 p-10 hover:border-cyan-500 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-0 bg-cyan-500 group-hover:h-full transition-all duration-500" />
                <div className="h-14 w-14 mb-8 bg-black border border-cyan-500/30 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                  <MessageSquareIcon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Omnichannel</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Schedule and publish your AI-generated posts seamlessly across multiple social accounts from a single unified dashboard.
                </p>
              </div>

              <div className="group relative bg-[#111] border border-white/10 p-10 hover:border-cyan-500 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-2 h-0 bg-cyan-500 group-hover:h-full transition-all duration-500" />
                <div className="h-14 w-14 mb-8 bg-black border border-cyan-500/30 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Analytics</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Track engagement and conversion metrics. Let our AI analyze what works best and automatically optimize your future campaigns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section id="pricing" className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-cyan-900/20 blur-[150px] -z-10" />
          
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-4xl font-black tracking-tighter text-white sm:text-5xl uppercase">Transparent Pricing</h2>
            </div>
            
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 md:max-w-4xl md:grid-cols-2 lg:max-w-7xl lg:grid-cols-4">
              {/* Starter Plan */}
              <div className="bg-[#111] border border-white/10 p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400">Starter</h3>
                  <div className="mt-6 flex items-baseline gap-x-2">
                    <span className="text-5xl font-black tracking-tighter text-white">$29</span>
                    <span className="text-sm font-medium text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-10 space-y-4 text-sm text-gray-400">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-gray-400" /> 1 Social Account</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-gray-400" /> 50 AI Generations</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-gray-400" /> Basic Analytics</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-gray-400" /> 1 User Seat</li>
                  </ul>
                </div>
                <Link href="/auth/register" className="mt-12 block">
                  <Button className="w-full rounded-none h-12 bg-[#222] text-white hover:bg-gray-700 uppercase font-bold tracking-widest text-sm">
                    Start Starter
                  </Button>
                </Link>
              </div>

              {/* Growth Plan */}
              <div className="bg-[#111] border border-white/10 p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400">Growth</h3>
                  <div className="mt-6 flex items-baseline gap-x-2">
                    <span className="text-5xl font-black tracking-tighter text-white">$49</span>
                    <span className="text-sm font-medium text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-10 space-y-4 text-sm text-gray-300">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Up to 3 Social Accounts</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> 200 AI Generations</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Advanced Analytics</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> 2 User Seats</li>
                  </ul>
                </div>
                <Link href="/auth/register" className="mt-12 block">
                  <Button className="w-full rounded-none h-12 bg-white text-black hover:bg-gray-200 uppercase font-bold tracking-widest text-sm">
                    Get Growth
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-black border-2 border-cyan-500 p-8 flex flex-col justify-between relative shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-2 transition-transform duration-300 scale-105 z-10">
                <div className="absolute top-0 right-0 bg-cyan-500 text-white px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400">Professional</h3>
                  <div className="mt-6 flex items-baseline gap-x-2">
                    <span className="text-5xl font-black tracking-tighter text-white">$79</span>
                    <span className="text-sm font-medium text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-10 space-y-4 text-sm text-gray-200">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Unlimited Socials</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Unlimited AI Gens</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Advanced Analytics</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> 5 User Seats</li>
                  </ul>
                </div>
                <Link href="/auth/register" className="mt-12 block">
                  <Button className="w-full rounded-none h-12 bg-cyan-600 hover:bg-cyan-500 text-white uppercase font-bold tracking-widest text-sm">
                    Start Pro
                  </Button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-[#111] border border-white/10 p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400">Enterprise</h3>
                  <div className="mt-6 flex items-baseline gap-x-2">
                    <span className="text-5xl font-black tracking-tighter text-white">$199</span>
                    <span className="text-sm font-medium text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-10 space-y-4 text-sm text-gray-300">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> White-label Dash</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Custom AI Models</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Priority Support</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-4 w-4 text-cyan-500" /> Unlimited Seats</li>
                  </ul>
                </div>
                <Link href="/contact" className="mt-12 block">
                  <Button className="w-full rounded-none h-12 bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/40 uppercase font-bold tracking-widest text-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BLOG SECTION ===== */}
        <section id="blog" className="py-32 border-t border-white/10 bg-[#050505]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-bold leading-7 text-cyan-400 uppercase tracking-[0.2em] mb-2">Knowledge Base</h2>
                <p className="text-4xl font-black tracking-tighter text-white sm:text-5xl uppercase">Latest Insights</p>
              </div>
              <Link href="/blog" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-2 border-b border-gray-800 hover:border-white">
                View All Articles
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "10 Ways AI Can Transform Your Social Media Strategy",
                  tag: "AI Tips",
                  color: "text-cyan-400",
                  border: "border-cyan-500/30",
                  img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
                },
                {
                  title: "How to Measure ROI on Your Social Media Campaigns",
                  tag: "Analytics",
                  color: "text-cyan-400",
                  border: "border-cyan-500/30",
                  img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                },
                {
                  title: "Building a Consistent Brand Voice Across All Channels",
                  tag: "Branding",
                  color: "text-cyan-400",
                  border: "border-cyan-500/30",
                  img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80"
                }
              ].map((post, i) => (
                <Link href="/blog" key={i} className={`group flex flex-col bg-[#0a0a0a] border border-white/10 hover:${post.border} transition-colors duration-300 block`}>
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1">
                      <span className={`text-xs font-bold uppercase tracking-widest ${post.color}`}>{post.tag}</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-4 uppercase leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span>Read Article</span>
                      <span className="group-hover:translate-x-2 transition-transform text-white">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <LogoIcon className="h-10 w-10" />
                <span className="text-xl font-black tracking-tighter text-white uppercase">NextGen AI</span>
              </div>
              <p className="text-gray-500 font-light max-w-sm mb-8 leading-relaxed">
                The ultimate platform to automate, scale, and conquer your social media presence using cutting-edge artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-600">
            <p>© {new Date().getFullYear()} NextGen MarketingAI.</p>
            <p>Designed for the future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
