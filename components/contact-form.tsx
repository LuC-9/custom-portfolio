'use client'

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MagneticHover } from "@/components/motion/magnetic-hover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  reason: z.string().min(1, { message: "Please select a reason for contact." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function ContactForm() {
  return (
    <Suspense fallback={<ContactFormFallback />}>
      <ContactFormContent />
    </Suspense>
  )
}

function ContactFormFallback() {
  return (
    <div className="animate-pulse rounded-xl border border-border/60 bg-card/40 p-6">
      <div className="mb-4 h-8 w-1/3 rounded bg-muted" />
      <div className="space-y-4">
        <div className="h-12 rounded-full bg-muted" />
        <div className="h-12 rounded-full bg-muted" />
        <div className="h-12 rounded-full bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
        <div className="h-12 rounded-full bg-muted" />
      </div>
    </div>
  )
}

function ContactFormContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const searchParams = useSearchParams()

  const defaultReason = searchParams?.get("reason") || ""

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
    setSubmitState("loading")
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
      setSubmitState("success")
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
      console.error(error)
      setSubmitState("error")
    } finally {
      setIsSubmitting(false)
      window.setTimeout(() => {
        setSubmitState((current) => (current === "loading" ? "idle" : current))
      }, 1200)
    }
  }

  const submitClassName =
    submitState === "success"
      ? "border-emerald-500/50 text-emerald-500"
      : submitState === "error"
        ? "border-rose-500/50 text-rose-500"
        : "border-primary/40"

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 md:p-7"
      >
        <div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight">Send message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your context and I will reply as soon as possible.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="h-12 rounded-full border border-border bg-input px-5 py-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="h-12 rounded-full border border-border bg-input px-5 py-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Reason</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger role="combobox" className="h-12 rounded-full border border-border bg-input px-5 py-3">
                    <SelectValue placeholder="Select a reason" />
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
            <FormItem className="space-y-2">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[160px] rounded-xl border border-border bg-input px-5 py-4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <MagneticHover>
          <Button
            type="submit"
            className={`w-full rounded-full border ${submitClassName}`}
            disabled={isSubmitting}
          >
            {submitState === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : submitState === "success" ? (
              "Message sent."
            ) : submitState === "error" ? (
              "Something broke. Try again."
            ) : (
              "Send message"
            )}
          </Button>
        </MagneticHover>
      </form>
    </Form>
  )
}
