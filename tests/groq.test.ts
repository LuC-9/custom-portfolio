// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateWithGroq } from '@/lib/groq';
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('server Groq integration', () => {
  it('does not call a provider without a key', async () => {
    vi.stubEnv('GROQ_API_KEY', '');
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    expect(await generateWithGroq([{ role: 'user', content: 'Hi' }])).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('uses the free-plan model and private authorization', async () => {
    vi.stubEnv('GROQ_API_KEY', 'test-secret'); vi.stubEnv('GROQ_MODEL', '');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Answer' } }] }) });
    vi.stubGlobal('fetch', fetchMock);
    expect(await generateWithGroq([{ role: 'user', content: 'Hi' }])).toBe('Answer');
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(options.headers.Authorization).toBe('Bearer test-secret');
    expect(JSON.parse(options.body).model).toBe('openai/gpt-oss-20b');
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
  it('falls back on rate limits, network errors, and empty completions', async () => {
    vi.stubEnv('GROQ_API_KEY', 'test-secret');
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 429 })
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [] }) });
    vi.stubGlobal('fetch', fetchMock);
    for (let index = 0; index < 3; index++) expect(await generateWithGroq([{ role: 'user', content: 'Hi' }])).toBeNull();
  });
});
