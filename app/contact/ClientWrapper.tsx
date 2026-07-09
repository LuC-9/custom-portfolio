"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const ContactForm = dynamic(() => import("@/components/contact-form"), {
  loading: () => <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-sm text-muted-foreground">Loading form...</div>,
  ssr: false
})

export default function ClientWrapper() {
  return <ContactForm />
}

