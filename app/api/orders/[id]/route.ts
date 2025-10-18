import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { status, payment_method } = await request.json()
    const orderId = params.id

    // Update order status
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        payment_method,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating order:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order: data })
  } catch (error: any) {
    console.error("[v0] Error in PATCH /api/orders/[id]:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
