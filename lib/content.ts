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
import { calculateReadingTime } from './utils';

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

  const contentHtml = processedContent.toString()
  
  // Calculate reading time
  const readingTime = calculateReadingTime(content)

  // Return the combined data
  return {
    contentHtml,
    readingTime,
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
      
      // Calculate reading time
      const readingTime = calculateReadingTime(matterResult.content);

      // Combine the data with the id
      return {
        id,
        contentHtml,
        readingTime,
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

// Function to get experiences with proper sorting
export async function getExperiences(directory = 'experience') {
  const experiences = await getAllContentData(directory);
  
  // Month name to number mapping (all lowercase for consistent comparison)
  const monthToNum = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11
  };
  
  // Helper function to parse date from period string
  const parseDate = (periodStr, getEnd = false) => {
    if (!periodStr) return new Date(0);
    
    const parts = periodStr.split(' - ');
    const datePart = getEnd ? parts[1] || '' : parts[0] || '';
    
    // If we're looking for end date and it's "Present"
    if (getEnd && datePart.toLowerCase().includes('present')) {
      return new Date(9999, 11, 31); // Far future date for "Present"
    }
    
    // Extract month and year
    const monthYearRegex = /([a-z]{3,})\s+(\d{4})/i;
    const match = datePart.match(monthYearRegex);
    
    if (match) {
      const monthName = match[1].toLowerCase();
      const year = parseInt(match[2]);
      
      // Get month number from our mapping
      const monthNum = monthToNum[monthName];
      
      if (monthNum !== undefined && !isNaN(year)) {
        return new Date(year, monthNum, 1);
      }
    }
    
    // Fallback to just year
    const yearMatch = datePart.match(/\d{4}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      return new Date(year, 0, 1);
    }
    
    // Default fallback
    return new Date(0);
  };
  
  // Sort experiences by start date (most recent first)
  return experiences.sort((a, b) => {
    // If order is specified for both, use it
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    // If only one has order, prioritize it
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    
    // Parse start dates
    const aStartDate = parseDate(a.period, false);
    const bStartDate = parseDate(b.period, false);
    
    // Most recent start date first (descending order)
    return bStartDate.getTime() - aStartDate.getTime();
  });
}

// Function specifically for gaming experiences
export async function getGamingExperiences() {
  return getExperiences('gaming-experience');
}

// Add this function for debugging
export async function debugExperienceSorting(directory = 'gaming-experience') {
  const experiences = await getAllContentData(directory);
  
  // Log each experience with its period and parsed dates
  experiences.forEach(exp => {
    console.log(`Experience: ${exp.title}`);
    console.log(`  Period: ${exp.period}`);
    
    // Parse dates
    const parts = exp.period.split(' - ');
    const startPart = parts[0] || '';
    const endPart = parts[1] || '';
    
    console.log(`  Start part: "${startPart}"`);
    console.log(`  End part: "${endPart}"`);
    
    // Check if it contains "Present"
    console.log(`  Contains "Present": ${exp.period.includes('Present')}`);
    
    console.log('---');
  });
  
  return experiences;
}

// // Update the existing getAllExperienceData function
export async function getAllExperienceData() {
  const directory = "experience";
  const experienceData = await getAllContentData(directory);
  
  // Sort by order field (lowest first) or by date (most recent first)
  return experienceData.sort((a, b) => {
    // If order is specified, use it
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    // Otherwise sort by date (most recent first)
    const dateA = new Date(a.period?.split(' - ')[0] || 0);
    const dateB = new Date(b.period?.split(' - ')[0] || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

// //Add this function if it doesn't exist
// export async function getAllExperienceData() {
//   const directory = "experience";
//   const experienceData = await getAllContentData(directory);
  
//   // Sort by order field (lowest first) or by date (most recent first)
//   return experienceData.sort((a, b) => {
//     // If order is specified, use it
//     if (a.order !== undefined && b.order !== undefined) {
//       return a.order - b.order;
//     }
    
//     // Otherwise sort by date (most recent first)
//     const dateA = new Date(a.period?.split(' - ')[0] || 0);
//     const dateB = new Date(b.period?.split(' - ')[0] || 0);
//     return dateB.getTime() - dateA.getTime();
//   });
// }





















