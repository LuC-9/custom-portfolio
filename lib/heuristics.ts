export interface PortfolioEntry {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  company?: string;
  role?: string;
  period?: string;
  tags?: string[];
  tech?: string[];
  skills?: string[];
  keywords?: string[];
}
export interface PortfolioContext {
  projects: PortfolioEntry[];
  experiences: PortfolioEntry[];
  gaming_experiences: PortfolioEntry[];
  blog_posts: PortfolioEntry[];
}

const stop = new Set('a an the and or to of in on is are was with for my your his her me you i about tell show what which does do can please aarsh luc mishra'.split(' '));
const tokens = (text: string) => [...new Set((text.toLowerCase().match(/[\p{L}\p{N}+#]+/gu) || []).filter(word => !stop.has(word)))];

export function plainText(content: string): string {
  return content
    .replace(/<(script|style|pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, value: string) => {
      const code = value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    })
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/gi, (_, entity: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[entity.toLowerCase()] || ' ')
    .replace(/\s+/g, ' ').trim();
}

export function summarize(content: string, title = ''): string {
  const text = plainText(content);
  if (!text) return 'No readable content is available to summarize.';
  const sentences = text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [text];
  const frequencies = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[\p{L}\p{N}+#]+/gu) || []) {
    if (!stop.has(word)) frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }
  const titleWords = tokens(title);
  const ranked = sentences.map((sentence, index) => ({ sentence: sentence.trim(), index,
    score: tokens(sentence).reduce((score, word) => score + (frequencies.get(word) || 0) + (titleWords.includes(word) ? 3 : 0), 0) / Math.sqrt(Math.max(1, tokens(sentence).length))
  })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).sort((a, b) => a.index - b.index);
  let budget = 140;
  return ranked.flatMap(({ sentence }) => {
    if (!budget) return [];
    const words = sentence.split(/\s+/);
    const excerpt = words.slice(0, budget).join(' ') + (words.length > budget ? '…' : '');
    budget -= Math.min(budget, words.length);
    return [`- ${excerpt}`];
  }).join('\n');
}

export function answerQuestion(message: string, context: PortfolioContext): string {
  const query = message.toLowerCase();
  if (/^(hi|hello|hey|thanks|thank you)[!.\s]*$/.test(query)) return "Hi! Ask about Aarsh's projects, work experience, gaming, skills, or blog posts. Say contact to send him a message.";
  if (/\b(github|linkedin|twitter|youtube|twitch|discord|social)\b/.test(query)) {
    return '[GitHub](https://github.com/LuC-9) · [LinkedIn](https://www.linkedin.com/in/aarsh-mishra09/) · [Twitter](https://twitter.com/xrshLuC) · [YouTube](https://www.youtube.com/@LuC-Throws) · [Twitch](https://www.twitch.tv/luc_throws) · [Discord](https://discord.gg/Sd8Uq73FeK)';
  }
  const categories: [keyof PortfolioContext, string, RegExp][] = [
    ['projects', '/projects', /\b(projects?|built|portfolio)\b/],
    ['experiences', '/', /\b(experience|career|work|jobs?|company)\b/],
    ['gaming_experiences', '/', /\b(gaming|gamer|esports|games?)\b/],
    ['blog_posts', '/blog', /\b(blog|posts?|articles?|writing)\b/],
  ];
  const intent = categories.find(([, , pattern]) => pattern.test(query));
  const words = tokens(query).filter(word => !/^(projects?|experience|career|work|jobs?|gaming|gamer|esports|games?|blog|posts?|articles?|skills?|tech|technologies|stack|built|portfolio|writing)$/.test(word));
  const results = categories.flatMap(([key, path]) => (context[key] || []).map(entry => {
    const heading = tokens([entry.title, entry.company, entry.role, ...(entry.tags || []), ...(entry.tech || []), ...(entry.skills || []), ...(entry.keywords || [])].join(' '));
    const body = tokens([entry.description, entry.content].join(' '));
    const score = words.reduce((sum, word) => sum + (heading.includes(word) ? 5 : body.includes(word) ? 1 : 0), 0);
    const generalSkills = /\b(skills?|tech|technologies|stack)\b/.test(query) && !words.length;
    return { entry, path, score: score + ((intent?.[0] === key || generalSkills) && !words.length ? 1 : 0), key };
  })).filter(item => item.score > 0 && (!intent || item.key === intent[0])).sort((a, b) => b.score - a.score).slice(0, 3);
  if (!results.length) return "I couldn't find that in the portfolio. Try a project name, technology, work experience, gaming, or blog topic. Say contact to ask Aarsh directly.";
  return results.map(({ entry, path }) => {
    const title = plainText(entry.title || entry.role || entry.company || 'Portfolio entry');
    const link = path === '/blog' && entry.id ? `${path}/${encodeURIComponent(entry.id)}` : path;
    const detail = plainText(entry.description || entry.content || [entry.role, entry.company, entry.period].filter(Boolean).join(' · '));
    const excerpt = detail.split(/\s+/).slice(0, 65).join(' ');
    return `**[${title.replace(/[\[\]\\]/g, '')}](${link})**\n\n${excerpt}${detail.split(/\s+/).length > 65 ? '…' : ''}`;
  }).join('\n\n');
}
