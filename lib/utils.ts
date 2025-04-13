import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Calculate reading time for a given text
 * @param text The content to calculate reading time for
 * @param wordsPerMinute Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes as a string (e.g., "5 min read")
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): string {
  // Remove HTML tags if present
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Count words by splitting on whitespace
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  
  // Calculate reading time in minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
}

