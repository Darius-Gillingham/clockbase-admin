// File: src/app/dashboard/page.tsx
// Commit: Combine Creator, Searcher, and Row display into interactive dashboard panel

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Creator from './Creator'
import Searcher from './Searcher'
import Row from './Row'

export default function DashboardPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load entries.')
      } else {
        setRows(data || [])
      }
      setLoading(false)
    }

    fetchRows()
  }, [refresh])

  const triggerRefresh = () => setRefresh((r) => r + 1)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
        {loading && <p className="text-sm text-gray-600">Loading rows...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && rows.length === 0 && (
          <p className="text-sm text-gray-500">No entries registered yet.</p>
        )}
        <div className="divide-y">
          {rows.map((row) => (
            <Row key={row.id} data={row} />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Company</h2>
        <Creator />
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Search Companies</h2>
        <Searcher />
      </div>
    </div>
  )
}
