import { Suspense } from 'react'
import { SearchClient } from './search-client'
import { SearchFallback } from './search-fallback'

export function SearchComponent() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  )
}