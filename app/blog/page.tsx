import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Terminal, BookOpen, ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/blog'
import { ClientShell } from '@/components/client-shell'

export const metadata: Metadata = {
  title: 'Blog — Zainul Mutaqin',
  description: 'Write-ups, terminal chronicles, and engineering insights by Zainul Mutaqin.',
  openGraph: {
    title: 'Blog — Zainul Mutaqin',
    description: 'Write-ups, terminal chronicles, and engineering insights by Zainul Mutaqin.',
    url: 'https://zainulmutaqin.com/blog',
    images: '/opengraph-image',
  },
}

export default function BlogListingPage() {
  const posts = getAllPosts()

  return (
    <ClientShell>
      <main className="min-h-screen py-24 px-6 relative overflow-hidden">
        {/* Background visual accents */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(203,166,247,0.02) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#6c7086] hover:text-[#cba6f7] transition-colors cursor-none group"
            >
              <ArrowLeft size={13} className="transform group-hover:-translate-x-0.5 transition-transform" />
              back to homepage
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={20} className="text-[#cba6f7]" />
              <h1 className="text-4xl font-extrabold text-[#cdd6f4] tracking-tight">
                Chronicles
              </h1>
              <div className="flex-grow h-px ml-4" style={{ backgroundColor: '#313244' }} />
            </div>
            <p className="text-sm text-[#a6adc8] max-w-xl leading-relaxed">
              Write-ups on Linux optimization, React architecture design, neural networks, and development logs of a tech craftsman.
            </p>
          </div>

          {/* Blog posts grid */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-xl border p-6 transition-all duration-300 relative select-none flex flex-col justify-between"
                style={{
                  backgroundColor: '#181825',
                  borderColor: '#313244',
                }}
              >
                {/* Visual hover border indicator */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#cba6f7' }}
                />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                  {/* Category & Read time */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: 'rgba(203, 166, 247, 0.08)',
                        color: '#cba6f7',
                        borderColor: 'rgba(203, 166, 247, 0.2)',
                      }}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6c7086]">
                      <Clock size={11} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Date log */}
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6c7086]">
                    <Calendar size={11} />
                    <span>{post.date}</span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`} className="cursor-none group-hover:no-underline">
                  <h2 
                    className="text-lg font-bold mb-3 text-[#cdd6f4] group-hover:text-[#cba6f7] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    {post.title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all" />
                  </h2>
                </Link>

                <p className="text-xs leading-relaxed text-[#a6adc8] mb-5" style={{ lineHeight: 1.65 }}>
                  {post.excerpt}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#313244]">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[9px] font-mono border border-[#313244]"
                      style={{ backgroundColor: '#11111b', color: '#a6adc8' }}
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Bottom terminal bar aesthetic */}
          <div className="mt-16 p-4 rounded-lg bg-[#11111b] border border-[#313244] font-mono text-xs flex items-center justify-between text-[#6c7086]">
            <span>$ logger --type=blog "Pruning redundant logs..."</span>
            <span className="animate-pulse" style={{ color: '#a6e3a1' }}>● ONLINE</span>
          </div>

        </div>
      </main>
    </ClientShell>
  )
}
