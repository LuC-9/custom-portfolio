import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Aarsh Mishra | Software Developer',
  description: 'Get in touch with Aarsh Mishra for collaboration, job opportunities, or questions.',
  keywords: ['Aarsh Mishra', 'contact', 'hire', 'collaboration']
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

