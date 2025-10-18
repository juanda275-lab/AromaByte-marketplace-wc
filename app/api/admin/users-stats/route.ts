import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Get all profiles
    const { data: profiles, error } = await supabase.from("profiles").select("role")

    if (error) {
      console.error("[v0] Error fetching profiles:", error)
      return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      totalUsers: profiles?.length || 0,
      customers: profiles?.filter((p) => p.role === "customer").length || 0,
      producers: profiles?.filter((p) => p.role === "producer").length || 0,
      admins: profiles?.filter((p) => p.role === "admin").length || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in users-stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
