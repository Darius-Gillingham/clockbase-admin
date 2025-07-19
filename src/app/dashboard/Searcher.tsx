// File: src/app/Searcher.tsx
// Commit: Update search results to match full company schema and renamed field structure

'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Searcher() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('company_name', `%${query}%`)

    setLoading(false)

    if (error) {
      setError('Failed to fetch companies')
      console.error(error)
      return
    }

    setResults(data || [])
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Search Companies</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company name"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((company) => (
            <li key={company.id} className="border rounded p-2 text-sm">
              <p><strong>Name:</strong> {company.company_name}</p>
              <p><strong>BN:</strong> {company.business_number}</p>
              <p><strong>Manager:</strong> {company.manager_name}</p>
              <p><strong>Email:</strong> {company.manager_email}</p>
              <p><strong>Phone:</strong> {company.manager_phone}</p>
              <p><strong>Reg Code:</strong> {company.employee_reg_code}</p>
              <p><strong>Tier:</strong> {company.subscription_tier}</p>
              <p><strong>Start:</strong> {company.subscription_start || '—'}</p>
              <p><strong>End:</strong> {company.subscription_end || '—'}</p>
              <p><strong>Renew:</strong> {company.auto_renew ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
