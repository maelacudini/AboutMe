import Link from 'next/link'
import Main from './_components/layouts/Main'
import Heading from './_components/atoms/Heading'
 
export default function NotFound() {
  return (
    <Main>
      <div className="h-lvh flex flex-col items-center justify-center gap-2">
        <Heading tag='h1' size='text-4xl'>Uh-oh...</Heading>
        <p>Page Not Found</p>
        <Link
          className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2'
          href="/"
        >
            Return Home
        </Link>
      </div>
    </Main>
  )
}