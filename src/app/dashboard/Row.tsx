// File: src/app/Row.tsx
// Commit: Update Row component to reflect full company schema fields

'use client'

import { useState } from 'react'
import Editor from './Editor'

export default function Row({ data }: { data: any }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="border-b py-3 px-4 flex justify-between items-start hover:bg-gray-50">
      <div className="flex flex-col text-sm">
        <span className="font-semibold text-base">{data.company_name}</span>
        <span className="text-gray-600">BN: {data.business_number}</span>
        <span className="text-gray-600">Manager: {data.manager_name}</span>
        <span className="text-gray-600">Email: {data.manager_email}</span>
        <span className="text-gray-600">Phone: {data.manager_phone}</span>
        <span className="text-gray-600">Reg Code: {data.employee_reg_code}</span>
        <span className="text-gray-600">Tier: {data.subscription_tier}</span>
        <span className="text-gray-600">
          Start: {data.subscription_start || '—'}
        </span>
        <span className="text-gray-600">
          End: {data.subscription_end || '—'}
        </span>
        <span className="text-gray-600">
          Auto Renew: {data.auto_renew ? 'Yes' : 'No'}
        </span>
      </div>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-1"
        onClick={() => setEditing(true)}
      >
        Edit
      </button>

      {editing && (
        // @ts-ignore: bypassing type enforcement for raw row interaction
        <Editor data={data} onClose={() => setEditing(false)} />
      )}
    </div>
  )
}
