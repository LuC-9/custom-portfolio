import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export function Profile() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 py-8">
      <div className="w-48 h-48 relative rounded-full overflow-hidden border-4 border-primary/20">
        <Image 
          src="/profile.jpg?v=1" 
          alt="Developer profile picture" 
          fill 
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, 192px"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-2">Abhishek Kumar</h1>
        <p className="text-xl text-muted-foreground mb-4">Full Stack Developer & Tech Enthusiast</p>
        <p className="mb-6 max-w-2xl">
          Passionate about building elegant solutions to complex problems. I specialize in modern web technologies
          and love creating intuitive, high-performance applications.
        </p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <FaGithub className="mr-2" /> GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="mr-2" /> LinkedIn
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="mr-2" /> Twitter
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:your.email@example.com">
              <MdEmail className="mr-2" /> Email
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
