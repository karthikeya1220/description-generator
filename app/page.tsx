import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background text-foreground'>
      Go to <Link href="/dashboard" className='text-blue-500'>Product Description Generator</Link>
    </div>
  )
}
