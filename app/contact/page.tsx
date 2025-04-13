import { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { ContactSectionHeading } from "@/components/contact-section-heading"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact | LuC",
  description: "Get in touch with Aarsh Mishra for collaboration, job opportunities, or just to say hello.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
        <ContactSectionHeading />
        <ContactForm />
      </div>
      <Footer />
    </div>
  )
}























