import { NextResponse } from 'next/server';
import { getAllContentData } from '@/lib/content';

export async function GET() {
  try {
    const projects = await getAllContentData("projects");
    const experiences = await getAllContentData("experience");
    const gaming = await getAllContentData("gaming-experience");
    const blog = await getAllContentData("blog");
    
    // We only need the raw metadata and maybe raw content to pass to the AI
    // `getAllContentData` might parse it to HTML, so let's simplify and just
    // pass titles, descriptions, skills, etc. Or just the JSON structure.
    
    const sanitizeHtml = (htmlStr: string) => {
      // Very basic stripping for context purposes
      return htmlStr.replace(/<[^>]*>?/gm, ' ');
    };

    const context = {
      projects: projects.map((p: any) => ({
        title: p.title,
        description: p.description,
        tech: p.tech,
        content: p.contentHtml ? sanitizeHtml(p.contentHtml).slice(0, 1000) : ''
      })),
      experiences: experiences.map((e: any) => ({
        title: e.title,
        company: e.company,
        role: e.role,
        period: e.period,
        description: e.description,
        skills: e.skills,
        content: e.contentHtml ? sanitizeHtml(e.contentHtml).slice(0, 500) : ''
      })),
      gaming_experiences: gaming.map((g: any) => ({
        title: g.title,
        role: g.role,
        period: g.period,
        description: g.description,
        content: g.contentHtml ? sanitizeHtml(g.contentHtml).slice(0, 500) : ''
      })),
      blog_posts: blog.map((b: any) => ({
        title: b.title,
        date: b.date,
        description: b.description,
        keywords: b.keywords,
        content: b.contentHtml ? sanitizeHtml(b.contentHtml).slice(0, 2000) : '' // A larger slice for blogs maybe
      }))
    };
    
    return NextResponse.json(context);
  } catch (error) {
    console.error("Error fetching portfolio context:", error);
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 });
  }
}
