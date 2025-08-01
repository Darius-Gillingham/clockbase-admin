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
  const [tab, setTab] = useState<'dashboard' | 'editor'>('dashboard')
  const [editingCompany, setEditingCompany] = useState<any | null>(null)

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
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab('dashboard')}
          className={`px-4 py-2 rounded font-medium border ${
            tab === 'dashboard'
              ? 'bg-green-600 text-white border-green-700'
              : 'bg-gray-800 text-white border-green-600 hover:bg-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab('editor')}
          className={`px-4 py-2 rounded font-medium border ${
            tab === 'editor'
              ? 'bg-green-600 text-white border-green-700'
              : 'bg-gray-800 text-white border-green-600 hover:bg-gray-700'
          }`}
        >
          Editor
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="space-y-10">
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
            <h2 className="text-xl font-semibold mb-4">Search Companies</h2>
            <Searcher
              onSelect={(company: any) => {
                setEditingCompany(company)
                setTab('editor')
              }}
            />
          </div>
        </div>
      )}

      {tab === 'editor' && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Company</h2>
          <Creator />
        </div>
      )}
    </div>
  )
}
