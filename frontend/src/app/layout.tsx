import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'JobBoard',
  description: 'Find Jobs, Post Jobs, and Manage Applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var initialTheme = theme || systemTheme;
                  document.documentElement.classList.add(initialTheme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground transition-colors duration-200">
        <Providers>
          <Navigation />
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
