import { Metadata } from "next"
import { ContactSectionHeading } from "@/components/contact-section-heading"
import { Footer } from "@/components/footer"
import ClientWrapper from "./ClientWrapper"

export const metadata: Metadata = {
  title: "Contact | LuC",
  description: "Get in touch with LuC for collaboration, job opportunities, or just to say hello.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-24">
      <div className="max-w-2xl mx-auto">
        <ClientWrapper />
      </div>
    </div>
  )
}

