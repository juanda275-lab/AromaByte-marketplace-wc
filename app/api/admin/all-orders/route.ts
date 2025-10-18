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

    // Fetch all orders with user email
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles!orders_user_id_fkey(email)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) throw error

    // Format orders with user email
    const formattedOrders = orders?.map((order: any) => ({
      ...order,
      user_email: order.profiles?.email,
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error("[v0] Error fetching all orders:", error)
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 })
  }
}
