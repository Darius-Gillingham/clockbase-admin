'use client'

import './globals.css'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Merriweather } from 'next/font/google'

const merriw = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-serif',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <html lang="en" className={merriw.className}>
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}
