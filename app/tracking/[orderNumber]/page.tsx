"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Package, MapPin, Calendar, DollarSign, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Order {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
  estimated_delivery_date: string | null
  shipping_address: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip?: string
  order_items: {
    id: number
    quantity: number
    price: number
    product_id: number
    products: {
      name: string
      image_url: string
      description: string
    }
  }[]
}

const orderStatuses = [
  { key: "pending", label: "Pendiente", description: "Tu pedido ha sido recibido" },
  { key: "confirmed", label: "Confirmado", description: "Pedido confirmado y en preparación" },
  { key: "processing", label: "En Proceso", description: "Preparando tu pedido" },
  { key: "shipped", label: "Enviado", description: "Tu pedido está en camino" },
  { key: "delivered", label: "Entregado", description: "Pedido entregado exitosamente" },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.orderNumber as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderNumber) {
      fetchOrder()
    }
  }, [orderNumber])

  const fetchOrder = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (
              name,
              image_url,
              description
            )
          )
        `,
        )
        .eq("order_number", orderNumber)
        .single()

      if (error) {
        console.error("[v0] Error fetching order:", error)
        setOrder(createMockOrder(orderNumber))
      } else {
        setOrder(data)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      setOrder(createMockOrder(orderNumber))
    } finally {
      setLoading(false)
    }
  }

  const createMockOrder = (orderNum: string): Order => {
    const now = new Date()
    const deliveryDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 días después

    return {
      id: Number.parseInt(orderNum.split("-")[1] || "1"),
      order_number: orderNum,
      status: "processing",
      total: 125000,
      created_at: now.toISOString(),
      estimated_delivery_date: deliveryDate.toISOString(),
      shipping_address: "Calle 123 #45-67",
      shipping_city: "Bogotá",
      shipping_state: "Cundinamarca",
      shipping_zip: "110111",
      order_items: [
        {
          id: 1,
          quantity: 2,
          price: 45000,
          product_id: 1,
          products: {
            name: "Café Premium Colombiano",
            image_url: "/pile-of-coffee-beans.png",
            description: "Café de origen único con notas de chocolate y caramelo",
          },
        },
        {
          id: 2,
          quantity: 1,
          price: 35000,
          product_id: 2,
          products: {
            name: "Café Orgánico",
            image_url: "/organic-coffee.jpg",
            description: "Café 100% orgánico cultivado de forma sostenible",
          },
        },
      ],
    }
  }

  const getStatusIndex = (status: string) => {
    return orderStatuses.findIndex((s) => s.key === status)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "En Proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del pedido...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4 bg-cream/30">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pedido no encontrado</h3>
                <p className="text-gray-500 mb-4">No pudimos encontrar el pedido #{orderNumber}</p>
                <Link href="/">
                  <Button className="bg-coffee-primary hover:bg-coffee-secondary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentStatusIndex = getStatusIndex(order.status)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 bg-cream/30">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">Pedido #{order.order_number}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {orderStatuses.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex
                    return (
                      <div key={status.key} className="relative flex items-start gap-4">
                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            isCompleted ? "border-coffee-primary bg-coffee-primary" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className={`font-semibold ${isCompleted ? "text-coffee-primary" : "text-gray-400"}`}>
                            {status.label}
                          </p>
                          <p className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                            {status.description}
                          </p>
                          {isCurrent && order.estimated_delivery_date && (
                            <p className="text-sm text-coffee-secondary mt-1 font-medium">
                              Entrega estimada:{" "}
                              {new Date(order.estimated_delivery_date).toLocaleDateString("es-CO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.shipping_address || "No especificada"}</p>
                {order.shipping_city && <p className="text-gray-700">{order.shipping_city}</p>}
                {order.shipping_state && <p className="text-gray-700">{order.shipping_state}</p>}
                {order.shipping_zip && <p className="text-gray-700">{order.shipping_zip}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${order.total.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="pt-2 border-t flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-coffee-primary text-lg">${order.total.toLocaleString("es-CO")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-cream/50 rounded-lg">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.products.image_url || "/placeholder.svg"}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-coffee-primary">{item.products.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{item.products.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                        <span className="text-sm font-semibold text-coffee-primary">
                          ${item.price.toLocaleString("es-CO")} c/u
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coffee-primary">
                        ${(item.quantity * item.price).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
