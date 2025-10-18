"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function CompletePaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderNumber = params.orderNumber as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchOrder()
  }, [user, orderNumber])

  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        const foundOrder = data.orders?.find((o: any) => o.order_number === orderNumber)
        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          router.push("/dashboard/customer")
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      const cleaned = value.replace(/\s/g, "")
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        setPaymentForm({ ...paymentForm, [field]: formatCardNumber(cleaned) })
      }
    } else if (field === "expiryDate") {
      const cleaned = value.replace(/\D/g, "")
      if (cleaned.length <= 4) {
        setPaymentForm({ ...paymentForm, [field]: formatExpiryDate(cleaned) })
      }
    } else if (field === "cvv") {
      if (value.length <= 4 && /^\d*$/.test(value)) {
        setPaymentForm({ ...paymentForm, [field]: value })
      }
    } else {
      setPaymentForm({ ...paymentForm, [field]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect directly to confirmation page (mock payment successful)
      router.push(`/checkout/confirmation?orderNumber=${orderNumber}`)
    } catch (error) {
      console.error("[v0] Error processing payment:", error)
      alert("Error al procesar el pago. Por favor intenta de nuevo.")
      setProcessing(false)
    }
  }

  if (loading) {
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

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            href="/dashboard/customer"
            className="inline-flex items-center text-coffee-primary mb-6 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-coffee-primary/5">
              <CardTitle className="text-2xl text-coffee-primary">Completar Pago</CardTitle>
              <CardDescription>Pedido #{orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Order Summary */}
              <div className="mb-6 p-4 bg-cream/50 rounded-lg">
                <h3 className="font-semibold text-coffee-primary mb-3">Resumen del Pedido</h3>
                <div className="space-y-2 text-sm">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.products?.name} x {item.quantity}
                      </span>
                      <span>${((item.price || 0) * item.quantity).toLocaleString("es-CO")}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${(order.total || 0).toLocaleString("es-CO")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-coffee-primary mb-4">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="font-semibold">Información de Pago</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      required
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                    <Input
                      id="cardName"
                      placeholder="JUAN PEREZ"
                      value={paymentForm.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de Vencimiento *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        required
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={paymentForm.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        required
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Tu información está protegida con encriptación SSL de 256 bits</span>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-coffee-primary hover:bg-coffee-secondary text-white py-6 text-lg font-semibold"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>Pagar ${(order.total || 0).toLocaleString("es-CO")}</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
