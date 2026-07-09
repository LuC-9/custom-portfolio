'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { MagneticHover } from '@/components/motion/magnetic-hover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const getAiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

interface AiSummaryButtonProps {
  title: string;
  content: string;
}

export function AiSummaryButton({ title, content }: AiSummaryButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reducedTransparency, setReducedTransparency] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiClient = getAiClient();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-transparency: reduce)");
    setReducedTransparency(media.matches);
  }, []);

  const handleGenerateSummary = async () => {
    if (!aiClient || isLoading) return;
    
    if (summary) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const lightContent = content.replace(/<[^>]*>?/gm, ' ');

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are a highly capable reading assistant. Your job is to output a short, engaging TL;DR summary using bullet points for the provided blog post.",
        },
        contents: `Summarize the following blog post titled "${title}". Keep it under 150 words. \n\nContent:\n${lightContent}`
      });

      if (response.text) {
        setSummary(response.text);
      }
    } catch (err: any) {
      console.error(err);
      setError("Sorry, I couldn't generate a summary right now.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!aiClient) return null;

  return (
    <div className="my-6">
      <MagneticHover>
        <Button
          onClick={handleGenerateSummary}
          variant="outline"
          className="rounded-full border-primary/40 bg-transparent px-5"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
          {isLoading ? "Generating AI Summary..." : "Open AI TL;DR"}
        </Button>
      </MagneticHover>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className={`w-[420px] max-w-[calc(100vw-1rem)] rounded-xl border-border/60 shadow-kinetic ${
            reducedTransparency ? "bg-popover" : "bg-popover/80 backdrop-blur-xl"
          }`}
        >
          <SheetHeader className="mb-3">
            <SheetTitle className="flex items-center gap-2 font-sans text-xl tracking-tight">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </SheetTitle>
            <SheetDescription>{title}</SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-y-auto pr-1">
            {summary ? (
              <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                <Markdown>{summary}</Markdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Summary will appear here once generated.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
