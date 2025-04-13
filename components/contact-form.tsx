'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Suspense } from "react"
import { toast } from "sonner"
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Form schema definition
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  reason: z.string().min(1, { message: "Please select a reason for contact." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

// Create a wrapper component that doesn't use useSearchParams
export default function ContactForm() {
  return (
    <Suspense fallback={<ContactFormFallback />}>
      <ContactFormContent />
    </Suspense>
  )
}

// Fallback component
function ContactFormFallback() {
  return (
    <div className="p-6 border rounded-lg shadow-sm animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}

// Move the component that uses useSearchParams to a separate component
function ContactFormContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Import useSearchParams inside the component
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  
  // Get any pre-filled values from URL if they exist
  const defaultReason = searchParams?.get('reason') || ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: defaultReason,
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to submit the form")
      }

      form.reset()
      toast.success("Message sent successfully!")
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border border-primary/30 rounded-lg p-6 mt-16">
        <h2 className="text-xl font-semibold mb-2">Send a Message</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Please feel free to contact me regarding any <span className="font-bold text-primary">Opportunities</span>, <span className="font-bold text-primary">Queries</span> or if you <span className="font-bold text-primary">Need some Help</span> with your project/idea.
        </p>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason for contact" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="opportunity">Regarding an Opportunity</SelectItem>
                  <SelectItem value="project-help">Need help in Project/Idea</SelectItem>
                  <SelectItem value="tech-query">Query regarding Topic/Tech</SelectItem>
                  <SelectItem value="guidance">Need Guidance</SelectItem>
                  <SelectItem value="meet">Meet in-person</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message" className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  )
}
