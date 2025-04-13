import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"

export function BlogPostCard({ post }) {
  return (
    <Card key={post.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 relative">
      <Link href={`/blog/${post.id}`} className="group">
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
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags && post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}