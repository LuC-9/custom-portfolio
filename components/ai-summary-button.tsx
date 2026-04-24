'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';

// Using NEXT_PUBLIC_GEMINI_API_KEY per guidelines
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const aiClient = getAiClient();

  const handleGenerateSummary = async () => {
    if (!aiClient || isLoading) return;
    
    // If we already have the summary, just toggle visibility
    if (summary) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      // Strip some HTML just to lighten the payload (basic regex)
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
      <Button 
        onClick={handleGenerateSummary} 
        variant={summary ? "outline" : "default"}
        className="flex items-center gap-2 group"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : summary ? (
          isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4 text-amber-400 group-hover:text-amber-500" />
        )}
        <span className="font-medium">
          {isLoading 
            ? "Generating AI Summary..." 
            : summary 
              ? (isExpanded ? "Hide TL;DR" : "Show TL;DR") 
              : "Generate AI TL;DR"
          }
        </span>
      </Button>

      {summary && isExpanded && (
        <div className="mt-4 p-5 rounded-xl border border-border bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-amber-500"></div>
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold text-sm uppercase tracking-wider">AI Summary</h4>
          </div>
          <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground">
            <Markdown>{summary}</Markdown>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
