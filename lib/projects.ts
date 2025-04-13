export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  order?: number;
}

// Update your getProjects function to filter featured projects
export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter(project => project.featured)
    .sort((a, b) => {
      // Sort by order if available
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // Fall back to title sort
      return a.title.localeCompare(b.title);
    });
}
