"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, CreditCard, Lock, ShieldCheck } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, clearCart, getSubtotal } = useCart()
  const { user, loading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/checkout")
    }
  }, [user, loading, router])

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const subtotal = getSubtotal()
  const shippingCost = 12000
  const total = subtotal + shippingCost

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Debes iniciar sesión para completar la compra")
      router.push("/login?redirect=/checkout")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems,
          shipping: {
            address: shippingForm.address,
            city: shippingForm.city,
            state: shippingForm.state,
            zipCode: shippingForm.zipCode,
            fullName: shippingForm.fullName,
            email: shippingForm.email,
            phone: shippingForm.phone,
          },
          paymentMethod: `**** **** **** ${paymentForm.cardNumber.slice(-4)}`,
          shippingCost,
          discount: 0,
          total,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentSuccess(true)
        clearCart()
        router.push(`/checkout/confirmation?orderNumber=${data.order.order_number}`)
      } else {
        alert(data.error || "Error al procesar el pago")
      }
    } catch (error) {
      console.error("[v0] Error processing payment:", error)
      alert("Error al procesar el pago")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (cartItems.length === 0 && !paymentSuccess) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Carrito
              </Link>
            </Button>
            <div>
              <h1 className="font-poppins font-bold text-3xl">Finalizar Compra</h1>
              <p className="text-muted-foreground">Completa tu información para procesar el pago</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Forms Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        1
                      </span>
                      Información de Envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nombre Completo *</Label>
                        <Input
                          id="fullName"
                          required
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          placeholder="juan@ejemplo.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        required
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        placeholder="Calle 123 #45-67, Apto 101"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          placeholder="Bogotá"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Departamento *</Label>
                        <Input
                          id="state"
                          required
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                          placeholder="Cundinamarca"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal *</Label>
                        <Input
                          id="zipCode"
                          required
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                          placeholder="110111"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                      </span>
                      Información de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          required
                          maxLength={19}
                          value={paymentForm.cardNumber}
                          onChange={(e) =>
                            setPaymentForm({ ...paymentForm, cardNumber: formatCardNumber(e.target.value) })
                          }
                          placeholder="1234 5678 9012 3456"
                          className="pl-10"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                      <Input
                        id="cardName"
                        required
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value.toUpperCase() })}
                        placeholder="JUAN PEREZ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Fecha de Vencimiento *</Label>
                        <Input
                          id="expiryDate"
                          required
                          maxLength={5}
                          value={paymentForm.expiryDate}
                          onChange={(e) =>
                            setPaymentForm({ ...paymentForm, expiryDate: formatExpiryDate(e.target.value) })
                          }
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          required
                          maxLength={4}
                          type="password"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, "") })}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <Lock className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-muted-foreground">
                        Tu información está protegida con encriptación SSL de 256 bits
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Products */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ${item.price.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-medium text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span>${shippingCost.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Pagar ${total.toLocaleString()}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Pago 100% seguro y protegido</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
