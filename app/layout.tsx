// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Theo Dõi Biến Động Vĩ Mô — Tập đoàn FPT',
  description: 'Macro Weekly Dashboard — High-Signal Clarity System. Theo dõi và phân tích biến động vĩ mô ảnh hưởng đến Tập đoàn FPT.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body-md bg-background text-on-surface min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
