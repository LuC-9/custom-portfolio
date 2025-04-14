import { JsonLd } from 'react-schemaorg'
import { Person, WebSite } from 'schema-dts'

export function PersonStructuredData() {
  return (
    <JsonLd<Person>
      item={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Aarsh Mishra",
        alternateName: "LuC",
        url: "https://byluc.in",
        image: "https://byluc.in/profile.jpg",
        jobTitle: "Software Developer",
        sameAs: [
          "https://github.com/LuC-9",
          "https://www.linkedin.com/in/aarsh-mishra09/",
          // "https://twitter.com/yourtwitter"
        ],
        description: "Software Developer and Casual Gamer"
      }}
    />
  )
}

export function WebsiteStructuredData() {
  return (
    <JsonLd<WebSite>
      item={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Aarsh Mishra (LuC) Portfolio",
        url: "https://yourwebsite.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://yourwebsite.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }}
    />
  )
}