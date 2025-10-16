import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // 🔐 Crear usuario en Auth
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (createError) {
      console.error("❌ Error creando usuario en Auth:", createError)
      return NextResponse.json({ error: "Error al crear usuario: " + createError.message }, { status: 500 })
    }

    const user = data.user
    if (!user) {
      return NextResponse.json({ error: "No se pudo obtener el usuario creado" }, { status: 500 })
    }

    // 🧩 Verificar si ya existe en tabla `users`
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error verificando usuario existente:", fetchError)
      return NextResponse.json({ error: "Error al verificar usuario" }, { status: 500 })
    }

    if (!existingUser) {
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: user.id,
        full_name: name,
        role: "client",
      })

      if (insertError) {
        console.error("❌ Error insertando en public.users:", insertError)
        return NextResponse.json({ error: "Error insertando en tabla users" }, { status: 500 })
      }
    }

    console.log("✅ Usuario creado con éxito:", user.email)
    return NextResponse.json({ message: "Usuario creado con éxito" }, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error general al registrar:", err)
    return NextResponse.json({ error: "Error al registrar usuario: " + err.message }, { status: 500 })
  }
}
