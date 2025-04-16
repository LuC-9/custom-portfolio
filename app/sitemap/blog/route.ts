import { getAllContentData } from "@/lib/content"
import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = "https://www.byluc.in"
  
  // Get blog data
  const blogs = await getAllContentData("blog")
  const sitemapData = blogs.map(blog => ({
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
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`
    
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
        xml += `      <image:loc>${escapeXml(image.url)}</image:loc>\n`
        if (image.title) {
          xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`
        }
        xml += '    </image:image>\n'
      }
    }
    
    xml += '  </url>\n'
  }
  
  xml += '</urlset>'
  return xml
}

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
