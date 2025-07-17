// File: src/app/sms/smsB.tsx
// Commit: Code input form to verify SMS code and complete verification

'use client'

import { useState } from 'react'

export default function SmsB({ phone }: { phone: string }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

      if (!res.ok) throw new Error(data.error || 'Invalid code')

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center text-green-600 font-semibold">
        ✅ Phone verified successfully
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-black dark:text-white">Enter the code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        maxLength={6}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
