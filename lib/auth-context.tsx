"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type UserRole = "customer" | "producer" | "admin"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const profileCache = useRef<Map<string, Profile>>(new Map())
  const isFetchingProfile = useRef(false)
  const lastUserId = useRef<string | null>(null)

  const fetchProfile = async (userId: string) => {
    if (profileCache.current.has(userId)) {
      return profileCache.current.get(userId)!
    }

    if (isFetchingProfile.current) {
      return null
    }

    isFetchingProfile.current = true

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("[v0] Error fetching profile:", error)
        return null
      }

      if (data) {
        profileCache.current.set(userId, data as Profile)
      }

      return data as Profile
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
      return null
    } finally {
      isFetchingProfile.current = false
    }
  }

  const refreshProfile = async () => {
    if (user) {
      profileCache.current.delete(user.id)
      const profileData = await fetchProfile(user.id)
      if (profileData) {
        setProfile(profileData)
      }
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        lastUserId.current = session.user.id
        fetchProfile(session.user.id).then((profileData) => {
          if (profileData) {
            setProfile(profileData)
          }
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUserId = session?.user?.id ?? null

      if (newUserId !== lastUserId.current) {
        lastUserId.current = newUserId
        setUser(session?.user ?? null)

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          if (profileData) {
            setProfile(profileData)
          }
        } else {
          setProfile(null)
          profileCache.current.clear()
        }
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    profileCache.current.clear()
    lastUserId.current = null
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
