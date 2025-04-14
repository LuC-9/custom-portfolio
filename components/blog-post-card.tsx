import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"

export function BlogPostCard({ post }) {
  return (
    <Card key={post.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 relative h-full">
      <Link href={`/blog/${post.id}`} className="group h-full flex flex-col">
        {post.image && (
          <div className="relative aspect-video bg-muted overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="flex-grow p-4 md:p-6">
          <div className="mb-2 flex flex-wrap gap-2">
            {post.tags && post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readingTime || "5 min read"}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
