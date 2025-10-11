import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    customer: "María González",
    product: "Café Huila Premium",
    quantity: 2,
    total: 90000,
    status: "pending",
    date: "2025-01-06",
  },
  {
    id: "ORD-002",
    customer: "Carlos Ramírez",
    product: "Café Nariño Especial",
    quantity: 1,
    total: 48000,
    status: "processing",
    date: "2025-01-05",
  },
  {
    id: "ORD-003",
    customer: "Ana Martínez",
    product: "Café Huila Premium",
    quantity: 3,
    total: 135000,
    status: "shipped",
    date: "2025-01-04",
  },
  {
    id: "ORD-004",
    customer: "Luis Hernández",
    product: "Café Huila Premium",
    quantity: 1,
    total: 45000,
    status: "delivered",
    date: "2025-01-03",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "En Proceso", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: TrendingUp },
  delivered: { label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function ProducerDashboard() {
  const pendingOrders = mockOrders.filter((order) => order.status === "pending").length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Productor</h1>
          <p className="text-muted-foreground">Gestiona tus pedidos y ventas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockOrders.length}</div>
              <p className="text-xs text-muted-foreground">En los últimos 7 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString("es-CO")}</div>
              <p className="text-xs text-muted-foreground">Comisión del 15% aplicada</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Gestiona el estado de tus pedidos y prepara los envíos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
                return (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2 md:space-y-0">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="md:ml-8">
                        <p className="text-sm text-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {order.quantity} | Fecha: {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${order.total.toLocaleString("es-CO")}</p>
                        <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                          {statusConfig[order.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>

                      {order.status === "pending" && (
                        <Button size="sm" className="bg-[#6F4E37] hover:bg-[#5a3d2b]">
                          Procesar
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button size="sm" className="bg-[#6F4E37] hover:bg-[#5a3d2b]">
                          Marcar Enviado
                        </Button>
                      )}
                      {(order.status === "shipped" || order.status === "delivered") && (
                        <Button size="sm" variant="outline">
                          Ver Detalles
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
