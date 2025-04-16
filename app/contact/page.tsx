import type { Metadata } from 'next'
import { ContactSectionHeading } from '@/components/contact-section-heading'
import ClientWrapper from './ClientWrapper'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Contact Aarsh Mishra | Software Developer',
  description: 'Get in touch with Aarsh Mishra for collaboration, job opportunities, or questions.',
  keywords: ['Aarsh Mishra', 'contact', 'hire', 'collaboration','Aarsh Mishra', 'software developer', 'web developer', 'developer', 'portfolio', 'LuC', 'programmer', 'engineer', 'gamer', 'web developer', "Blog", "projects"],
  alternates: {
    canonical: 'https://www.byluc.in/contact'
  }
  // keywords: ['Aarsh Mishra', 'contact', 'hire', 'collaboration']
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto pt-24 md:pt-32 pb-12 md:pb-24 flex-grow">
        <div className="max-w-2xl mx-auto px-4">
          <ContactSectionHeading />
          <ClientWrapper />
        </div>
      </div>
      <Footer />
    </div>
  )
}

