"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Database, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function TestDBPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [testData, setTestData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user && profile?.role !== "admin") {
      if (profile?.role === "customer") {
        router.push("/dashboard/customer")
      } else if (profile?.role === "producer") {
        router.push("/dashboard/producer")
      }
    }
  }, [user, profile, authLoading, router])

  useEffect(() => {
    if (user && profile?.role === "admin") {
      fetchTestData()
    }
  }, [user, profile])

  const fetchTestData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setTestData(data)
    } catch (error) {
      console.error("[v0] Error fetching test data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!testData) {
    return null
  }

  const { connectionStatus, errorMessage, envVarsPresent, testResults } = testData

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 bg-cream/30">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-coffee-primary">Panel de Administración</h1>
            <p className="text-gray-600">Test de Conexión a Base de Datos</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado de Conexión
              </CardTitle>
              <CardDescription>Resultado de la prueba de conexión con Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado:</span>
                {connectionStatus === "connected" ? (
                  <Badge variant="default" className="bg-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {connectionStatus === "error" ? "Error" : "Desconectado"}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Variables de entorno:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {envVarsPresent.url ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>NEXT_PUBLIC_SUPABASE_URL</span>
                    {envVarsPresent.url && envVarsPresent.urlValue && (
                      <span className="text-muted-foreground text-xs">
                        ({envVarsPresent.urlValue.substring(0, 30)}...)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {envVarsPresent.anonKey ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    {envVarsPresent.anonKey && <span className="text-muted-foreground text-xs">(configurada)</span>}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Información:</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {testResults && testResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tablas en la base de datos:</p>
                  <div className="space-y-2">
                    {testResults.map((result: any) => (
                      <div key={result.table} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          {result.status === "found" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : result.status === "error" ? (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm font-mono">{result.table}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.status === "found" && (
                            <Badge variant="outline" className="text-xs">
                              {result.count} registros
                            </Badge>
                          )}
                          {result.status === "not_found" && (
                            <span className="text-xs text-muted-foreground">No existe</span>
                          )}
                          {result.status === "error" && result.error && (
                            <span className="text-xs text-amber-600">Error</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {connectionStatus === "connected"
                    ? "La conexión con Supabase está funcionando correctamente. Tu aplicación puede acceder a la base de datos."
                    : "No se pudo conectar a Supabase. Verifica que las variables de entorno estén configuradas correctamente en Vercel."}
                </p>
              </div>

              <div className="pt-4">
                <Button onClick={fetchTestData} className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                  Actualizar Test
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>URL de prueba:</strong> /test-db
              </p>
              <p>
                <strong>Propósito:</strong> Esta página verifica que las variables de entorno de Supabase estén
                configuradas y que la aplicación pueda conectarse a la base de datos.
              </p>
              <p className="text-muted-foreground">
                Nota: Esta página solo es accesible para usuarios con rol de administrador.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
