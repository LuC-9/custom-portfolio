import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = "https://www.byluc.in"
  
  const sitemapIndexData = [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap/main`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap/projects`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap/community`,
      lastModified: new Date(),
    },
  ]
  
  // Generate XML
  const xml = generateSitemapIndexXml(sitemapIndexData)
  
  // Return XML response
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

// Helper function to generate sitemap index XML
function generateSitemapIndexXml(sitemapIndexData) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  for (const item of sitemapIndexData) {
    xml += '  <sitemap>\n'
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`
    
    if (item.lastModified) {
      const lastmod = item.lastModified instanceof Date 
        ? item.lastModified.toISOString() 
        : new Date(item.lastModified).toISOString()
      xml += `    <lastmod>${lastmod}</lastmod>\n`
    }
    
    xml += '  </sitemap>\n'
  }
  
  xml += '</sitemapindex>'
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

