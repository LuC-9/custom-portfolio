'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { emitGameEvent } from '@/lib/game/event-bus';

// Using NEXT_PUBLIC_GEMINI_API_KEY per guidelines
const getAiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

type Message = {
  role: 'user' | 'model';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm LuC's AI assistant. You can ask me anything about his projects, experience, or blog posts!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiClient = getAiClient();
  const chatSessionRef = useRef<any>(null);
  const hasTrackedFirstMessageRef = useRef(false);

  useEffect(() => {
    // Fetch context on load securely
    fetch('/api/portfolio-context')
      .then(res => res.json())
      .then(data => setContextData(data))
      .catch(err => console.error("Could not fetch portfolio context", err));
  }, []);

  useEffect(() => {
    if (aiClient && contextData && !chatSessionRef.current) {
      const systemInstruction = `You are a helpful AI assistant for Aarsh Mishra (LuC)'s portfolio website. 
Your goal is to answer visitor questions about Aarsh's projects, experience, and articles.

# Social Links & Contact Info
- x/twitter: https://twitter.com/xrshLuC
- GitHub: https://github.com/LuC-9
- LinkedIn: https://www.linkedin.com/in/aarsh-mishra09/
- YouTube: https://www.youtube.com/@LuC-Throws
- Discord Server: https://discord.gg/Sd8Uq73FeK
- Twitch: https://www.twitch.tv/luc_throws

# Contact Form Use
If the user wants to contact Aarsh directly, leave a message for him, or hire him, you MUST use the \`submitContactForm\` tool to send a message. Make sure you collect their name, email, the reason for contact (Regarding an Opportunity, Need help in Project/Idea, Query regarding Topic/Tech, Need Guidance, Meet in-person, Others), and the message body before calling the tool. Explain you can send a message on their behalf.
IMPORTANT: When you need to ask the user for the 'reason for contact', you MUST include the exact text "[REASON_DROPDOWN]" somewhere in your response. This will render a visual dropdown for them to select from.

Here is the context data in JSON format:
${JSON.stringify(contextData)}

Be polite, concise, and helpful. If you don't know the answer based on the context, say that you're not sure.`;

      chatSessionRef.current = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{
            functionDeclarations: [
              {
                name: 'submitContactForm',
                description: 'Submits a message to Aarsh on behalf of the user.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "The name of the user." },
                    email: { type: Type.STRING, description: "The email address of the user." },
                    reason: { 
                      type: Type.STRING, 
                      description: "The reason for contact.",
                      enum: [
                        "Regarding an Opportunity",
                        "Need help in Project/Idea",
                        "Query regarding Topic/Tech",
                        "Need Guidance",
                        "Meet in-person",
                        "Others"
                      ]
                    },
                    message: { type: Type.STRING, description: "The body of the message to send to Aarsh." },
                  },
                  required: ["name", "email", "reason", "message"],
                }
              }
            ]
          }]
        }
      });
    }
  }, [aiClient, contextData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, error]);

  const handleSend = async (overrideMsg?: string) => {
    const isString = typeof overrideMsg === 'string';
    const messageToSend = (isString && overrideMsg) ? overrideMsg : input.trim();
    if (!messageToSend || !aiClient || !chatSessionRef.current) return;
    
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
      const response = await chatSessionRef.current.sendMessage({
        message: messageToSend
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'submitContactForm') {
            const { name, email, reason, message } = call.args as Record<string, any>;
            
            setMessages(prev => [...prev, { role: 'model', text: `Sending message to Aarsh...` }]);
            
            let success = false;
            try {
               const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, reason, message })
               });
               if (res.ok) success = true;
            } catch (err) {
               console.error(err);
            }

            // Send tool response to Gemini
            const toolResponseResult = await chatSessionRef.current.sendMessage({
              message: [{
                 functionResponse: {
                   id: call.id,
                   name: call.name,
                   response: { result: success ? "success" : "failure" }
                 }
              }]
            });

            if (toolResponseResult.text) {
               setMessages(prev => [...prev, { role: 'model', text: toolResponseResult.text ?? '' }]);
            } else {
               setMessages(prev => [...prev, { role: 'model', text: success ? "Message sent successfully!" : "Failed to send message." }]);
            }
          }
        }
      } else if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text ?? '' }]);
      }
    } catch (err: any) {
      console.error("Chat error details:", err);
      // More detailed error formatting specifically to help diagnosing
      setError('Sorry, I encountered an error: ' + (err.message || String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!aiClient) {
    // Hide if API key is missing
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
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
                            {["Regarding an Opportunity", "Need help in Project/Idea", "Query regarding Topic/Tech", "Need Guidance", "Meet in-person", "Others"].map(reason => (
                              <Button 
                                key={reason} 
                                variant="outline" 
                                size="sm" 
                                className="justify-start text-xs h-auto py-2 whitespace-normal text-left sm:py-1.5"
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
                    <span className="text-sm text-muted-foreground">Thinking...</span>
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
                placeholder="Ask something..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 flex-1 rounded-full border border-border bg-input px-4 focus-visible:ring-1 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon" className="h-10 w-10 shrink-0 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-[10px] text-center text-muted-foreground mt-2">
              Runs on Gemini 2.5 Flash. May make mistakes.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
