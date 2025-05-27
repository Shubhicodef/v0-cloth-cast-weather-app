import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClothCast',
  description: 'What to wear today',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
