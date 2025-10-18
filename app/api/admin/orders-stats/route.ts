export const dynamic = "force-dynamic"

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

    // Get all orders
    const { data: orders, error } = await supabase.from("orders").select("status, total")

    if (error) {
      console.error("[v0] Error fetching orders:", error)
      return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter((o) => o.status === "pending").length || 0,
      processing: orders?.filter((o) => o.status === "processing").length || 0,
      shipped: orders?.filter((o) => o.status === "shipped").length || 0,
      delivered: orders?.filter((o) => o.status === "delivered").length || 0,
      cancelled: orders?.filter((o) => o.status === "cancelled").length || 0,
      totalRevenue: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in orders-stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
