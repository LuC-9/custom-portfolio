import { getAllContentData } from "@/lib/content"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL - replace with your actual domain when deployed
  const baseUrl = "https://www.byluc.in"
  
  // Get all blog posts and projects
  const blogs = await getAllContentData("blog")
  const projects = await getAllContentData("projects")
  
  // Create sitemap entries for blog posts
  const blogEntries = blogs.map(blog => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastModified: new Date(blog.date || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }))
  
  // Create sitemap entries for projects
  const projectEntries = projects.map(project => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(project.date || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }))
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }
  ]
  
  // Combine all entries
  return [...staticPages, ...blogEntries, ...projectEntries]
}