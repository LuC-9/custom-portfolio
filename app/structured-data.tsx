import { JsonLd } from 'react-schemaorg'
import { Organization, WebSite, Person } from 'schema-dts'

export function OrganizationStructuredData() {
  return (
    <JsonLd<Organization>
      item={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Aarsh Mishra | LuC",
        url: "https://www.byluc.in",
        logo: "https://www.byluc.in/genkai.gif",
        sameAs: [
          "https://github.com/LuC-9",
          "https://linkedin.com/in/aarsh-mishra09",
          "https://twitter.com/aarsh_mishra"
        ]
      }}
    />
  )
}

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
        jobTitle: "Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Nagarro"
        },
        description: "Software Developer at Nagarro specializing in React, TypeScript, Next.js, and modern web technologies.",
        knowsAbout: ["Web Development", "JavaScript", "TypeScript", "React", "Next.js", "TailwindCSS", "Node.js"],
        sameAs: [
          "https://github.com/LuC-9",
          "https://www.linkedin.com/in/aarsh-mishra09/"
        ]
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
        url: "https://www.byluc.in",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.byluc.in/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }}
    />
  )
}







