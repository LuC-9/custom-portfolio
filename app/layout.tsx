import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { PersonaProvider } from "@/contexts/persona-context"
import { Navigation } from "@/components/navigation"
import { Toaster } from '@/components/ui/sonner'
import { NavigationEventsWrapper } from '@/components/navigation-events-wrapper'
import { Analytics } from "@vercel/analytics/next"

// Load JetBrains Mono - a popular monospaced font for coding
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LuC | Aarsh Mishra - Developer & Gamer',
    template: '%s | LuC (Aarsh Mishra) '
  },
  description: 'Aarsh Mishra (LuC) - Engineer at Nagarro specializing in React, TypeScript, Next.js and modern web technologies.',
  keywords: ['Aarsh Mishra', 'Nagarro', 'Engineer', 'React Developer', 'TypeScript', 'Next.js', 'LuC', 'web developer', "Blog", "projects"],
  authors: [{ name: 'Aarsh Mishra', url: 'https://github.com/LuC-9' }],
  creator: 'Aarsh Mishra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.byluc.in',
    title: 'Aarsh Mishra | Engineer at Nagarro - Developer & Gamer',
    description: 'Aarsh Mishra (LuC) - Engineer at Nagarro specializing in React, TypeScript, Next.js and modern web technologies.',
    siteName: 'Aarsh Mishra Portfolio',
    images: [
      {
        url: '/profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Aarsh Mishra (LuC) - Developer & Gamer'
      }
    ],
    logo: 'https://www.byluc.in/genkai.gif'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuC | Aarsh Mishra - Developer & Gamer',
    description: 'Personal portfolio of Aarsh Mishra (LuC) - Software Developer, Web Engineer, and Gaming Enthusiast.',
    images: ['/profile.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/genkai.gif" type="image/gif" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <PersonaProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <NavigationEventsWrapper />
            <main className="flex-grow flex flex-col">{children}</main>
          </div>
          <Toaster />
          <Analytics />
        </PersonaProvider>
      </body>
    </html>
  )
}


import './globals.css'








