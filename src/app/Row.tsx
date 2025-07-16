// File: src/app/Row.tsx
// Commit: Render and edit single Supabase row with no abstraction or prop typing

'use client'

import { useState } from 'react'
import Editor from './Editor'

export default function Row({ data }: { data: any }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="border-b py-3 px-4 flex justify-between items-center hover:bg-gray-50">
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{data.name}</span>
        <span className="text-sm text-gray-600">BN: {data.bn}</span>
        <span className="text-sm text-gray-600">Manager: {data.manager_name}</span>
        <span className="text-sm text-gray-600">Email: {data.manager_email}</span>
      </div>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
