import { getAllContentData } from "@/lib/content"
import { NextResponse } from "next/server"

export async function generateStaticParams() {
  return [
    { type: 'main' },
    { type: 'blog' },
    { type: 'projects' },
    { type: 'community' }
  ]
}

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  const baseUrl = "https://www.byluc.in"
  const { type } = params
  let sitemapData = []
  
  // Main sitemap with static pages
  if (type === 'main') {
    sitemapData = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8
      },
      {
        url: `${baseUrl}/community`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9
      }
    ]
  }
  
  // Blog sitemap
  if (type === 'blog') {
    const blogs = await getAllContentData("blog")
    sitemapData = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.id}`,
      lastModified: new Date(blog.date || Date.now()),
      changeFrequency: "monthly",
      priority: 0.7,
      ...(blog.image && {
        images: [
          {
            url: blog.image.startsWith('http') ? blog.image : `${baseUrl}${blog.image}`,
            title: blog.title
          }
        ]
      })
    }))
  }
  
  // Projects sitemap
  if (type === 'projects') {
    const projects = await getAllContentData("projects")
    sitemapData = projects.map(project => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(project.date || Date.now()),
      changeFrequency: "monthly",
      priority: 0.8,
      ...(project.image && {
        images: [
          {
            url: project.image.startsWith('http') ? project.image : `${baseUrl}${project.image}`,
            title: project.title
          }
        ]
      })
    }))
  }
  
  // Generate XML
  const xml = generateSitemapXml(sitemapData)
  
  // Return XML response
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

// Helper function to generate XML
function generateSitemapXml(sitemapData) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
  xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  
  for (const item of sitemapData) {
    xml += '  <url>\n'
    xml += `    <loc>${item.url}</loc>\n`
    
    if (item.lastModified) {
      const lastmod = item.lastModified instanceof Date 
        ? item.lastModified.toISOString() 
        : new Date(item.lastModified).toISOString()
      xml += `    <lastmod>${lastmod}</lastmod>\n`
    }
    
    if (item.changeFrequency) {
      xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`
    }
    
    if (item.priority !== undefined) {
      xml += `    <priority>${item.priority}</priority>\n`
    }
    
    // Add image information if available
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        xml += '    <image:image>\n'
        xml += `      <image:loc>${image.url}</image:loc>\n`
        if (image.title) {
          xml += `      <image:title>${image.title}</image:title>\n`
        }
        xml += '    </image:image>\n'
      }
    }
    
    xml += '  </url>\n'
  }
  
  xml += '</urlset>'
  return xml
}


