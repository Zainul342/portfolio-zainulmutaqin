import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://zainulmutaqin.com'),
  title: 'Zainul Mutaqin — Developer Portfolio',
  description:
    'Full-stack developer based in Jakarta. Building on the web, exploring the terminal, curious about what is next.',
  authors: [{ name: 'Zainul Mutaqin', url: 'https://github.com/Zainul342' }],
  keywords: ['Zainul Mutaqin', 'Developer Portfolio', 'Web Developer', 'React', 'Next.js', 'TypeScript', 'Linux', 'AI/ML'],
  openGraph: {
    title: 'Zainul Mutaqin — Developer Portfolio',
    description:
      'Full-stack developer based in Jakarta. Building on the web, exploring the terminal, curious about what is next.',
    url: 'https://zainulmutaqin.com',
    type: 'website',
    images: '/og-image.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zainul Mutaqin — Developer Portfolio',
    description:
      'Full-stack developer based in Jakarta. Building on the web, exploring the terminal, curious about what is next.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zainulmutaqin.com',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e1e2e',
  width: 'device-width',
  initialScale: 1,
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#1e1e2e] text-[#cdd6f4]">
        {children}
        {/* Widjet (widjet.com) embed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__wj = window.__wj || {};
              window.__wj.widgetId = "ba962aad-6fe3-4f4e-a1b9-b01377230a4e";
              window.__wj.product_name = "widjet";
              ;(function(w,d,s){
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s);
                j.async=true;
                j.src="https://jqvcafbrccpmygiihyry.supabase.co/functions/v1/widget-loader";
                f.parentNode.insertBefore(j,f);
              })(window,document,'script');
            `,
          }}
        />
        <noscript>Enable JavaScript to use the widget powered by Widjet</noscript>
      </body>
    </html>
  )
}
