import { MDXRemote } from "next-mdx-remote/rsc"
import { highlight } from "sugar-high"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { AudioSummary } from "@/components/audio-summary"

function CustomLink(props) {
  let href = props.href

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

// Remove MermaidWrapper component
// Remove mermaid from components list

// Create heading components with anchor links
function createHeading(level) {
  return function Heading({ children, id }) {
    return React.createElement(
      `h${level}`,
      { id, className: `heading-${level}` },
      [
        React.createElement('a', {
          href: `#${id}`,
          key: `link-${id}`,
          className: 'anchor-link',
          'aria-hidden': true,
        }, '#'),
        children
      ]
    )
  }
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  AudioSummary: AudioSummary,
  // Remove mermaid from components list
}

export function BlogPost({ source, frontmatter }) {
  return (
    <article className="prose prose-quoteless prose-neutral dark:prose-invert">
      {frontmatter.audioSummary && (
        <AudioSummary 
          audioSrc={frontmatter.audioSummary} 
          title="Listen it as a podcast"
        />
      )}
      <MDXRemote source={source} components={components} />
    </article>
  )
}
