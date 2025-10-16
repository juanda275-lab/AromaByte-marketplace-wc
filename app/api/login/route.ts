import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("❌ Error iniciando sesión:", error.message)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // El helper ya gestiona las cookies automáticamente 🧠
    return NextResponse.json({ message: "Inicio de sesión exitoso" }, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error general en login:", err.message)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}