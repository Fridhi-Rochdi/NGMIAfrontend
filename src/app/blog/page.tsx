import { ChevronLeftIcon, CalendarIcon, LogoIcon } from "@/components/icons";
import Link from "next/link";

const blogPosts = [
  {
    id: "ai-social-media-2026",
    title: "10 Ways AI Can Transform Your Social Media Strategy",
    excerpt: "Discover how artificial intelligence is reshaping content creation, scheduling, and audience engagement across every major platform. From automated content generation to predictive analytics.",
    category: "AI Tips",
    categoryColor: "text-fuchsia-400",
    borderColor: "border-fuchsia-500",
    hoverColor: "hover:border-fuchsia-500",
    date: "July 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    author: "Sarah Chen",
    authorRole: "AI Specialist",
  },
  {
    id: "measure-roi-campaigns",
    title: "How to Measure ROI on Your Social Media Campaigns",
    excerpt: "Learn the key metrics every marketer should track, and how to turn raw data into actionable insights that drive real business growth. Stop guessing — start measuring.",
    category: "Analytics",
    categoryColor: "text-cyan-400",
    borderColor: "border-cyan-500",
    hoverColor: "hover:border-cyan-500",
    date: "July 5, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    author: "Michael Torres",
    authorRole: "Head of Analytics",
  },
  {
    id: "brand-voice-consistency",
    title: "Building a Consistent Brand Voice Across All Channels",
    excerpt: "A strong brand voice builds trust and recognition. Here's how to define yours and keep it consistent from Instagram captions to LinkedIn articles.",
    category: "Branding",
    categoryColor: "text-purple-400",
    borderColor: "border-purple-500",
    hoverColor: "hover:border-purple-500",
    date: "June 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    author: "Emma Rodriguez",
    authorRole: "Brand Strategist",
  },
  {
    id: "content-calendar-essentials",
    title: "The Ultimate Guide to Content Calendars for Marketing Success",
    excerpt: "A well-planned content calendar is your roadmap to consistent, effective marketing. Learn how to create one that actually works for your team.",
    category: "Strategy",
    categoryColor: "text-emerald-400",
    borderColor: "border-emerald-500",
    hoverColor: "hover:border-emerald-500",
    date: "June 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    author: "David Kim",
    authorRole: "Content Director",
  },
  {
    id: "instagram-reels-2026",
    title: "Instagram Reels: Best Practices for Maximum Engagement",
    excerpt: "Reels continue to dominate Instagram. Master the algorithm with these proven strategies for creating content that converts viewers into followers.",
    category: "Social Media",
    categoryColor: "text-rose-400",
    borderColor: "border-rose-500",
    hoverColor: "hover:border-rose-500",
    date: "June 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    author: "Lisa Park",
    authorRole: "Social Manager",
  },
  {
    id: "email-marketing-automation",
    title: "Email Marketing Automation: Save Time Without Sacrificing Personalization",
    excerpt: "Automation doesn't mean impersonal. Learn how to set up email sequences that feel personal while working for you around the clock.",
    category: "Email Marketing",
    categoryColor: "text-amber-400",
    borderColor: "border-amber-500",
    hoverColor: "hover:border-amber-500",
    date: "June 8, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    author: "Rachel Green",
    authorRole: "Email Expert",
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
            <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Platform</span>
          </Link>
          <div className="flex items-center gap-3">
            <LogoIcon className="h-10 w-10" />
            <span className="font-bold text-white uppercase tracking-wider">NextGen AI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 blur-[100px] -z-10" />
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block border border-white/20 bg-white/5 backdrop-blur-sm text-white text-xs font-bold tracking-[0.3em] uppercase px-6 py-2 mb-8">
            Knowledge Base
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase text-white">
            Insights & Strategies <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">For Modern Marketers</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Expert advice on AI-powered marketing, social media strategy, content creation, and analytics to help you stay ahead of the competition.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-24 border-b border-white/10 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <h2 className="text-sm font-bold leading-7 text-white uppercase tracking-[0.2em] mb-12 flex items-center gap-4">
            <span className="w-8 h-px bg-fuchsia-500"></span>
            Featured Transmission
          </h2>
          <article className="group bg-[#111] border border-white/10 overflow-hidden hover:border-fuchsia-500 transition-colors duration-500">
            <div className="md:flex">
              <div className="md:w-1/2 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 min-h-[400px]"
                />
                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2">
                  <span className={`text-xs font-bold uppercase tracking-widest ${featuredPost.categoryColor}`}>
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8 text-xs font-bold tracking-widest uppercase text-gray-500">
                  <span>{featuredPost.readTime}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span>{featuredPost.date}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase leading-tight group-hover:text-fuchsia-400 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-400 mb-12 leading-relaxed font-light text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black border border-white/20 flex items-center justify-center text-white font-bold text-sm">
                      {featuredPost.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-wider">
                        {featuredPost.author}
                      </p>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {featuredPost.authorRole}
                      </p>
                    </div>
                  </div>
                  <Link href="#" className="flex items-center justify-center w-12 h-12 bg-white text-black hover:bg-fuchsia-500 hover:text-white transition-colors">
                    <span className="font-bold">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <h2 className="text-sm font-bold leading-7 text-white uppercase tracking-[0.2em] mb-12 flex items-center gap-4">
            <span className="w-8 h-px bg-cyan-500"></span>
            Intelligence Archive
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                className={`group flex flex-col bg-[#111] border border-white/10 hover:border-white/30 transition-all duration-300`}
              >
                <div className="relative overflow-hidden border-b border-white/10 aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5">
                    <span className={`text-xs font-bold uppercase tracking-widest ${post.categoryColor}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase leading-snug group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                        {post.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold tracking-widest uppercase text-gray-600">
            <div className="flex items-center gap-3">
              <LogoIcon className="h-8 w-8" />
              <span className="text-gray-400">NextGen AI Blog</span>
            </div>
            <p>© {new Date().getFullYear()} NextGen. Built for scale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
