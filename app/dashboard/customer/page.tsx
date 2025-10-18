"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Heart, MapPin, Calendar, DollarSign, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Order {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
  estimated_delivery_date: string | null
  order_items: {
    id: number
    quantity: number
    price: number
    product_id: number
    products: {
      name: string
      image_url: string
    }
  }[]
}

export default function CustomerDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user && profile?.role !== "customer") {
      if (profile?.role === "producer") {
        router.push("/dashboard/producer")
      } else if (profile?.role === "admin") {
        router.push("/test-db")
      }
    }
  }, [user, profile, authLoading, router])

  // This prevents the infinite loop that was causing rate limiting

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites")
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching favorites:", error)
    }
  }

  const removeFavorite = async (productId: number) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.product_id !== productId))
      }
    } catch (error) {
      console.error("[v0] Error removing favorite:", error)
    }
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

  useEffect(() => {
    setLoading(false)
  }, [])

  if (authLoading) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 bg-cream/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-coffee-primary mb-2">Mi Dashboard</h1>
            <p className="text-gray-600">Bienvenido de vuelta, {profile?.full_name}</p>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Mis Pedidos
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoritos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {orders.length === 0 && !loading && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Mis Pedidos</h3>
                    <p className="text-gray-500 mb-4">Haz clic para cargar tus pedidos</p>
                    <Button onClick={fetchOrders} className="bg-coffee-primary hover:bg-coffee-secondary">
                      Cargar Pedidos
                    </Button>
                  </CardContent>
                </Card>
              )}

              {loading && (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-primary"></div>
                  </CardContent>
                </Card>
              )}

              {orders.length > 0 && (
                <>
                  {orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">Pedido #{order.order_number}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.created_at).toLocaleDateString("es-CO")}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />${(order.total || 0).toLocaleString("es-CO")}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-cream/50 rounded-lg">
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.products?.image_url || "/placeholder.svg"}
                                  alt={item.products?.name || "Producto"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-coffee-primary">{item.products?.name || "Producto"}</p>
                                <p className="text-sm text-gray-600">
                                  Cantidad: {item.quantity} x ${(item.price || 0).toLocaleString("es-CO")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          {order.estimated_delivery_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                Entrega estimada: {new Date(order.estimated_delivery_date).toLocaleDateString("es-CO")}
                              </span>
                            </div>
                          )}
                          <div className="ml-auto flex gap-2">
                            {order.status === "pending" && (
                              <Link href={`/checkout/payment/${order.order_number}`}>
                                <Button size="sm" className="bg-coffee-primary hover:bg-coffee-secondary">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Completar Pago
                                </Button>
                              </Link>
                            )}
                            <Link href={`/tracking/${order.order_number}`}>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Truck className="h-4 w-4 mr-2" />
                                Rastrear Pedido
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favorites.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Mis Favoritos</h3>
                    <p className="text-gray-500 mb-4">Haz clic para cargar tus productos favoritos</p>
                    <Button onClick={fetchFavorites} className="bg-coffee-primary hover:bg-coffee-secondary">
                      Cargar Favoritos
                    </Button>
                  </CardContent>
                </Card>
              )}

              {favorites.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite: any) => (
                    <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-3">
                          <Image
                            src={favorite.products.image_url || "/placeholder.svg"}
                            alt={favorite.products.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-coffee-primary mb-1">{favorite.products.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{favorite.products.origin}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-coffee-primary">
                            ${favorite.products.price.toLocaleString("es-CO")}
                          </span>
                          <div className="flex gap-2">
                            <Link href={`/product/${favorite.product_id}`}>
                              <Button size="sm" variant="outline">
                                Ver
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFavorite(favorite.product_id)}
                              className="text-red-500"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
