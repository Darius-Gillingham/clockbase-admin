// File: src/app/sms/smsA.tsx
// Commit: Phone input form that sends a 6-digit verification code via Twilio

'use client'

import { useState } from 'react'

export default function SmsA({
  onSuccess,
}: {
  onSuccess: (phone: string) => void
}) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCode = async () => {
    setLoading(true)
    setError(null)

    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send code')

      onSuccess(formattedPhone)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-black dark:text-white">Verify your phone</h2>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSendCode}
        disabled={loading}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Code'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
