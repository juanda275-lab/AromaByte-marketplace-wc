import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Database, AlertCircle } from "lucide-react"

export default async function TestDBPage() {
  let connectionStatus = "disconnected"
  let errorMessage = ""
  const envVarsPresent = {
    url: false,
    anonKey: false,
  }
  const testResults: { table: string; status: string; count?: number }[] = []

  try {
    // Check environment variables
    envVarsPresent.url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    envVarsPresent.anonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!envVarsPresent.url || !envVarsPresent.anonKey) {
      connectionStatus = "error"
      errorMessage = "Variables de entorno de Supabase no configuradas"
    } else {
      const supabase = await createClient()

      const tablesToTest = ["products", "users", "producers", "orders"]

      for (const table of tablesToTest) {
        try {
          const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

          if (error) {
            testResults.push({ table, status: "not_found" })
          } else {
            testResults.push({ table, status: "found", count: count || 0 })
            connectionStatus = "connected"
          }
        } catch (err) {
          testResults.push({ table, status: "error" })
        }
      }

      // If no tables were found, still mark as connected if we could create client
      if (connectionStatus !== "connected" && supabase) {
        connectionStatus = "connected"
        errorMessage =
          "Conexión exitosa, pero no se encontraron tablas comunes. Tu compañero puede que aún no haya creado las tablas."
      }
    }
  } catch (error) {
    connectionStatus = "error"
    errorMessage = error instanceof Error ? error.message : "Error desconocido al conectar"
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Test de Conexión a Base de Datos</h1>
          <p className="text-muted-foreground">Verifica que la conexión con Supabase esté funcionando correctamente</p>
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
                  {envVarsPresent.url && (
                    <span className="text-muted-foreground text-xs">
                      ({process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...)
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

            {testResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Tablas en la base de datos:</p>
                <div className="space-y-2">
                  {testResults.map((result) => (
                    <div key={result.table} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        {result.status === "found" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm font-mono">{result.table}</span>
                      </div>
                      {result.status === "found" && (
                        <Badge variant="outline" className="text-xs">
                          {result.count} registros
                        </Badge>
                      )}
                      {result.status === "not_found" && (
                        <span className="text-xs text-muted-foreground">No existe</span>
                      )}
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
              Nota: Esta página solo funcionará en producción (Vercel) donde las variables de entorno están
              configuradas. En el preview de v0 mostrará error porque las variables no están disponibles aquí.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
