// File: src/app/dashboard/Searcher.tsx
// Commit: Add onSelect callback to pass selected company to parent editor

'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Searcher({
  onSelect,
}: {
  onSelect: (company: any) => void
}) {
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
    <div className="space-y-4">
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
            <li
              key={company.id}
              className="border rounded p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(company)}
            >
              <p><strong>{company.company_name}</strong></p>
              <p className="text-sm text-gray-600">
                {company.manager_name} • {company.manager_email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
