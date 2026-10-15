// Server routes only: never import this module into a client component.
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** A single bounded attempt; callers retain useful deterministic fallbacks. */
export async function generateWithGroq(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-20b',
        messages,
        max_completion_tokens: 1024,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(15000),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch {
    // Do not log provider bodies, user messages, or credentials.
    return null;
  }
}
