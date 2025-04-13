'use client'

import { Suspense } from 'react'
import { SearchComponentInner } from './search-component-inner'

export function SearchClientWrapper() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mb-6 text-center py-2">Loading search...</div>}>
      <SearchComponentInner />
    </Suspense>
  )
}