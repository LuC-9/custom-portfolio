import { FolderGit2 } from "lucide-react"

export function ProjectsSectionHeading({ title = "Selected Projects" }: { title?: string }) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <FolderGit2 className="h-3.5 w-3.5 text-primary" />
        Projects
      </div>
      <h1 className="font-sans text-4xl font-extrabold tracking-tighter md:text-6xl">{title}</h1>
    </div>
  )
}