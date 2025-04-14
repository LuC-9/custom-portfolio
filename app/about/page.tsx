import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Aarsh Mishra | Software Developer',
  description: 'Learn more about Aarsh Mishra, a software developer specializing in web development and engineering.',
  keywords: ['Aarsh Mishra', 'about', 'software developer', 'biography', 'experience']
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">About Aarsh Mishra</h1>
      
      <div className="prose max-w-none">
        <p className="text-xl mb-6">
          I'm Aarsh Mishra, a software developer with expertise in web development and engineering.
        </p>
        
        {/* Add more detailed content about yourself */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Background</h2>
        <p>
          With X years of experience in software development, I've worked on projects ranging from...
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Skills & Expertise</h2>
        <p>
          My technical skills include JavaScript, TypeScript, React, Next.js, and more...
        </p>
        
        {/* Add more sections as needed */}
      </div>
    </div>
  )
}