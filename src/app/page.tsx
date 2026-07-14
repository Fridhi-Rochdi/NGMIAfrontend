"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, ChartBarIcon, MessageSquareIcon, CheckCircleIcon, CalendarIcon, LogoIcon, SocialPlatformIcon, platformBrandColors } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8 shadow-sm" />
            <span className="text-lg font-bold tracking-tight">NextGen MarketingAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/auth/register">
              <Button className="h-9 px-4 text-sm font-medium shadow-sm transition-all hover:shadow-md">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-gradient-to-b from-indigo-50/60 to-white" />
          <div className="container mx-auto px-6 text-center lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Automate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">marketing</span> at scale.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                NextGen MarketingAI uses advanced artificial intelligence to create, schedule, and optimize your content across all social media platforms in seconds.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg transition-all hover:scale-105 hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                    Start your 14-day free trial
                  </Button>
                </Link>
                <Link href="#features" className="text-base font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section id="features" className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wider">Deploy Faster</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to grow your brand</p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col bg-white p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center bg-indigo-50 text-indigo-600">
                      <SparklesIcon className="h-6 w-6" />
                    </div>
                    AI Content Generation
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Generate high-converting copy tailored to your brand voice for Facebook, Instagram, LinkedIn, and Twitter in just one click.</p>
                  </dd>
                </div>
                <div className="flex flex-col bg-white p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center bg-violet-50 text-violet-600">
                      <MessageSquareIcon className="h-6 w-6" />
                    </div>
                    Omnichannel Publishing
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Schedule and publish your AI-generated posts seamlessly across multiple social accounts from a single unified dashboard.</p>
                  </dd>
                </div>
                <div className="flex flex-col bg-white p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center bg-pink-50 text-pink-600">
                      <ChartBarIcon className="h-6 w-6" />
                    </div>
                    Smart Analytics
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Track engagement and conversion metrics. Let our AI analyze what works best and automatically optimize your future campaigns.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section id="pricing" className="py-24 sm:py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Choose the plan that best fits your growing business. No hidden fees.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 gap-x-8 lg:max-w-4xl lg:grid-cols-2">
              
              {/* Starter Plan */}
              <div className="flex flex-col justify-between border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
                <div>
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">Starter</h3>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$29</span>
                    <span className="text-base font-semibold leading-7 text-gray-600">/month</span>
                  </div>
                  <p className="mt-6 text-base leading-7 text-gray-600">Perfect for individuals and small startups starting with social media.</p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> Up to 3 Social Accounts</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> 100 AI Generations / month</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> Basic Analytics</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> 1 User Seat</li>
                  </ul>
                </div>
                <Link href="/auth/register" className="mt-8">
                  <Button variant="outline" className="w-full h-11 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                    Get started
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col justify-between border-2 border-indigo-600 bg-white p-8 shadow-xl sm:p-10 relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 bg-indigo-600 text-white px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-7 text-indigo-600">Professional</h3>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$79</span>
                    <span className="text-base font-semibold leading-7 text-gray-600">/month</span>
                  </div>
                  <p className="mt-6 text-base leading-7 text-gray-600">Dedicated for marketing teams and agencies needing power features.</p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> Unlimited Social Accounts</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> Unlimited AI Generations</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> Advanced Analytics & Reports</li>
                    <li className="flex gap-x-3"><CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" /> 5 User Seats</li>
                  </ul>
                </div>
                <Link href="/auth/register" className="mt-8">
                  <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                    Start Free Trial
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ===== BLOG SECTION ===== */}
        <section id="blog" className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wider">From our Blog</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Insights & tips for modern marketers</p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Stay ahead of the curve with the latest trends, strategies, and AI-powered marketing tips.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Blog Post 1 */}
              <article className="group flex flex-col overflow-hidden bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
                    alt="AI-powered social media strategy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                    AI Tips
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-x-2 text-xs text-gray-500 mb-3">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime="2026-07-10">Jul 10, 2026</time>
                    <span>·</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    10 Ways AI Can Transform Your Social Media Strategy in 2026
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 line-clamp-3">
                    Discover how artificial intelligence is reshaping content creation, scheduling, and audience engagement across every major platform.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
                      Learn more
                      <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>

              {/* Blog Post 2 */}
              <article className="group flex flex-col overflow-hidden bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                    alt="Social media analytics dashboard"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                    Analytics
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-x-2 text-xs text-gray-500 mb-3">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime="2026-07-05">Jul 5, 2026</time>
                    <span>·</span>
                    <span>7 min read</span>
                  </div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    How to Measure ROI on Your Social Media Campaigns
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 line-clamp-3">
                    Learn the key metrics every marketer should track, and how to turn raw data into actionable insights that drive real business growth.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
                      Learn more
                      <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>

              {/* Blog Post 3 */}
              <article className="group flex flex-col overflow-hidden bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80"
                    alt="Brand consistency across platforms"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                    Branding
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-x-2 text-xs text-gray-500 mb-3">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime="2026-06-28">Jun 28, 2026</time>
                    <span>·</span>
                    <span>4 min read</span>
                  </div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    Building a Consistent Brand Voice Across All Channels
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 line-clamp-3">
                    A strong brand voice builds trust. Here&apos;s how to define yours and keep it consistent from Instagram captions to LinkedIn articles.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
                      Learn more
                      <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-12 text-center">
              <Link href="/blog" className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
                View all articles
                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ===== PROFESSIONAL FOOTER ===== */}
      <footer className="bg-[#09090B] pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-white">
                <LogoIcon className="h-8 w-8" />
                <span className="text-xl font-bold tracking-tight">NextGen MarketingAI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
                Automate your marketing workflow at scale. The intelligent platform for modern teams to create, schedule, and optimize content effortlessly.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((platform) => (
                  <a 
                    key={platform}
                    href={`#${platform}`}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <SocialPlatformIcon 
                      platform={platform} 
                      className="h-4 w-4" 
                      style={{ color: '#ffffff' }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Product</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} NextGen MarketingAI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for marketing teams</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
