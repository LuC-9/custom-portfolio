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

const contentDirectory = path.join(process.cwd(), "content")

// Function to get all markdown files from a directory
export function getFilesFromDirectory(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }
  const fileNames = fs.readdirSync(directory)
  return fileNames.filter((fileName) => fileName.endsWith(".md"))
}

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

  const contentHtml = processedContent.toString()

  return {
    id: fileName.replace(/\.md$/, ""),
    ...data,
    content: contentHtml,
  }
}

// Function to get all content data from a specific content type
export async function getAllContentData(type: string) {
  const directory = path.join(process.cwd(), 'content', type);
  const filenames = await readdir(directory);
  
  const allContentData = await Promise.all(
    filenames.map(async (filename) => {
      const id = filename.replace(/\.md$/, '');
      const fullPath = path.join(directory, filename);
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

      const contentHtml = processedContent.toString();
      
      // Ensure featured is a boolean
      const featured = matterResult.data.featured === true;
      
      // Return the data with the id, explicitly set featured property, and HTML content
      return {
        id,
        featured,
        ...matterResult.data,
        content: contentHtml,
      };
    })
  );
  
  return allContentData;
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





















