// File: src/app/Creator.tsx
// Commit: Create row directly in Companies table with raw Supabase insert

'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Creator() {
  // Use supabase directly, no hook needed

  const [name, setName] = useState('')
  const [bn, setBn] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerEmail, setManagerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from('Companies').insert([
      {
        name,
        business_number: bn,
        manager_name: managerName,
        manager_email: managerEmail,
      },
    ])

    setLoading(false)

    if (error) {
      setMessage('Failed to create entry.')
      console.error(error)
    } else {
      setMessage('Entry created successfully.')
      setName('')
      setBn('')
      setManagerName('')
      setManagerEmail('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Business Number</label>
        <input
          type="text"
          value={bn}
          onChange={(e) => setBn(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Manager Name</label>
        <input
          type="text"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Manager Email</label>
        <input
          type="email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}
