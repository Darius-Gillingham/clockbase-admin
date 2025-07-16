'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [companyName, setCompanyName] = useState('')
  const [bn, setBn] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerEmail, setManagerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    if (!companyName || !/^\d{9}$/.test(bn) || !managerName || !managerEmail) {
      setError('All fields are required and BN must be 9 digits.')
      return
    }

    setLoading(true)

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({ name: companyName, bn })
      .select()
      .single()

    if (companyError || !company) {
      setError(companyError?.message ?? 'Failed to create company.')
      setLoading(false)
      return
    }

    const { error: userError } = await supabase.from('users').insert({
      email: managerEmail,
      name: managerName,
      company_id: company.id,
      role: 'head_manager',
    })

    if (userError) {
      setError(userError.message)
      setLoading(false)
      return
    }

    setCompanyName('')
    setBn('')
    setManagerName('')
    setManagerEmail('')
    setSuccess(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8 space-y-6">
      <h1 className="text-2xl font-bold">Add New Company (Admin)</h1>

      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Business Number (9-digit BN)"
          value={bn}
          onChange={(e) => setBn(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Manager Name"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Manager Email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Create Company + Manager'}
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Company and manager added successfully.</p>}
      </div>
    </main>
  )
}
