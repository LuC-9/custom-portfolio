import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { Chatbot } from '@/components/chatbot';
import { AiSummaryButton } from '@/components/ai-summary-button';
vi.mock('@/lib/game/event-bus', () => ({ emitGameEvent: vi.fn() }));
vi.mock('@/components/motion/magnetic-hover', () => ({ MagneticHover: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
beforeEach(() => { Element.prototype.scrollIntoView = vi.fn(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('heuristic widgets', () => {
  it('opens and answers questions without an API key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ text: 'A source-backed answer' }) });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: 'Open portfolio assistant' }));
    await user.type(screen.getByRole('textbox', { name: 'Your message' }), 'projects');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('A source-backed answer')).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/chat');
  });
  it('keeps a failed contact draft for retry and reports success only after delivery', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: 'Open portfolio assistant' }));
    const send = async (text: string) => {
      await user.type(screen.getByRole('textbox', { name: 'Your message' }), text);
      await user.click(screen.getByRole('button', { name: 'Send message' }));
    };
    await send('contact'); await send('Alex'); await send('alex@example.com');
    await user.click(screen.getByRole('button', { name: 'Others' }));
    await send('Hello Aarsh');
    expect(fetchMock).not.toHaveBeenCalled();
    await send('send');
    expect(await screen.findByText(/Contact delivery failed/)).toBeInTheDocument();
    expect(screen.queryByText('Your message was sent successfully!')).not.toBeInTheDocument();
    await send('retry');
    expect(await screen.findByText('Your message was sent successfully!')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1].body).toBe(fetchMock.mock.calls[1][1].body);
  });
  it('shows an extractive summary when the AI route is unavailable', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline')); vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<AiSummaryButton title="Clock" content="<p>The clock runs on desktops.</p>" />);
    await user.click(screen.getByRole('button', { name: 'Open TL;DR' }));
    expect(await screen.findByText('The clock runs on desktops.')).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/summarize');
    expect(await screen.findByText(/AI is unavailable. Showing an extract/)).toBeInTheDocument();
  });
  it('shows a generated AI summary returned by the server', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ summary: 'A generated clock summary.', mode: 'ai' }) }));
    const user = userEvent.setup();
    render(<AiSummaryButton title="Clock" content="<p>The clock runs on desktops.</p>" />);
    await user.click(screen.getByRole('button', { name: 'Open TL;DR' }));
    expect(await screen.findByText('A generated clock summary.')).toBeInTheDocument();
    expect(screen.getByText('Clock · AI summary')).toBeInTheDocument();
  });
});
