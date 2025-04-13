import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use the default components with our custom ones
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="my-4">{children}</p>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        alt={props.alt || ''}
        {...props}
        width={800}
        height={400}
      />
    ),
    ...components,
  }
}