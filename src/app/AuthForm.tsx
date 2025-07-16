'use client'

import { useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AuthForm() {
  const supabase = useSupabaseClient()

  useEffect(() => {
    const runLogin = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${location.origin}/`,
        },
      })
    }
    runLogin()
  }, [supabase])

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <p className="text-lg font-semibold text-black dark:text-white">
        Redirecting to Microsoft login...
      </p>
    </div>
  )
}
