"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the ContactForm component with suspense
const ContactForm = dynamic(() => import("@/components/contact-form"), {
  loading: () => <div>Loading form...</div>,
  ssr: false // Disable SSR for this component
})

export default function ClientWrapper() {
  return <ContactForm />
}

