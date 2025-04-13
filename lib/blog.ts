export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  readingTime?: string; // Add reading time field
}

// Add a function to get featured blog posts
export function getFeaturedBlogPosts(): BlogPost[] {
  return getBlogPosts().filter(post => post.featured);
}
