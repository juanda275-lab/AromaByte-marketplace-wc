"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, Mail, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get("orderNumber")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!orderNumber) {
      router.push("/")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(`/tracking/${orderNumber}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-green-700">¡Pago Exitoso!</CardTitle>
              <p className="text-muted-foreground mt-2">Tu pedido ha sido confirmado y está siendo procesado</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Number */}
              <div className="bg-muted/50 p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Número de Pedido</p>
                <p className="text-2xl font-bold font-mono">#{orderNumber}</p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Confirmación Enviada</p>
                    <p className="text-xs text-muted-foreground">
                      Hemos enviado un correo con los detalles de tu pedido
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Preparando Envío</p>
                    <p className="text-xs text-muted-foreground">Tu pedido será procesado en las próximas 24 horas</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold">¿Qué sigue?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Recibirás un correo de confirmación con los detalles de tu pedido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Te notificaremos cuando tu pedido sea enviado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Puedes rastrear tu pedido en cualquier momento</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/tracking/${orderNumber}`}>
                    Ver Estado del Pedido
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                  <Link href="/catalog">Continuar Comprando</Link>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Redirigiendo automáticamente en {countdown} segundos...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
