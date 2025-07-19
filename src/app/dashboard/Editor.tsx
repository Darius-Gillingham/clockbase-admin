'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Editor() {
  const [companies, setCompanies] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, any>>({})

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
    const convert = (s: string) =>
      s && /^\d{4}-\d{2}-\d{2}$/.test(s)
        ? `${s.slice(5, 7)}-${s.slice(0, 4)}`
        : ''
    setEditFields({
      ...company,
      subscription_start: convert(company.subscription_start),
      subscription_end: convert(company.subscription_end),
    })
  }

  const saveEdit = async () => {
    if (!editingId) return

    const revert = (s: string) =>
      /^\d{2}-\d{4}$/.test(s) ? `${s.slice(3, 7)}-${s.slice(0, 2)}-01` : null

    const updated = {
      ...editFields,
      subscription_start: editFields.subscription_start
        ? revert(editFields.subscription_start)
        : null,
      subscription_end: editFields.subscription_end
        ? revert(editFields.subscription_end)
        : null,
    }

    const { error } = await supabase
      .from('companies')
      .update(updated)
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

  const onChange = (field: string, value: any) => {
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
                value={editFields.company_name}
                onChange={(e) => onChange('company_name', e.target.value)}
                placeholder="Company Name"
                className="border p-1 w-full"
              />
              <input
                value={editFields.business_number}
                onChange={(e) => onChange('business_number', e.target.value)}
                placeholder="Business Number"
                className="border p-1 w-full"
              />
              <input
                value={editFields.manager_name}
                onChange={(e) => onChange('manager_name', e.target.value)}
                placeholder="Manager Name"
                className="border p-1 w-full"
              />
              <input
                value={editFields.manager_email}
                onChange={(e) => onChange('manager_email', e.target.value)}
                placeholder="Manager Email"
                className="border p-1 w-full"
              />
              <input
                value={editFields.manager_phone}
                onChange={(e) => onChange('manager_phone', e.target.value)}
                placeholder="Manager Phone"
                className="border p-1 w-full"
              />
              <input
                value={editFields.employee_reg_code}
                onChange={(e) => onChange('employee_reg_code', e.target.value)}
                placeholder="Employee Registration Code"
                pattern="[a-fA-F0-9]{8}"
                className="border p-1 w-full"
              />
              <input
                value={editFields.subscription_tier}
                onChange={(e) => onChange('subscription_tier', e.target.value)}
                placeholder="Subscription Tier"
                className="border p-1 w-full"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM-YYYY"
                pattern="^\d{2}-\d{4}$"
                value={editFields.subscription_start}
                onChange={(e) => onChange('subscription_start', e.target.value)}
                className="border p-1 w-full"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM-YYYY"
                pattern="^\d{2}-\d{4}$"
                value={editFields.subscription_end}
                onChange={(e) => onChange('subscription_end', e.target.value)}
                className="border p-1 w-full"
              />
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={editFields.auto_renew}
                  onChange={(e) => onChange('auto_renew', e.target.checked)}
                />
                Auto Renew
              </label>

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
              <p><strong>Name:</strong> {company.company_name}</p>
              <p><strong>BN:</strong> {company.business_number}</p>
              <p><strong>Manager:</strong> {company.manager_name}</p>
              <p><strong>Email:</strong> {company.manager_email}</p>
              <p><strong>Phone:</strong> {company.manager_phone}</p>
              <p><strong>Reg Code:</strong> {company.employee_reg_code}</p>
              <p><strong>Tier:</strong> {company.subscription_tier}</p>
              <p><strong>Start:</strong> {company.subscription_start}</p>
              <p><strong>End:</strong> {company.subscription_end}</p>
              <p><strong>Renew:</strong> {company.auto_renew ? 'Yes' : 'No'}</p>
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
