import { describe, it, expect } from 'vitest';
import { answerQuestion, summarize, plainText } from '@/lib/heuristics';
import { advanceContact } from '@/lib/contact-flow';

const context = { projects: [{ title: 'Clock', description: 'A desktop screensaver built with Rust.', tags: ['Rust'], id: 'clock' }], experiences: [], gaming_experiences: [], blog_posts: [] };
describe('heuristic assistant', () => {
  it('answers from matching content with source links', () => {
    expect(answerQuestion('Rust', context)).toContain('desktop screensaver');
    expect(answerQuestion('Rust', context)).toContain('](/projects)');
  });
  it('lists projects by intent and admits unknown answers', () => {
    expect(answerQuestion('show your projects', context)).toContain('Clock');
    expect(answerQuestion('quantum elephants', context)).toMatch(/couldn.t find/i);
  });
  it('handles greeting and social questions without inventing facts', () => {
    expect(answerQuestion('hello', context)).toMatch(/projects/i);
    expect(answerQuestion('github', context)).toContain('https://github.com/LuC-9');
  });
  it('removes scripts and decodes readable text', () => {
    expect(plainText('<script>evil()</script><p>A &amp; B</p>')).toBe('A & B');
  });
  it('produces deterministic bounded summaries from source text', () => {
    const article = '<p>Rust makes the clock portable.</p><p>The clock runs on desktops.</p>';
    const result = summarize(article, 'Clock');
    expect(result).toContain('Rust makes the clock portable.');
    expect(result).toBe(summarize(article, 'Clock'));
    expect(summarize('word '.repeat(500))).not.toHaveLength(0);
    expect(summarize('word '.repeat(500)).split(/\s+/).length).toBeLessThanOrEqual(150);
    expect(summarize('')).toMatch(/no readable/i);
  });
});
describe('guided contact', () => {
  it('collects validated fields, requires confirmation, supports retry and cancellation', () => {
    let result = advanceContact(null, 'contact');
    expect(result.text).toMatch(/name/i);
    result = advanceContact(result.state, 'Alex');
    result = advanceContact(result.state, 'invalid');
    expect(result.state?.step).toBe('email');
    result = advanceContact(result.state, 'alex@example.com');
    expect(result.text).toContain('[REASON_DROPDOWN]');
    result = advanceContact(result.state, 'made up');
    expect(result.state?.step).toBe('reason');
    result = advanceContact(result.state, 'Others');
    result = advanceContact(result.state, 'Hello Aarsh');
    expect(result.submit).toBeUndefined();
    expect(result.state?.step).toBe('confirm');
    const confirmed = advanceContact(result.state, 'send');
    expect(confirmed.submit?.email).toBe('alex@example.com');
    expect(advanceContact(confirmed.state, 'retry').submit).toEqual(confirmed.submit);
    expect(advanceContact(result.state, 'cancel').state).toBeNull();
  });
});
