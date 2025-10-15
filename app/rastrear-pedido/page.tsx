"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, Clock } from "lucide-react"
import { productsData } from "@/lib/products-data"

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <TrackOrderContent />
      <Footer />
    </>
  )
}

function TrackOrderContent() {
  const [orderNumber, setOrderNumber] = useState("")
  const [searchedOrder, setSearchedOrder] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const product1 = productsData[0] // Café Huila Premium
  const product2 = productsData[1] // Nariño Especial
  const product3 = productsData[2] // Eje Cafetero Clásico

  // Mock order data
  const mockOrders: Record<string, any> = {
    "AB-2024-001": {
      orderNumber: "AB-2024-001",
      status: "en_transito",
      statusText: "En Tránsito",
      orderDate: "2024-01-15",
      estimatedDelivery: "2024-01-20",
      trackingNumber: "COORD-789456123",
      customer: {
        name: "María González",
        address: "Calle 45 #23-67, Bogotá",
        phone: "+57 300 123 4567",
      },
      items: [
        {
          name: product1.name,
          quantity: 2,
          price: product1.price,
          image: product1.images[0],
        },
      ],
      timeline: [
        { status: "Pedido Confirmado", date: "2024-01-15 10:30 AM", completed: true },
        { status: "En Preparación", date: "2024-01-16 02:15 PM", completed: true },
        { status: "Enviado", date: "2024-01-17 09:00 AM", completed: true },
        { status: "En Tránsito", date: "2024-01-18 11:45 AM", completed: true },
        { status: "En Reparto", date: "Estimado: 2024-01-20", completed: false },
        { status: "Entregado", date: "Pendiente", completed: false },
      ],
    },
    "AB-2024-002": {
      orderNumber: "AB-2024-002",
      status: "entregado",
      statusText: "Entregado",
      orderDate: "2024-01-10",
      estimatedDelivery: "2024-01-15",
      deliveredDate: "2024-01-15",
      trackingNumber: "COORD-123789456",
      customer: {
        name: "Carlos Ramírez",
        address: "Carrera 7 #89-12, Medellín",
        phone: "+57 301 987 6543",
      },
      items: [
        {
          name: product2.name,
          quantity: 1,
          price: product2.price,
          image: product2.images[0],
        },
      ],
      timeline: [
        { status: "Pedido Confirmado", date: "2024-01-10 09:15 AM", completed: true },
        { status: "En Preparación", date: "2024-01-11 03:30 PM", completed: true },
        { status: "Enviado", date: "2024-01-12 08:00 AM", completed: true },
        { status: "En Tránsito", date: "2024-01-13 10:20 AM", completed: true },
        { status: "En Reparto", date: "2024-01-15 07:30 AM", completed: true },
        { status: "Entregado", date: "2024-01-15 02:45 PM", completed: true },
      ],
    },
    "AB-2024-003": {
      orderNumber: "AB-2024-003",
      status: "preparacion",
      statusText: "En Preparación",
      orderDate: "2024-01-18",
      estimatedDelivery: "2024-01-23",
      trackingNumber: "Pendiente",
      customer: {
        name: "Ana Martínez",
        address: "Avenida 15 #34-56, Cali",
        phone: "+57 302 456 7890",
      },
      items: [
        {
          name: product3.name,
          quantity: 3,
          price: product3.price,
          image: product3.images[0],
        },
      ],
      timeline: [
        { status: "Pedido Confirmado", date: "2024-01-18 11:00 AM", completed: true },
        { status: "En Preparación", date: "2024-01-18 04:30 PM", completed: true },
        { status: "Enviado", date: "Estimado: 2024-01-19", completed: false },
        { status: "En Tránsito", date: "Pendiente", completed: false },
        { status: "En Reparto", date: "Pendiente", completed: false },
        { status: "Entregado", date: "Pendiente", completed: false },
      ],
    },
  }

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate API call delay
    setTimeout(() => {
      setSearchedOrder(orderNumber)
      setIsSearching(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const order = searchedOrder ? mockOrders[searchedOrder] : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparacion":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "en_transito":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "entregado":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-coffee-light/20 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-coffee-dark mb-4">Rastrear Pedido</h1>
          <p className="text-lg text-gray-600">
            Ingresa tu número de pedido para ver el estado actual y la ubicación de tu envío
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Pedido
            </CardTitle>
            <CardDescription>Ingresa el número de pedido que recibiste en tu correo de confirmación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Ej: AB-2024-001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg"
              />
              <Button
                onClick={handleSearch}
                disabled={!orderNumber || isSearching}
                className="bg-coffee-primary hover:bg-coffee-dark text-white px-8"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Números de ejemplo para probar: AB-2024-001, AB-2024-002, AB-2024-003
            </p>
          </CardContent>
        </Card>

        {/* Order Not Found */}
        {searchedOrder && !order && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-2">Pedido No Encontrado</h3>
                <p className="text-red-600">
                  No encontramos ningún pedido con el número <strong>{searchedOrder}</strong>
                </p>
                <p className="text-sm text-red-500 mt-2">Verifica que el número sea correcto o contacta a soporte</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Pedido {order.orderNumber}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Realizado el{" "}
                      {new Date(order.orderDate).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} text-base px-4 py-2`}>{order.statusText}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-coffee-primary mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Entrega Estimada</p>
                      <p className="font-semibold text-coffee-dark">
                        {order.deliveredDate
                          ? new Date(order.deliveredDate).toLocaleDateString("es-CO")
                          : new Date(order.estimatedDelivery).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-coffee-primary mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Número de Guía</p>
                      <p className="font-semibold text-coffee-dark">{order.trackingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-coffee-primary mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección de Entrega</p>
                      <p className="font-semibold text-coffee-dark">{order.customer.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Estado del Envío</CardTitle>
                <CardDescription>Seguimiento detallado de tu pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {order.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4 pb-8 last:pb-0">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-coffee-primary text-white" : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-full min-h-[40px] ${
                              step.completed ? "bg-coffee-primary" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 pt-1">
                        <h4 className={`font-semibold ${step.completed ? "text-coffee-dark" : "text-gray-400"}`}>
                          {step.status}
                        </h4>
                        <p className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}>{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Productos del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-coffee-dark">{item.name}</h4>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-coffee-primary">
                          ${(item.price * item.quantity).toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-coffee-primary">
                      $
                      {order.items
                        .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
                        .toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-coffee-light/10 border-coffee-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-coffee-dark mb-2">¿Necesitas ayuda con tu pedido?</h3>
                  <p className="text-gray-600 mb-4">Nuestro equipo de soporte está disponible para ayudarte</p>
                  <Button
                    variant="outline"
                    className="border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white bg-transparent"
                  >
                    Contactar Soporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
