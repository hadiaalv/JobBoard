import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'JobBoard',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
