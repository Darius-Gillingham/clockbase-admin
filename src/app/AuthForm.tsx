// File: src/app/sms/AuthForm.tsx
// Commit: Require both hardcoded email and PIN to proceed to /sms

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isEmailValid = email.trim().toLowerCase() === 'dariusgillingham2@gmail.com'
    const isPinValid = pin === '831771'

    if (isEmailValid && isPinValid) {
      router.push('/sms')
    } else {
      setError('Access denied: invalid credentials.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow"
      >
        <h1 className="text-xl font-semibold text-center text-black dark:text-white">
          Private Access
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="6-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
