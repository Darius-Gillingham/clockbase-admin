// File: src/app/Dashboard.tsx
// Commit: Display all company fields from new schema including subscription and contact info

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRows = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load entries.')
      } else {
        setRows(data)
      }
      setLoading(false)
    }

    fetchRows()
  }, [])

  return (
    <div className="w-full max-w-6xl p-6 bg-white dark:bg-neutral-900 rounded shadow mt-8 overflow-x-auto">
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
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">BN</th>
              <th className="py-2 pr-4">Manager</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Reg Code</th>
              <th className="py-2 pr-4">Tier</th>
              <th className="py-2 pr-4">Start</th>
              <th className="py-2 pr-4">End</th>
              <th className="py-2">Renew</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="py-2 pr-4">{row.company_name}</td>
                <td className="py-2 pr-4">{row.business_number}</td>
                <td className="py-2 pr-4">{row.manager_name}</td>
                <td className="py-2 pr-4">{row.manager_email}</td>
                <td className="py-2 pr-4">{row.manager_phone}</td>
                <td className="py-2 pr-4">{row.employee_reg_code}</td>
                <td className="py-2 pr-4">{row.subscription_tier}</td>
                <td className="py-2 pr-4">
                  {row.subscription_start
                    ? new Date(row.subscription_start).toLocaleDateString()
                    : '—'}
                </td>
                <td className="py-2 pr-4">
                  {row.subscription_end
                    ? new Date(row.subscription_end).toLocaleDateString()
                    : '—'}
                </td>
                <td className="py-2">{row.auto_renew ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
