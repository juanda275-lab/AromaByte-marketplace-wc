export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  let connectionStatus = "disconnected"
  let errorMessage = ""
  const envVarsPresent = {
    url: false,
    anonKey: false,
    urlValue: "",
  }
  const testResults: { table: string; status: string; count?: number; error?: string }[] = []

  try {
    // Check environment variables
    envVarsPresent.url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    envVarsPresent.anonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    envVarsPresent.urlValue = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

    if (!envVarsPresent.url || !envVarsPresent.anonKey) {
      connectionStatus = "error"
      errorMessage = "Variables de entorno de Supabase no configuradas"
    } else {
      const supabase = await createClient()

      // Just creating the client successfully means we can connect
      connectionStatus = "connected"

      const tablesToTest = ["products", "users", "producers", "orders", "profiles"]

      for (const table of tablesToTest) {
        try {
          const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

          if (error) {
            if (error.code === "PGRST116" || error.message.includes("does not exist")) {
              testResults.push({ table, status: "not_found" })
            } else {
              testResults.push({ table, status: "error", error: error.message })
            }
          } else {
            testResults.push({ table, status: "found", count: count || 0 })
          }
        } catch (err) {
          testResults.push({
            table,
            status: "error",
            error: err instanceof Error ? err.message : "Error desconocido",
          })
        }
      }

      const foundTables = testResults.filter((r) => r.status === "found")
      if (foundTables.length === 0) {
        errorMessage =
          "Conexión exitosa a Supabase, pero no se encontraron tablas. Tu compañero puede que aún no haya creado las tablas en la base de datos."
      }
    }
  } catch (error) {
    connectionStatus = "error"
    errorMessage = error instanceof Error ? error.message : "Error desconocido al conectar"
  }

  return NextResponse.json({
    connectionStatus,
    errorMessage,
    envVarsPresent,
    testResults,
  })
}
