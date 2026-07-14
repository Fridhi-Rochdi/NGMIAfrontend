import { CalendarIcon, ChevronLeftIcon } from "@/components/icons";
import Link from "next/link";

const blogPosts = [
  {
    id: "ai-social-media-2026",
    title: "10 Ways AI Can Transform Your Social Media Strategy in 2026",
    excerpt:
      "Discover how artificial intelligence is reshaping content creation, scheduling, and audience engagement across every major platform. From automated content generation to predictive analytics, AI is becoming indispensable for modern marketers.",
    content: `Artificial intelligence has moved beyond being a buzzword — it's now a critical component of successful social media strategies. Here's how AI is transforming the landscape in 2026:

**1. Automated Content Creation**
AI tools can now generate high-quality posts, captions, and even video scripts that maintain your brand voice while saving hours of work.

**2. Smart Scheduling**
Machine learning algorithms analyze your audience's peak engagement times and automatically schedule posts for maximum impact.

**3. Predictive Analytics**
AI-powered analytics predict which content will perform best before you publish, allowing you to optimize your strategy proactively.

**4. Sentiment Analysis**
Understand how your audience feels about your brand in real-time with AI-driven sentiment analysis across all platforms.

**5. Personalized Content at Scale**
Deliver personalized content to different audience segments without manual effort.

**6. Visual Recognition**
AI can identify trending visual styles and suggest design elements that resonate with your target audience.

**7. Chatbot Integration**
Advanced AI chatbots handle customer inquiries 24/7, freeing up your team for strategic tasks.

**8. Competitive Intelligence**
AI tools monitor competitor strategies and surface actionable insights automatically.

**9. Content Repurposing**
Automatically transform long-form content into platform-specific posts, Reels, and Stories.

**10. ROI Prediction**
Predict the return on investment for campaigns before launch, helping you allocate budget more effectively.`,
    category: "AI Tips",
    categoryColor: "bg-indigo-100 text-indigo-700",
    date: "July 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    author: "Sarah Chen",
    authorRole: "AI Marketing Specialist",
  },
  {
    id: "measure-roi-campaigns",
    title: "How to Measure ROI on Your Social Media Campaigns",
    excerpt:
      "Learn the key metrics every marketer should track, and how to turn raw data into actionable insights that drive real business growth. Stop guessing — start measuring.",
    content: `Measuring social media ROI is essential for proving the value of your marketing efforts and optimizing your strategy. Here's your complete guide:

**Understanding Social Media ROI**
ROI (Return on Investment) measures the value you get from your social media activities compared to what you invest.

**Key Metrics to Track**

**1. Conversion Rate**
Track how many social media interactions lead to desired actions (sign-ups, purchases, downloads).

**2. Customer Acquisition Cost (CAC)**
Divide your total social media spend by the number of customers acquired through those channels.

**3. Engagement Rate**
Measure likes, comments, shares, and saves relative to your follower count.

**4. Reach and Impressions**
Understand how many people see your content and how often.

**5. Click-Through Rate (CTR)**
Track how many people click from your post to your website or landing page.

**6. Revenue Attribution**
Use UTM parameters and tracking pixels to connect social media traffic to revenue.

**Tools for Measurement**
- Google Analytics for website conversions
- Platform-native analytics (Meta Business Suite, Twitter Analytics)
- Marketing automation platforms
- Attribution modeling tools

**Setting Up Your Measurement Framework**
1. Define clear objectives (brand awareness, lead generation, sales)
2. Set baseline metrics
3. Track consistently over time
4. Create dashboards for real-time monitoring
5. Report monthly to stakeholders`,
    category: "Analytics",
    categoryColor: "bg-pink-100 text-pink-700",
    date: "July 5, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    author: "Michael Torres",
    authorRole: "Head of Analytics",
  },
  {
    id: "brand-voice-consistency",
    title: "Building a Consistent Brand Voice Across All Channels",
    excerpt:
      "A strong brand voice builds trust and recognition. Here's how to define yours and keep it consistent from Instagram captions to LinkedIn articles.",
    content: `Consistency is the foundation of strong branding. When your audience encounters your brand across different platforms, they should immediately recognize it — not just by the logo, but by the way you communicate.

**Why Brand Voice Matters**
- Builds trust and recognition
- Differentiates you from competitors
- Creates emotional connection with audience
- Ensures professional, cohesive presence

**Defining Your Brand Voice**

**1. Identify Your Brand Personality**
Are you professional or casual? Bold or subtle? Playful or serious? Your voice should reflect who you are as a company.

**2. Know Your Audience**
Your voice should resonate with your target demographic. A B2B SaaS company speaks differently than a Gen-Z fashion brand.

**3. Create Voice Guidelines**
Document your:
- Tone variations (when to be formal vs. casual)
- Vocabulary and terminology
- Messaging pillars
- What to avoid (words, phrases, styles)

**4. Train Your Team**
Everyone creating content should understand and follow the guidelines.

**Maintaining Consistency**

**1. Create Templates**
Use templates for common content types to maintain consistency.

**2. Review and Edit**
Have a clear approval process for content before publishing.

**3. Audit Regularly**
Periodically review your content across platforms to ensure alignment.

**4. Adapt Without Losing Core**
It's okay to adjust tone for different platforms while maintaining core identity.`,
    category: "Branding",
    categoryColor: "bg-amber-100 text-amber-700",
    date: "June 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    author: "Emma Rodriguez",
    authorRole: "Brand Strategist",
  },
  {
    id: "content-calendar-essentials",
    title: "The Ultimate Guide to Content Calendars for Marketing Success",
    excerpt:
      "A well-planned content calendar is your roadmap to consistent, effective marketing. Learn how to create one that actually works for your team.",
    content: `A content calendar is more than just a scheduling tool — it's a strategic asset that aligns your content with business goals.

**Benefits of a Content Calendar**
- Ensures consistent posting
- Allows for strategic planning
- Helps coordinate team efforts
- Enables better resource allocation
- Reduces last-minute stress

**How to Create Your Content Calendar**

**1. Audit Existing Content**
Review what's worked and what hasn't before planning new content.

**2. Define Content Pillars**
Identify 3-5 main topics your content will consistently cover.

**3. Choose Your Tools**
Options include:
- Spreadsheets (simple, free)
- Project management tools (Asana, Monday)
- Dedicated content calendar tools
- Marketing platform calendars

**4. Set Posting Cadence**
Determine how often to post on each platform based on capacity and audience expectations.

**5. Plan Around Key Dates**
Mark holidays, events, product launches, and industry observances.

**6. Create Content Themes**
Give each week or month a theme to create cohesive content.

**7. Batch Create Content**
Save time by creating multiple pieces of content in one sitting.

**8. Build in Flexibility**
Leave room for timely, reactive content while maintaining structure.`,
    category: "Strategy",
    categoryColor: "bg-emerald-100 text-emerald-700",
    date: "June 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    author: "David Kim",
    authorRole: "Content Director",
  },
  {
    id: "instagram-reels-2026",
    title: "Instagram Reels: Best Practices for Maximum Engagement in 2026",
    excerpt:
      "Reels continue to dominate Instagram. Master the algorithm with these proven strategies for creating content that converts viewers into followers.",
    content: `Instagram Reels remain one of the most powerful tools for organic growth on the platform. Here's how to maximize your reach in 2026.

**Understanding the Algorithm**
Instagram's algorithm prioritizes:
- Engagement (likes, comments, shares, saves)
- Watch time and replay value
- Content originality
- User preferences

**Creating Scroll-Stopping Reels**

**1. Hook in the First Second**
Your opening frame determines whether people keep watching. Start with a visual hook or intriguing statement.

**2. Keep It Concise**
While you can post up to 90 seconds, 15-30 seconds often performs best for engagement.

**3. Use Trending Audio Strategically**
Trending sounds can boost visibility, but ensure they fit your brand.

**4. Add Value Quickly**
Every second should serve a purpose — educate, entertain, or inspire.

**5. Include Captions**
Many users watch without sound. Captions ensure your message gets across.

**Technical Tips**
- Shoot in vertical 9:16 format
- Use good lighting (natural or ring light)
- Stabilize your shots
- Edit for pacing and flow
- Add text overlays for key points

**Engagement Boosters**
- End with a call-to-action (follow, comment, share)
- Ask questions in captions
- Respond to comments quickly
- Collaborate with other creators`,
    category: "Social Media",
    categoryColor: "bg-violet-100 text-violet-700",
    date: "June 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    author: "Lisa Park",
    authorRole: "Social Media Manager",
  },
  {
    id: "email-marketing-automation",
    title: "Email Marketing Automation: Save Time Without Sacrificing Personalization",
    excerpt:
      "Automation doesn't mean impersonal. Learn how to set up email sequences that feel personal while working for you around the clock.",
    content: `Email marketing automation allows you to deliver the right message to the right person at the right time — without manual effort.

**Why Automate?**
- Save hours of manual work
- Deliver timely, relevant messages
- Nurture leads on autopilot
- Increase conversions through behavioral triggers
- Maintain consistency

**Essential Automated Sequences**

**1. Welcome Series**
Introduce new subscribers to your brand:
- Email 1: Welcome + value proposition
- Email 2: Your story + social proof
- Email 3: Best content or product overview
- Email 4: Special offer or next step

**2. Abandoned Cart Recovery**
For e-commerce:
- Email 1: Reminder (1 hour)
- Email 2: Urgency + benefits (24 hours)
- Email 3: Last chance + exclusive discount (72 hours)

**3. Post-Purchase Follow-up**
- Thank you email
- Usage tips and tutorials
- Review request
- Cross-sell recommendations

**4. Re-engagement Campaigns**
Win back inactive subscribers with compelling content and offers.

**Personalization Tips**
- Use subscriber's name
- Reference past purchases or behavior
- Segment by interests and engagement
- Time sends based on user behavior
- Dynamic content blocks

**Measuring Success**
Track open rates, click rates, conversions, and revenue generated from each sequence.`,
    category: "Email Marketing",
    categoryColor: "bg-blue-100 text-blue-700",
    date: "June 8, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    author: "Rachel Green",
    authorRole: "Email Marketing Expert",
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-gray-900">MarketingAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              MarketingAI Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Insights & Strategies for Modern Marketers
            </h1>
            <p className="text-xl text-indigo-100">
              Expert advice on AI-powered marketing, social media strategy, content creation, and analytics to help you stay ahead of the competition.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
            Featured Article
          </h2>
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${featuredPost.categoryColor}`}
                  >
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">
                    {featuredPost.readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {featuredPost.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {featuredPost.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {featuredPost.authorRole}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${post.categoryColor}`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-x-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Our Newsletter
            </h3>
            <p className="text-gray-400 mb-8">
              Get the latest marketing insights, AI tips, and industry trends delivered to your inbox weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-white">MarketingAI</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 MarketingAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}