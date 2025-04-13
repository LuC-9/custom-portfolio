// Find the "View All Streams" button and add the hover-animation-primary class
<Button 
  variant="outline" 
  className="mt-4 hover-animation-primary"
  asChild
>
  <Link href="/streams">
    <Eye className="mr-2 h-4 w-4" />
    View All Streams
  </Link>
</Button>