'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function SearchComponentInner() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    // Get the search query from URL if it exists
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
    }
  }, [searchParams])
  
  return (
    <div className="w-full max-w-md mb-6">
      <p className="text-sm text-muted-foreground mb-2">
        Try searching for what you were looking for:
      </p>
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90"
          onClick={() => {
            // Handle search logic here
            console.log('Searching for:', query)
          }}
        >
          Search
        </button>
      </div>
    </div>
  )
}