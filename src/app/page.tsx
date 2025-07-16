'use client'

import { useSessionContext } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import AuthForm from './AuthForm'
import Dashboard from './Dashboard'

export default function AdminHomePage() {
  const { session, isLoading } = useSessionContext()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoading) setReady(true)
  }, [isLoading])

  if (!ready) return <div className="p-4 text-gray-600">Loading...</div>

  if (!session) {
    return <AuthForm />
  }

  return <Dashboard />
}
