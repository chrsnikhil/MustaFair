import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '../components/providers'

export const metadata: Metadata = {
  title: 'Mustafair',
  description: 'A Decentralized Social Media Platform',
  generator: 'Chris And Aditya',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
