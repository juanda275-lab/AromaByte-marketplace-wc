"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabaseBrowser.auth.getUser()
      setUser(data.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
