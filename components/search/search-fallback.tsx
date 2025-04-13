export function SearchFallback() {
  return (
    <div className="w-full max-w-md mb-6">
      <p className="text-sm text-muted-foreground mb-2">
        Loading search...
      </p>
      <div className="flex">
        <div className="flex-1 h-10 bg-gray-200 rounded-l-md animate-pulse"></div>
        <div className="w-20 h-10 bg-gray-300 rounded-r-md animate-pulse"></div>
      </div>
    </div>
  )
}