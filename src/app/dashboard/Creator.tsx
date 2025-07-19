'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function generateHexCode() {
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, '0')
}

export default function Creator() {
  const [companyName, setCompanyName] = useState('')
  const [businessNumber, setBusinessNumber] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerEmail, setManagerEmail] = useState('')
  const [managerPhone, setManagerPhone] = useState('')
  const [employeeRegCode, setEmployeeRegCode] = useState(generateHexCode())
  const [subscriptionTier, setSubscriptionTier] = useState('')
  const [subscriptionStart, setSubscriptionStart] = useState('')
  const [subscriptionEnd, setSubscriptionEnd] = useState('')
  const [autoRenew, setAutoRenew] = useState(true)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const parseDate = (input: string): string | null => {
    const match = input.match(/^(\d{2})-(\d{4})$/)
    if (!match) return null
    const [, mm, yyyy] = match
    return `${yyyy}-${mm}-01`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const parsedStart = subscriptionStart ? parseDate(subscriptionStart) : null
    const parsedEnd = subscriptionEnd ? parseDate(subscriptionEnd) : null

    const validStart = !subscriptionStart || parsedStart
    const validEnd = !subscriptionEnd || parsedEnd

    if (!validStart || !validEnd) {
      setMessage('Please enter subscription dates in MM-YYYY format.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('companies').insert([
      {
        company_name: companyName,
        business_number: businessNumber,
        manager_name: managerName,
        manager_email: managerEmail,
        manager_phone: managerPhone,
        employee_reg_code: employeeRegCode,
        subscription_tier: subscriptionTier,
        subscription_start: parsedStart,
        subscription_end: parsedEnd,
        auto_renew: autoRenew,
      },
    ])

    setLoading(false)

    if (error) {
      console.error(error)
      setMessage('Failed to create entry.')
    } else {
      setMessage('Entry created successfully.')
      setCompanyName('')
      setBusinessNumber('')
      setManagerName('')
      setManagerEmail('')
      setManagerPhone('')
      setEmployeeRegCode(generateHexCode())
      setSubscriptionTier('')
      setSubscriptionStart('')
      setSubscriptionEnd('')
      setAutoRenew(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Business Number</label>
        <input
          type="text"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Manager Name</label>
        <input
          type="text"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Manager Email</label>
        <input
          type="email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Manager Phone</label>
        <input
          type="text"
          value={managerPhone}
          onChange={(e) => setManagerPhone(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Employee Registration Code</label>
        <input
          type="text"
          value={employeeRegCode}
          onChange={(e) => setEmployeeRegCode(e.target.value)}
          className="border px-2 py-1 w-full"
          pattern="[a-fA-F0-9]{8}"
          title="8-digit hexadecimal code"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Subscription Tier</label>
        <input
          type="text"
          value={subscriptionTier}
          onChange={(e) => setSubscriptionTier(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Subscription Start (MM-YYYY)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="^\d{2}-\d{4}$"
          placeholder="MM-YYYY"
          value={subscriptionStart}
          onChange={(e) => setSubscriptionStart(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Subscription End (MM-YYYY)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="^\d{2}-\d{4}$"
          placeholder="MM-YYYY"
          value={subscriptionEnd}
          onChange={(e) => setSubscriptionEnd(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={autoRenew}
          onChange={(e) => setAutoRenew(e.target.checked)}
        />
        <label>Auto Renew</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}
