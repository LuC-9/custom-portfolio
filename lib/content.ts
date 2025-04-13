import fs from "fs"  // Keep standard fs for sync methods
import { readFile, readdir } from "fs/promises"  // Import async methods from fs/promises
import path from "path"
import matter from "gray-matter"
import remarkGfm from "remark-gfm"
import rehypePrism from "rehype-prism-plus"
import rehypeSlug from "rehype-slug"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeRaw from "rehype-raw"
import { visit } from "unist-util-visit"

const contentDirectory = path.join(process.cwd(), "content")

// Function to read a markdown file and parse its metadata and content
export async function getContentData(directory: string, fileName: string) {
  const fullPath = path.join(contentDirectory, directory, fileName)
  const fileContents = await readFile(fullPath, "utf8")

  // Parse the frontmatter
  const { data, content } = matter(fileContents)

  // Process markdown content with enhanced features
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown for tables, etc.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypePrism) // Syntax highlighting
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  // Just return the processed content without Mermaid handling
  const contentHtml = processedContent.toString();

  // Return the combined data
  return {
    id: fileName.replace(/\.md$/, ""),
    contentHtml,
    ...data,
  }
}

// Function to get all content files from a directory
export async function getAllContentData(directory: string) {
  const contentPath = path.join(contentDirectory, directory)
  
  // Check if directory exists
  if (!fs.existsSync(contentPath)) {
    return []
  }
  
  const filenames = await readdir(contentPath)
  
  const allContentData = await Promise.all(
    filenames.map(async (filename) => {
      // Skip non-markdown files
      if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) {
        return null
      }
      
      const id = filename.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(contentDirectory, directory, filename);
      const fileContents = await readFile(fullPath, 'utf8');
      
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      
      // Process markdown content to HTML
      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypePrism)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(matterResult.content);
      
      // Just return the processed content without Mermaid handling
      const contentHtml = processedContent.toString();

      // Combine the data with the id
      return {
        id,
        contentHtml,
        ...matterResult.data,
      }
    })
  )
  
  // Filter out null values and sort by date if available, or by order if it's projects
  return allContentData
    .filter(Boolean)
    .sort((a, b) => {
      // First sort by order if it exists (for projects)
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      
      // Then sort by date if available (for blog posts)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      
      // Default to title sort if neither order nor date is available
      if (a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
      
      return 0
    })
}

// Function to get a specific content item
export async function getContentItem(contentType: string, id: string) {
  const fullPath = path.join(contentDirectory, contentType, `${id}.md`)

  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    return null
  }

  return await getContentData(contentType, `${id}.md`)
}

// Function to get all content types
export function getAllContentTypes() {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }
  return fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

// Add or modify the sorting function for experiences
export async function getExperiences() {
  const experiences = await getAllContentData('experience');
  
  // Sort experiences by date, most recent first
  return experiences.sort((a, b) => {
    // Extract years from period strings
    const aYears = a.period.match(/\d{4}/g) || [];
    const bYears = b.period.match(/\d{4}/g) || [];
    
    // Get the end year (or present)
    const aEndYear = a.period.includes('Present') ? 
      new Date().getFullYear() + 1 : // Add 1 to ensure "Present" is always most recent
      parseInt(aYears[aYears.length - 1]);
    
    const bEndYear = b.period.includes('Present') ? 
      new Date().getFullYear() + 1 : 
      parseInt(bYears[bYears.length - 1]);
    
    // Sort by end year (descending)
    if (aEndYear !== bEndYear) {
      return bEndYear - aEndYear;
    }
    
    // If end years are the same, sort by start year (descending)
    const aStartYear = parseInt(aYears[0]);
    const bStartYear = parseInt(bYears[0]);
    return bStartYear - aStartYear;
  });
}

// Add this function for debugging
export async function debugExperienceSorting() {
  const fileNames = fs.readdirSync(path.join(contentDirectory, "experience"))
  const experiences = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const contentData = await getContentData("experience", fileName)
      return {
        id,
        ...contentData,
      }
    })
  )

  // Log each experience with its period and extracted years
  experiences.forEach(exp => {
    const years = exp.period.match(/\d{4}/g) || [];
    const endYear = exp.period.includes('Present') ? 
      new Date().getFullYear() + 1 : 
      parseInt(years[years.length - 1]);
    
    console.log(`Experience: ${exp.title} at ${exp.company}`);
    console.log(`  Period: ${exp.period}`);
    console.log(`  Extracted years: ${years.join(', ')}`);
    console.log(`  End year for sorting: ${endYear}`);
    console.log('---');
  });

  // Return sorted experiences
  return experiences.sort((a, b) => {
    const aYears = a.period.match(/\d{4}/g) || [];
    const bYears = b.period.match(/\d{4}/g) || [];
    
    const aEndYear = a.period.includes('Present') ? 
      new Date().getFullYear() + 1 : 
      parseInt(aYears[aYears.length - 1]);
    
    const bEndYear = b.period.includes('Present') ? 
      new Date().getFullYear() + 1 : 
      parseInt(bYears[bYears.length - 1]);
    
    if (aEndYear !== bEndYear) {
      return bEndYear - aEndYear;
    }
    
    const aStartYear = parseInt(aYears[0]);
    const bStartYear = parseInt(bYears[0]);
    return bStartYear - aStartYear;
  });
}





















