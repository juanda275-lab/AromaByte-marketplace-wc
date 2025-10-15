"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DebugProducts() {
  useEffect(() => {
    async function testQuery() {
      console.log("🧠 Probando query...")

      // 🔹 Reemplaza el número con el ID de un productor que sí exista
      const producerId = 1

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("producer->>id", String(producerId))

      if (error) {
        console.error("❌ Error Supabase:", error)
      } else {
        console.log("✅ Resultado:", data)
      }
    }

    testQuery()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">🧩 Debug Products</h1>
      <p>Abre la consola (F12) → pestaña <strong>Console</strong> para ver resultados.</p>
    </div>
  )
}