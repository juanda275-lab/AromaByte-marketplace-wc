"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Database,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Search,
  AlertTriangle,
  LucideLineChart,
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
}

interface UserStats {
  totalUsers: number
  customers: number
  producers: number
  admins: number
}

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [salesData, setSalesData] = useState<any[]>([])
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user && profile && profile.role !== "admin") {
      if (profile.role === "customer") {
        router.push("/dashboard/customer")
      } else if (profile.role === "producer") {
        router.push("/dashboard/producer")
      }
    }
  }, [user, profile, authLoading, router])

  useEffect(() => {
    if (user && profile?.role === "admin") {
      loadDashboardData()
    }
  }, [user, profile])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch order statistics
      const ordersResponse = await fetch("/api/admin/orders-stats")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrderStats(ordersData)
      }

      // Fetch user statistics
      const usersResponse = await fetch("/api/admin/users-stats")
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUserStats(usersData)
      }

      // Fetch recent orders
      const recentResponse = await fetch("/api/admin/recent-orders")
      if (recentResponse.ok) {
        const recentData = await recentResponse.json()
        setRecentOrders(recentData.orders || [])
      }

      const productsResponse = await fetch("/api/admin/products")
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setAllProducts(productsData.products || [])
      }

      const allOrdersResponse = await fetch("/api/admin/all-orders")
      if (allOrdersResponse.ok) {
        const allOrdersData = await allOrdersResponse.json()
        setAllOrders(allOrdersData.orders || [])
        setFilteredOrders(allOrdersData.orders || [])
      }

      const analyticsResponse = await fetch("/api/admin/analytics")
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setSalesData(analyticsData.salesByDay || [])
      }
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = allOrders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, allOrders])

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    console.log("[v0] Updating product:", editingProduct)
    console.log("[v0] Product ID:", editingProduct.id)
    console.log("[v0] New stock:", editingProduct.stock)
    console.log("[v0] New price:", editingProduct.price)

    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: editingProduct.stock,
          price: editingProduct.price,
        }),
      })

      console.log("[v0] Response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Response data:", responseData)

      if (response.ok) {
        alert("Producto actualizado exitosamente")
        setEditDialogOpen(false)
        loadDashboardData()
      } else {
        alert(`Error al actualizar el producto: ${responseData.error || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      alert("Error al actualizar el producto. Por favor intenta de nuevo.")
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId)

    try {
      console.log("[v0] Updating order", orderId, "to status", newStatus)

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        console.log("[v0] Order status updated successfully")

        setAllOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )

        const ordersResponse = await fetch("/api/admin/orders-stats")
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrderStats(ordersData)
        }

        alert("Estado del pedido actualizado exitosamente")
      } else {
        const errorData = await response.json()
        console.error("[v0] Error response:", errorData)
        alert(`Error al actualizar el estado: ${errorData.error || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
      alert("Error al actualizar el estado. Por favor intenta de nuevo.")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-coffee-primary">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Bienvenido, {profile?.full_name || profile?.email}</p>
            </div>
            <Link href="/test-db">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Database className="h-4 w-4" />
                Test Base de Datos
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orderStats?.total || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Todos los pedidos del sistema</p>
                  </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(orderStats?.totalRevenue || 0).toLocaleString("es-CO")}</div>
                    <p className="text-xs text-muted-foreground mt-1">Ventas acumuladas</p>
                  </CardContent>
                </Card>

                {/* Total Users */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userStats?.customers || 0} clientes, {userStats?.producers || 0} productores
                    </p>
                  </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orderStats?.pending || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideLineChart className="h-5 w-5" />
                    Estado de Pedidos
                  </CardTitle>
                  <CardDescription>Distribución de pedidos por estado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-800">{orderStats?.pending || 0}</div>
                      <div className="text-sm text-yellow-600">Pendientes</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-800">{orderStats?.processing || 0}</div>
                      <div className="text-sm text-blue-600">Procesando</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-800">{orderStats?.shipped || 0}</div>
                      <div className="text-sm text-purple-600">Enviados</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-800">{orderStats?.delivered || 0}</div>
                      <div className="text-sm text-green-600">Entregados</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-800">{orderStats?.cancelled || 0}</div>
                      <div className="text-sm text-red-600">Cancelados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Pedidos Recientes
                  </CardTitle>
                  <CardDescription>Últimos 10 pedidos realizados en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay pedidos recientes</div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="font-mono text-sm font-medium">{order.order_number}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(order.created_at).toLocaleDateString("es-CO")}
                              </span>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold">${(order.total || 0).toLocaleString("es-CO")}</div>
                              <div className="text-xs text-gray-500">{order.order_items?.length || 0} items</div>
                            </div>
                            <Link href={`/tracking/${order.order_number}`}>
                              <Button variant="outline" size="sm">
                                Ver Detalles
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Herramientas de administración del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/test-db" className="block">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                        <Database className="h-6 w-6" />
                        <span>Test Base de Datos</span>
                      </Button>
                    </Link>
                    <Link href="/catalog" className="block">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                        <Package className="h-6 w-6" />
                        <span>Ver Catálogo</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Management Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Gestión de Productos
                  </CardTitle>
                  <CardDescription>Administra el inventario y precios de productos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Low Stock Alert */}
                    {allProducts.filter((p) => p.stock < 5).length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Alerta de Stock Bajo</h4>
                          <p className="text-sm text-yellow-700">
                            {allProducts.filter((p) => p.stock < 5).length} productos con menos de 5 unidades
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Products Table */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.price?.toLocaleString("es-CO")}</TableCell>
                              <TableCell>
                                <span
                                  className={`font-semibold ${product.stock < 5 ? "text-red-600" : "text-green-600"}`}
                                >
                                  {product.stock}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                                  {product.stock > 0 ? "Disponible" : "Agotado"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingProduct(product)
                                    setEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Management Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Gestión de Pedidos
                  </CardTitle>
                  <CardDescription>Administra todos los pedidos del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="search">Buscar</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="search"
                            placeholder="Buscar por número de orden o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-48">
                        <Label htmlFor="status">Estado</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="shipped">Enviado</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Orders Table */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Número de Orden</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                              <TableCell>{new Date(order.created_at).toLocaleDateString("es-CO")}</TableCell>
                              <TableCell>{order.user_email || "N/A"}</TableCell>
                              <TableCell className="font-semibold">
                                ${(order.total || 0).toLocaleString("es-CO")}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                  disabled={updatingOrderId === order.id}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="processing">Procesando</SelectItem>
                                    <SelectItem value="shipped">Enviado</SelectItem>
                                    <SelectItem value="delivered">Entregado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                  </SelectContent>
                                </Select>
                                {updatingOrderId === order.id && (
                                  <span className="text-xs text-gray-500 mt-1">Actualizando...</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Link href={`/tracking/${order.order_number}`}>
                                  <Button variant="outline" size="sm">
                                    Ver Detalles
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {filteredOrders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No se encontraron pedidos con los filtros aplicados
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideLineChart className="h-5 w-5" />
                    Analíticas de Ventas
                  </CardTitle>
                  <CardDescription>Visualiza el rendimiento de ventas en el tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Sales Chart */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Ventas por Día (Últimos 7 días)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsLineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="sales" stroke="#8B4513" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Top Products */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={allProducts.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 5)}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales_count" fill="#8B4513" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Actualiza el stock y precio del producto</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Producto</Label>
                <p className="text-sm font-medium">{editingProduct.name}</p>
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProduct}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
