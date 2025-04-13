export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean; // Add this field
}

// Update your getProjects function to filter featured projects
export function getFeaturedProjects(): Project[] {
  return getProjects().filter(project => project.featured);
}