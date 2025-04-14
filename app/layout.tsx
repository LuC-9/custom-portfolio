import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { PersonaProvider } from "@/contexts/persona-context"
import { Navigation } from "@/components/navigation"
import { Toaster } from '@/components/ui/sonner'
import { NavigationEventsWrapper } from '@/components/navigation-events-wrapper'

// Load JetBrains Mono - a popular monospaced font for coding
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LuC | Aarsh Mishra - Developer & Gamer Portfolio',
    template: '%s | LuC (Aarsh Mishra) '
  },
  description: 'Personal portfolio of Aarsh Mishra (LuC) - Software Developer, Web Engineer, and Gaming Enthusiast.',
  keywords: ['Aarsh Mishra', 'LuC', 'developer', 'software engineer', 'web developer', 'portfolio', 'gaming', 'gamer' 'programmer'],
  authors: [{ name: 'Aarsh Mishra', url: 'https://github.com/LuC-9' }],
  creator: 'Aarsh Mishra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.byluc.in',
    title: 'LuC | Aarsh Mishra - Developer & Gamer Portfolio',
    description: 'Personal portfolio of Aarsh Mishra (LuC) - Software Developer, Web Engineer, and Gaming Enthusiast.',
    siteName: 'Aarsh Mishra Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aarsh Mishra (LuC) - Developer & Gamer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuC | Aarsh Mishra - Developer & Gamer',
    description: 'Personal portfolio of Aarsh Mishra (LuC) - Software Developer, Web Engineer, and Gaming Enthusiast.',
    images: ['/og-image.png']
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
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <PersonaProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <NavigationEventsWrapper />
            <main className="flex-grow flex flex-col">{children}</main>
          </div>
          <Toaster />
        </PersonaProvider>
      </body>
    </html>
  )
}


import './globals.css'








