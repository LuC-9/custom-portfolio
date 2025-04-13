import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        href="/" 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mt-6"
      >
        Return Home
      </Link>
    </div>
  )
}


