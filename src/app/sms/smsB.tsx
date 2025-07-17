'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function SmsB({ phone }: { phone: string }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = useSupabaseClient()

  const handleVerify = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')

      // Login to Supabase as admin
      const login = await supabase.auth.signInWithPassword({
        email: 'dariusgillingham2@gmail.com',
        password: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_PASSWORD!,
      })

      if (login.error) throw login.error

      // Redirect to home
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-black dark:text-white">
        Enter the 6-digit code
      </h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="123456"
        maxLength={6}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
