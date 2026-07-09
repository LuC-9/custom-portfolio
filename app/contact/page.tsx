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
      <div className="mx-auto w-full max-w-[1400px] flex-grow px-4 pb-16 pt-28 md:px-6 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <section className="space-y-6">
            <ContactSectionHeading />
            <p className="max-w-[52ch] text-base text-muted-foreground leading-relaxed">
              Typical reply time is within 24 hours. Reach out for product engineering, frontend architecture, mentoring, or collaboration.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="mailto:aarshmail@gmail.com" className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                aarshmail@gmail.com
              </a>
              <a href="https://github.com/LuC-9" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/aarsh-mishra09/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                LinkedIn
              </a>
            </div>
          </section>
          <section>
            <ClientWrapper />
          </section>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-6">
        <Footer />
      </div>
    </div>
  )
}

