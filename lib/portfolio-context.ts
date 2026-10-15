import { getAllContentData } from '@/lib/content';
import { plainText, type PortfolioContext, type PortfolioEntry } from '@/lib/heuristics';

async function loadEntries(directory: string) {
  return await getAllContentData(directory) as (PortfolioEntry & { contentHtml: string; date?: string })[];
}

export async function getPortfolioContext(): Promise<PortfolioContext> {
    const projects = await loadEntries("projects");
    const experiences = await loadEntries("experience");
    const gaming = await loadEntries("gaming-experience");
    const blog = await loadEntries("blog");
    
    const sanitizeHtml = plainText;

    const context = {
      projects: projects.map((p) => ({
        id: p.id,
        tags: p.tags,
        title: p.title,
        description: p.description,
        tech: p.tech,
        content: p.contentHtml ? sanitizeHtml(p.contentHtml).slice(0, 1000) : ''
      })),
      experiences: experiences.map((e) => ({
        id: e.id,
        tags: e.tags,
        title: e.title,
        company: e.company,
        role: e.role,
        period: e.period,
        description: e.description,
        skills: e.skills,
        content: e.contentHtml ? sanitizeHtml(e.contentHtml).slice(0, 500) : ''
      })),
      gaming_experiences: gaming.map((g) => ({
        id: g.id,
        tags: g.tags,
        title: g.title,
        role: g.role,
        period: g.period,
        description: g.description,
        content: g.contentHtml ? sanitizeHtml(g.contentHtml).slice(0, 500) : ''
      })),
      blog_posts: blog.map((b) => ({
        id: b.id,
        tags: b.tags,
        title: b.title,
        date: b.date,
        description: b.description,
        keywords: b.keywords,
        content: b.contentHtml ? sanitizeHtml(b.contentHtml).slice(0, 2000) : ''
      }))
    };
    
    return context;
}
