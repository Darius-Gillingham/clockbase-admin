'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CompanySearch() {
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
      .ilike('name', `%${query}%`)

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
            <li key={company.id} className="border rounded p-2">
              <p><strong>Name:</strong> {company.name}</p>
              <p><strong>BN:</strong> {company.bn}</p>
              <p><strong>Manager:</strong> {company.manager_name} ({company.manager_email})</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
