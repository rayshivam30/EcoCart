import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoCart',
  description: 'An AI-powered platform that helps retailers and customers reduce delivery emissions and packaging waste.'
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
