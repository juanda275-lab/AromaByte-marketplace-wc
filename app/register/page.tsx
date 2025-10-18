"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<string>("customer")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const terms = formData.get("terms") as string

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (!terms) {
      setError("Debes aceptar los términos y condiciones")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      })

      if (signUpError) {
        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.includes("User already registered")
        ) {
          setError("Este email ya está registrado. Por favor inicia sesión.")
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Error al crear la cuenta. Por favor intenta de nuevo.")
        setLoading(false)
        return
      }

      router.push("/login?registered=true")
    } catch (err) {
      console.error("[v0] Registration error:", err)
      setError("Ocurrió un error al crear la cuenta. Por favor intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-coffee-primary mb-2">Crear tu cuenta</h1>
            <p className="text-gray-600">Únete a AromaByte y descubre los mejores cafés colombianos.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Registro</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    Tipo de Cuenta
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="producer">Productor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {role === "producer"
                      ? "Como productor podrás vender tus productos en el marketplace"
                      : "Como cliente podrás comprar café directamente de los productores"}
                  </p>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    value="accepted"
                    className="rounded border-gray-300 text-coffee-primary focus:ring-coffee-primary mt-1"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Acepto los{" "}
                    <Link href="/terms" className="text-coffee-primary hover:underline">
                      Términos de Servicio
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacy" className="text-coffee-primary hover:underline">
                      Política de Privacidad
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full bg-coffee-primary hover:bg-coffee-secondary" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-coffee-primary hover:underline font-medium">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
