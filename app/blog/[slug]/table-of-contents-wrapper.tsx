"use client"

import { TableOfContents } from "@/components/table-of-contents"

export function TableOfContentsWrapper({ content }: { content: string }) {
  return <TableOfContents content={content} />
}
