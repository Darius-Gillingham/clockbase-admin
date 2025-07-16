'use client'

import { useState, useEffect, useContext, createContext } from 'react'
import {
  createClientComponentClient,
  Session,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs'

type SupabaseContextValue = {
  supabase: SupabaseClient
  session: Session | null
  setSession: (session: Session | null) => void
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient())
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, session, setSession }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used within SupabaseProvider')
  return context
}
