export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get sales data for last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    if (error) throw error

    // Group sales by day
    const salesByDay: { [key: string]: number } = {}
    orders?.forEach((order: any) => {
      const date = new Date(order.created_at).toLocaleDateString("es-CO")
      salesByDay[date] = (salesByDay[date] || 0) + (order.total || 0)
    })

    const salesData = Object.entries(salesByDay).map(([date, sales]) => ({
      date,
      sales,
    }))

    return NextResponse.json({ salesByDay: salesData })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Error fetching analytics" }, { status: 500 })
  }
}
