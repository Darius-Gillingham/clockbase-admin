// File: src/app/page.tsx
// Commit: Replace legacy Dashboard import with routed dashboard page redirect

'use client'

import { useSessionContext } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import AuthForm from './AuthForm'
import { useRouter } from 'next/navigation'

export default function AdminHomePage() {
  const { session, isLoading } = useSessionContext()
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) setReady(true)
  }, [isLoading])

  useEffect(() => {
    if (ready && session) {
      router.push('/dashboard')
    }
  }, [ready, session, router])

  if (!ready) return <div className="p-4 text-gray-600">Loading...</div>

  if (!session) {
    return <AuthForm />
  }

  return null
}
