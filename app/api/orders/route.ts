import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        total,
        created_at,
        estimated_delivery_date,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            name,
            image_url
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching orders:", error)
      return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 })
    }

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shipping, paymentMethod, shippingCost, discount, total } = body

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: `ORD-${Date.now()}`,
        status: "pending",
        total: total,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_zip: shipping.zipCode,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
        discount_amount: discount,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: orderError.message || "Error al crear la orden" }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
      user_id: user.id,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      // Eliminar la orden si falla la creación de items
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Error al crear los items de la orden" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: order,
      message: "Pedido creado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error in order creation:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
