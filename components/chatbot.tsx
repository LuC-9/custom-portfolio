'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { advanceContact, CONTACT_REASONS, isContactIntent, type ContactState } from '@/lib/contact-flow';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { emitGameEvent } from '@/lib/game/event-bus';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm LuC's portfolio assistant. Ask about his projects, experience, or blog posts, or say contact to send a message." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactState, setContactState] = useState<ContactState | null>(null);
  const [answerMode, setAnswerMode] = useState<'ai' | 'heuristic' | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const questionHistoryRef = useRef<Message[]>([]);
  const hasTrackedFirstMessageRef = useRef(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, error]);

  const handleSend = async (overrideMsg?: string) => {
    const isString = typeof overrideMsg === 'string';
    const messageToSend = (isString && overrideMsg) ? overrideMsg : input.trim();
    if (!messageToSend || sendingRef.current) return;
    sendingRef.current = true;
    
    setError(null);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);
    if (!hasTrackedFirstMessageRef.current) {
      emitGameEvent({
        type: "chatbot_message",
        taskId: "chatbot:first-message",
      });
      hasTrackedFirstMessageRef.current = true;
    }

    try {
      let text: string;
      if (contactState || isContactIntent(messageToSend)) {
        const result = advanceContact(contactState, messageToSend);
        setContactState(result.state);
        text = result.text;
        if (result.submit) {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.submit),
          });
          if (!response.ok) throw new Error('Contact delivery failed. Type retry to try again, or cancel.');
          setContactState(null);
          text = 'Your message was sent successfully!';
        }
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageToSend, history: questionHistoryRef.current }),
        });
        if (!response.ok) throw new Error('Portfolio search is unavailable. Please try again.');
        const data = await response.json();
        text = data.text;
        questionHistoryRef.current = [...questionHistoryRef.current, { role: 'user', text: messageToSend }, { role: 'model', text }].slice(-6) as Message[];
        setAnswerMode(data.mode === 'ai' ? 'ai' : 'heuristic');
      }
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (err: unknown) {
      setError(contactState?.step === 'confirm' ? 'Contact delivery failed. Type retry to try again, or cancel.' : err instanceof Error ? err.message : 'Request failed. Please try again.');
    } finally {
      sendingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          aria-label="Open portfolio assistant"
          onClick={() => {
            emitGameEvent({ type: "chatbot_open", taskId: "chatbot:open" });
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border border-primary/40 bg-primary p-0 text-primary-foreground shadow-kinetic transition-transform hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 right-6 z-50 flex max-h-[70vh] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-kinetic transition-all duration-300 ease-in-out
            ${isExpanded ? 'h-[70vh]' : 'h-[540px]'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-sans text-sm font-semibold tracking-tight">Ask about my portfolio</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button aria-label={isExpanded ? "Minimize chat" : "Expand chat"} variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button aria-label="Close chat" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((message, i) => (
                <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                      message.role === 'user' 
                        ? 'rounded-br-none bg-primary text-primary-foreground' 
                        : 'rounded-bl-none bg-card'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.text
                    ) : (
                      <>
                        <div className="markdown-body prose prose-slate dark:prose-invert prose-sm max-w-none">
                          <Markdown remarkPlugins={[remarkGfm]}>{message.text.replace('[REASON_DROPDOWN]', '')}</Markdown>
                        </div>
                        {message.text.includes('[REASON_DROPDOWN]') && i === messages.length - 1 && (
                          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                            <span className="text-xs font-medium text-muted-foreground mb-1">Select Reason:</span>
                            {CONTACT_REASONS.map(reason => (
                              <Button 
                                key={reason} 
                                variant="outline" 
                                size="sm" 
                                className="justify-start text-xs h-auto py-2 whitespace-normal text-left sm:py-1.5"
                                disabled={isLoading}
                                onClick={() => handleSend(reason)}
                              >
                                {reason}
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl rounded-bl-none bg-card px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Searching...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-destructive bg-destructive/10 px-3 py-1 rounded-full">{error}</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="rounded-b-xl border-t border-border/60 bg-popover p-4">
            <div className="flex gap-2 items-center">
              <Input
                aria-label="Your message"
                maxLength={4000}
                placeholder="Ask something..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 flex-1 rounded-full border border-border bg-input px-4 focus-visible:ring-1 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
              <Button aria-label="Send message" onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon" className="h-10 w-10 shrink-0 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-[10px] text-center text-muted-foreground mt-2">
              {answerMode === 'ai' ? 'AI answers from portfolio content. May make mistakes.' : answerMode === 'heuristic' ? 'Showing portfolio search results. AI is unavailable.' : 'Ask about projects, experience, or articles.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
