export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Obtener favoritos del usuario
export async function GET() {
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
      .from("favorites")
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          price,
          image_url,
          origin,
          roast_level
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching favorites:", error)
      return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 })
    }

    return NextResponse.json({ favorites: data })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Agregar a favoritos
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { productId } = await request.json()

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        product_id: productId,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding favorite:", error)
      return NextResponse.json({ error: "Error al agregar favorito" }, { status: 500 })
    }

    return NextResponse.json({ success: true, favorite: data })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar de favoritos
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { productId } = await request.json()

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)

    if (error) {
      console.error("[v0] Error removing favorite:", error)
      return NextResponse.json({ error: "Error al eliminar favorito" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
