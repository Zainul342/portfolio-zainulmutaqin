import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, BookOpen, User, Hash } from 'lucide-react'
import { getPostBySlug, BLOG_POSTS } from '@/lib/blog'
import { Markdown } from '@/components/markdown'
import { ClientShell } from '@/components/client-shell'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} — Zainul Mutaqin`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Zainul Mutaqin`,
      description: post.excerpt,
      url: `https://zainulmutaqin.com/blog/${post.slug}`,
      images: '/opengraph-image',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <ClientShell>
      <main className="min-h-screen py-24 px-6 relative overflow-hidden">
        {/* Background visual accents */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 20%, rgba(203,166,247,0.02) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#6c7086] hover:text-[#cba6f7] transition-colors cursor-none group"
            >
              <ArrowLeft size={13} className="transform group-hover:-translate-x-0.5 transition-transform" />
              back to all articles
            </Link>
          </div>

          {/* ── BLOG CONTAINER ────────────────────────────────────────────────── */}
          <article
            className="rounded-xl overflow-hidden border p-8 sm:p-10 shadow-2xl mb-12"
            style={{
              backgroundColor: '#181825',
              borderColor: '#313244',
            }}
          >
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 border-b border-[#313244] pb-5 font-mono text-[10px] text-[#6c7086]">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} className="text-[#a6e3a1]" />
                <span className="text-[#cdd6f4]">{post.date}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-[#89b4fa]" />
                <span className="text-[#cdd6f4]">{post.readTime}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <User size={11} className="text-[#cba6f7]" />
                <span className="text-[#cdd6f4]">Zainul Mutaqin</span>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <Hash size={11} className="text-[#f9e2af]" />
                <span
                  className="uppercase tracking-wider font-bold"
                  style={{ color: '#f9e2af' }}
                >
                  {post.category}
                </span>
              </div>
            </div>

            {/* Markdown rendered body */}
            <div className="prose prose-invert max-w-none">
              <Markdown content={post.content} />
            </div>

            {/* Tags footer */}
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#313244]">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded text-xs font-mono border border-[#313244]"
                  style={{ backgroundColor: '#11111b', color: '#a6adc8' }}
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

          </article>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-[#313244]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#6c7086] hover:text-[#cba6f7] transition-colors cursor-none group"
            >
              <ArrowLeft size={13} className="transform group-hover:-translate-x-0.5 transition-transform" />
              back to all articles
            </Link>

            <span className="font-mono text-[10px] text-[#45475a]">
              // EOF: end of file
            </span>
          </div>

        </div>
      </main>
    </ClientShell>
  )
}
