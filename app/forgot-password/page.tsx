"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el email de recuperación
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-coffee-primary mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Restablecer Contraseña</CardTitle>
              {!submitted && (
                <CardDescription className="text-center">
                  Te enviaremos un enlace de recuperación a tu correo electrónico
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                    Enviar Enlace de Recuperación
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">¡Correo Enviado!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                    </p>
                  </div>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
                    Enviar Nuevamente
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-coffee-primary hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver al inicio de sesión
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-coffee-primary hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
