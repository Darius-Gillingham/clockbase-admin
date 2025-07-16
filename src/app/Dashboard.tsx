// File: src/app/Dashboard.tsx
// Commit: Display and fetch rows directly from Companies table, removing typed abstraction

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  // Use the imported supabase instance directly
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRows = async () => {
      const { data, error } = await supabase
        .from('Companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load entries.')
      } else {
        setRows(data)
      }
      setLoading(false)
    }

    fetchRows()
  }, [])

  return (
    <div className="w-full max-w-3xl p-6 bg-white dark:bg-neutral-900 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {loading && <p className="text-sm text-gray-600">Loading rows...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {rows.length === 0 && !loading && (
        <p className="text-sm text-gray-500">No entries registered yet.</p>
      )}

      {rows.length > 0 && (
        <table className="w-full text-sm border-t mt-4">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Business Number</th>
              <th className="py-2 pr-4">Manager Email</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="py-2 pr-4">{row.name}</td>
                <td className="py-2 pr-4">{row.business_number}</td>
                <td className="py-2 pr-4">{row.manager_email}</td>
                <td className="py-2">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
