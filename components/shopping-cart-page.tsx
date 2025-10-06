"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck, CreditCard } from "lucide-react"
import { useCart } from "@/lib/cart-context"

const shippingOptions = [
  {
    id: "servientrega",
    name: "Servientrega",
    description: "Entrega en 3-5 días hábiles",
    price: 8000,
    estimatedDays: "3-5 días",
  },
  {
    id: "coordinadora",
    name: "Coordinadora",
    description: "Entrega en 2-4 días hábiles",
    price: 12000,
    estimatedDays: "2-4 días",
  },
  {
    id: "interrapidisimo",
    name: "Interrapidísimo",
    description: "Entrega en 1-3 días hábiles",
    price: 15000,
    estimatedDays: "1-3 días",
  },
  {
    id: "express",
    name: "Envío Express",
    description: "Entrega al siguiente día hábil",
    price: 25000,
    estimatedDays: "1 día",
  },
]

export function ShoppingCartPage() {
  const { items: cartItems, updateQuantity, removeItem } = useCart()
  const [selectedShipping, setSelectedShipping] = useState("servientrega")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "cafe10") {
      setPromoDiscount(0.1) // 10% discount
    } else if (promoCode.toLowerCase() === "primera") {
      setPromoDiscount(0.15) // 15% discount for first-time buyers
    } else {
      setPromoDiscount(0)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const selectedShippingOption = shippingOptions.find((option) => option.id === selectedShipping)
  const shippingCost = selectedShippingOption?.price || 0
  const discountAmount = subtotal * promoDiscount
  const total = subtotal + shippingCost - discountAmount

  if (cartItems.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-coffee-primary/30 mx-auto mb-6" />
            <h1 className="font-poppins font-bold text-2xl text-coffee-primary mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">
              Descubre nuestros cafés premium y agrega algunos a tu carrito para continuar.
            </p>
            <Button asChild size="lg" className="bg-coffee-primary hover:bg-coffee-secondary">
              <Link href="/catalog">Explorar Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
          <div>
            <h1 className="font-poppins font-bold text-3xl text-coffee-primary">Carrito de Compras</h1>
            <p className="text-muted-foreground">{cartItems.length} productos en tu carrito</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-coffee-light">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-poppins font-semibold text-lg text-coffee-primary">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.origin} • {item.roastLevel} • {item.weight}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">Cantidad:</span>
                          <div className="flex items-center border border-coffee-light rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <span className="font-poppins font-bold text-xl text-coffee-primary">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card className="border-coffee-light">
              <CardHeader>
                <CardTitle className="font-poppins text-lg text-coffee-primary">Código Promocional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresa tu código"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="border-coffee-light"
                  />
                  <Button
                    onClick={applyPromoCode}
                    variant="outline"
                    className="border-coffee-primary text-coffee-primary bg-transparent"
                  >
                    Aplicar
                  </Button>
                </div>
                {promoDiscount > 0 && (
                  <p className="text-sm text-green-600">
                    ¡Código aplicado! Descuento del {(promoDiscount * 100).toFixed(0)}%
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card className="border-coffee-light">
              <CardHeader>
                <CardTitle className="font-poppins text-lg text-coffee-primary flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Opciones de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 p-3 border border-coffee-light rounded-lg"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${option.price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{option.estimatedDays}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-coffee-light">
              <CardHeader>
                <CardTitle className="font-poppins text-lg text-coffee-primary">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>${shippingCost.toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({(promoDiscount * 100).toFixed(0)}%)</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-poppins font-bold text-lg text-coffee-primary">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceder al Pago
                </Button>

                <div className="text-center">
                  <Button asChild variant="ghost" className="text-coffee-primary">
                    <Link href="/catalog">Continuar Comprando</Link>
                  </Button>
                </div>

                {/* Security Info */}
                <div className="text-center pt-4 border-t border-coffee-light">
                  <p className="text-xs text-muted-foreground">
                    🔒 Pago seguro con encriptación SSL
                    <br />
                    Aceptamos todas las tarjetas de crédito y débito
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
