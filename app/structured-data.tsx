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
        url: "https://www.byluc.in",
        image: "https://www.byluc.in/profile.jpg",
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
        name: "LuC | Aarsh Mishra",
        url: "https://byluc.in",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.byluc.in/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }}
    />
  )
}

