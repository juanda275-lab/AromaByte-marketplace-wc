"use client"

import { useState } from "react"
import { supabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const supabase = supabaseBrowserClient()

  const testLogin = async () => {
    console.log("[v0] Testing login with:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("[v0] Login result:", { data, error })
    setResult({ data, error })
  }

  const checkUser = async () => {
    console.log("[v0] Checking user:", email)

    const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

    console.log("[v0] User check result:", { data, error })
    setResult({ data, error })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test de Login</CardTitle>
          <CardDescription>Herramienta de diagnóstico de autenticación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-email@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testLogin} className="flex-1">
              Probar Login
            </Button>
            <Button onClick={checkUser} variant="outline" className="flex-1 bg-transparent">
              Verificar Usuario
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
