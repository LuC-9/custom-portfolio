'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { summarize } from '@/lib/heuristics';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { MagneticHover } from '@/components/motion/magnetic-hover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

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
  const [isAiSummary, setIsAiSummary] = useState(false);
  


  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-transparency: reduce)");
    setReducedTransparency(media.matches);
  }, []);

  const handleGenerateSummary = async () => {
    if (isLoading) return;
    
    if (summary) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error('Summary request failed');
      const data = await response.json();
      if (typeof data.summary !== 'string' || !data.summary.trim()) throw new Error('Empty summary');
      setSummary(data.summary);
      setIsAiSummary(data.mode === 'ai');
    } catch {
      setSummary(summarize(content, title));
      setIsAiSummary(false);
      setError('AI is unavailable. Showing an extract from the article.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="my-6">
      <MagneticHover>
        <Button
          onClick={handleGenerateSummary}
          variant="outline"
          className="rounded-full border-primary/40 bg-transparent px-5"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
          {isLoading ? "Preparing summary..." : "Open TL;DR"}
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
              Article summary
            </SheetTitle>
            <SheetDescription>{title} · {isAiSummary ? 'AI summary' : 'Extractive summary'}</SheetDescription>
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
