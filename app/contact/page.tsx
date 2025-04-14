import { Metadata } from "next"
import { ContactSectionHeading } from "@/components/contact-section-heading"
import { Footer } from "@/components/footer"
import ClientWrapper from "./ClientWrapper"

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with LuC for collaboration, job opportunities, or just to say hello.",
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

