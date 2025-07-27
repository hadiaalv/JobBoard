import type { Metadata } from 'next'
// import localFont from 'next/font/local'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navigation } from '@/components/navigation';

// Commented out broken local font usage
// const geistSans = localFont({
//   src: './fonts/GeistVF.woff2',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// })

// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff2',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// })

export const metadata: Metadata = {
  title: 'Your App',
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
