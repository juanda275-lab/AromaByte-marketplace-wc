"use server"

import { createClient } from "@/lib/supabase/server"

export async function registerUser(formData: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    const supabase = await createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          role: formData.role,
        },
        emailRedirectTo: undefined,
      },
    })

    if (signUpError) {
      console.error("[v0] SignUp error:", signUpError)

      if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
        return {
          success: false,
          error: "Este email ya está registrado. Por favor inicia sesión o recupera tu contraseña.",
          errorCode: "user_exists",
        }
      }

      return { success: false, error: signUpError.message }
    }

    if (!authData.user) {
      return { success: false, error: "No se pudo crear el usuario" }
    }

    console.log("[v0] User created in auth.users:", authData.user.id)

    // El trigger 'on_auth_user_created' del Script 7 crea el perfil automáticamente
    // cuando se crea un usuario en auth.users

    // Esperar un momento para que el trigger se ejecute
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verificar que el perfil fue creado por el trigger
    const { data: profile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileCheckError || !profile) {
      console.error("[v0] Profile not found after trigger:", profileCheckError)
      return {
        success: false,
        error: "El usuario fue creado pero hubo un problema con el perfil. Por favor contacta soporte.",
      }
    }

    console.log("[v0] Profile created successfully by trigger for user:", authData.user.id)

    // Auto login después del registro
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) {
      console.error("[v0] Auto sign-in error:", signInError)
    }

    return { success: true, userId: authData.user.id, role: formData.role }
  } catch (error) {
    console.error("[v0] Unexpected error in registerUser:", error)
    return { success: false, error: "Error inesperado al crear la cuenta" }
  }
}

export async function resetPassword(email: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      console.error("[v0] Password reset error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error in resetPassword:", error)
    return { success: false, error: "Error inesperado al enviar el email" }
  }
}
