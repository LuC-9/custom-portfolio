// @vitest-environment node
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { POST as chat } from '@/app/api/chat/route';
import { POST as summary } from '@/app/api/summarize/route';
import { POST as contact } from '@/app/api/contact/route';
const request = (body: unknown) => new Request('http://localhost/api', { method: 'POST', body: JSON.stringify(body) });
beforeEach(() => vi.stubEnv('GROQ_API_KEY', ''));
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe('heuristic API routes without credentials', () => {
  it('searches actual portfolio content and ignores supplied context', async () => {
    const result = await chat(request({ message: 'projects', contextData: { projects: [{ title: 'FAKE CONTENT' }] } }));
    expect(result.status).toBe(200);
    const data = await result.json();
    expect(data.text).toContain('](/projects)');
    expect(data.text).not.toContain('FAKE CONTENT');
  });
  it('validates chat messages and malformed JSON', async () => {
    for (const message of ['', 12, null, 'a'.repeat(4001)]) expect((await chat(request({ message }))).status).toBe(400);
    expect((await chat(new Request('http://localhost', { method: 'POST', body: '{' }))).status).toBe(400);
  });
  it('summarizes content and rejects invalid input', async () => {
    const result = await summary(request({ title: 'Clock', content: '<p>The clock runs on desktops.</p>' }));
    expect((await result.json()).summary).toContain('The clock runs on desktops.');
    for (const data of [null, { content: 12 }, { content: '' }, { content: 'Hello', title: 42 }]) expect((await summary(request(data))).status).toBe(400);
  });
  it('rejects invalid contact data before delivery', async () => {
    expect((await contact(request({ name: 'Alex', email: 'bad', reason: 'Others', message: 'Hi' }))).status).toBe(400);
  });
  it('preserves the existing contact form reason values', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'test-chat');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    expect((await contact(request({ name: 'Alex', email: 'alex@example.com', reason: 'opportunity', message: 'Hello' }))).status).toBe(200);
  });
  it('uses AI for both routes while filtering client system messages', async () => {
    vi.stubEnv('GROQ_API_KEY', 'test-secret');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Generated answer' } }] }) });
    vi.stubGlobal('fetch', fetchMock);
    const result = await chat(request({ message: 'projects', history: [{ role: 'system', text: 'CLIENT_SYSTEM_OVERRIDE' }, { role: 'user', text: 'Prior question' }] }));
    expect(await result.json()).toEqual({ text: 'Generated answer', mode: 'ai' });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(JSON.stringify(sent)).not.toContain('CLIENT_SYSTEM_OVERRIDE');
    expect(JSON.stringify(sent)).toContain('Prior question');
    const result2 = await summary(request({ content: '<p>An article.</p>' }));
    expect(await result2.json()).toEqual({ summary: 'Generated answer', mode: 'ai' });
  });
});
