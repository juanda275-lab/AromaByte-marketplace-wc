"use client"

import { useState } from "react"
import { Bell, Package, Truck, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const mockNotifications = [
  {
    id: 1,
    type: "pickup",
    title: "Recolección Programada",
    message: "Tu pedido ORD-001 será recolectado mañana a las 10:00 AM",
    time: "Hace 5 minutos",
    read: false,
    icon: Truck,
  },
  {
    id: 2,
    type: "order",
    title: "Nuevo Pedido",
    message: "Tienes un nuevo pedido de María González por $90,000",
    time: "Hace 1 hora",
    read: false,
    icon: Package,
  },
  {
    id: 3,
    type: "delivered",
    title: "Pedido Entregado",
    message: "El pedido ORD-003 ha sido entregado exitosamente",
    time: "Hace 2 horas",
    read: true,
    icon: CheckCircle,
  },
]

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full p-3"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg border border-white/20 animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 z-[100] shadow-2xl border-coffee-light/20">
        <div className="flex items-center justify-between px-4 py-3 border-b border-coffee-light/20 bg-gradient-to-r from-coffee-primary/5 to-coffee-secondary/5">
          <h3 className="font-semibold text-coffee-primary">Notificaciones</h3>
          {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} nuevas</Badge>}
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-coffee-primary/5 transition-colors ${
                    !notification.read ? "bg-coffee-primary/10 border-l-4 border-coffee-primary" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "pickup"
                        ? "bg-blue-100"
                        : notification.type === "order"
                          ? "bg-green-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        notification.type === "pickup"
                          ? "text-blue-600"
                          : notification.type === "order"
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-coffee-primary">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              )
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
