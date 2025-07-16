'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CompanyEditor() {
  const [companies, setCompanies] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from('companies').select('*')
      if (error) {
        console.error('Error loading companies:', error)
        return
      }
      setCompanies(data || [])
    }

    fetchCompanies()
  }, [])

  const startEdit = (company: any) => {
    setEditingId(company.id)
    setEditFields({
      name: company.name || '',
      bn: company.bn || '',
      manager_email: company.manager_email || '',
      manager_name: company.manager_name || '',
    })
  }

  const saveEdit = async () => {
    if (!editingId) return

    const { error } = await supabase
      .from('companies')
      .update(editFields)
      .eq('id', editingId)

    if (error) {
      console.error('Update failed:', error)
      return
    }

    setEditingId(null)
    location.reload()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFields({})
  }

  const onChange = (field: string, value: string) => {
    setEditFields(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Company Editor</h2>

      {companies.map((company) => (
        <div
          key={company.id}
          className="p-4 border border-gray-400 rounded shadow-sm space-y-2"
        >
          {editingId === company.id ? (
            <div className="space-y-2">
              <input
                value={editFields.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Company Name"
                className="border p-1 w-full"
              />
              <input
                value={editFields.bn}
                onChange={(e) => onChange('bn', e.target.value)}
                placeholder="Business Number"
                className="border p-1 w-full"
              />
              <input
                value={editFields.manager_email}
                onChange={(e) => onChange('manager_email', e.target.value)}
                placeholder="Manager Email"
                className="border p-1 w-full"
              />
              <input
                value={editFields.manager_name}
                onChange={(e) => onChange('manager_name', e.target.value)}
                placeholder="Manager Name"
                className="border p-1 w-full"
              />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Save
                </button>
                <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {company.name}</p>
              <p><strong>BN:</strong> {company.bn}</p>
              <p><strong>Manager Email:</strong> {company.manager_email}</p>
              <p><strong>Manager Name:</strong> {company.manager_name}</p>
              <button onClick={() => startEdit(company)} className="text-blue-600 underline mt-2">
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
