import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import ReactQueryProvider from '../components/react-query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Balanced Score Card',
  description: 'Generating a BSC for the staffs of the whole country.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
       <ThemeProvider enableSystem defaultTheme='system' attribute='class' enableColorScheme >
         <ReactQueryProvider>
          {children}
          <Toaster/>
        </ReactQueryProvider>
       </ThemeProvider>
      </body>
    </html>
  )
}
