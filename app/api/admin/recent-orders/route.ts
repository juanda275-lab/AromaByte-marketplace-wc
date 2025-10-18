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

    // Get recent orders with order items
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        status,
        total,
        created_at,
        order_items (
          id,
          quantity,
          price
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Error fetching recent orders:", error)
      return NextResponse.json({ error: "Error al obtener pedidos recientes" }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error("[v0] Error in recent-orders:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
