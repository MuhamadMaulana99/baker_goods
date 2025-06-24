import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Baker Goods',
  description: 'Fe Baker Goods',
  generator: 'Baker',
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
