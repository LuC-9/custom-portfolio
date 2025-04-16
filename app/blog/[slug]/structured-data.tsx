import { JsonLd } from 'react-schemaorg'
import { BlogPosting } from 'schema-dts'

interface BlogPostStructuredDataProps {
  title: string
  description: string
  date: string
  author: string
  slug: string
  image?: string
}

export function BlogPostStructuredData({ 
  title, 
  description, 
  date, 
  author, 
  slug,
  image 
}: BlogPostStructuredDataProps) {
  const url = `https://www.byluc.in/blog/${slug}`
  
  return (
    <JsonLd<BlogPosting>
      item={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        author: {
          "@type": "Person",
          name: author,
          url: "https://www.byluc.in/about"
        },
        datePublished: date,
        image: image || "https://www.byluc.in/og-image.png",
        url: url,
        publisher: {
          "@type": "Person",
          name: "Aarsh Mishra",
          logo: {
            "@type": "ImageObject",
            url: "https://www.byluc.in/genkai.gif"
          }
        }
      }}
    />
  )
}
