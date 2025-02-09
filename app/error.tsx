'use client'
 
import { useEffect } from 'react'
import Heading from './_components/atoms/Heading'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])
 
  return (
    <section className='flex flex-col gap-2 items-center justify-center'>
      <Heading tag='h3'>Something went wrong!</Heading>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </section>
  )
}