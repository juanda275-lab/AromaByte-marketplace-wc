import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    console.log("[v0] Updating product with ID:", params.id)

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

    const body = await request.json()
    const { stock, price } = body

    console.log("[v0] Update data:", { stock, price })

    const { error: updateError } = await supabase
      .from("products")
      .update({
        stock,
        price,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return NextResponse.json({ error: "Error updating product" }, { status: 500 })
    }

    console.log("[v0] Update successful, fetching updated product...")

    const { data: updatedProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !updatedProduct) {
      console.error("[v0] Error fetching updated product:", fetchError)
      return NextResponse.json({ error: "Error fetching updated product" }, { status: 500 })
    }

    console.log("[v0] Product updated successfully:", updatedProduct)
    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: "Error updating product" }, { status: 500 })
  }
}
