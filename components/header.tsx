"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, LogOut, Package, Heart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { NotificationsPanel } from "@/components/notifications-panel"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { user, profile, signOut } = useAuth()
  const cartCount = getTotalItems()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalog" },
    { name: "Productores", href: "/producers" },
    { name: "Nosotros", href: "/about" },
  ]

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getDashboardRoute = () => {
    if (!profile) return "/login"
    if (profile.role === "admin") return "/dashboard/admin"
    if (profile.role === "producer") return "/dashboard/producer"
    return "/dashboard/customer"
  }

  const getUserInitials = () => {
    if (!profile?.full_name) return "U"
    const names = profile.full_name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return profile.full_name[0].toUpperCase()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-coffee-light/20 bg-gradient-to-r from-white via-cream/30 to-white backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/aromabyte-logo.png"
                alt="AromaByte Logo"
                width={220}
                height={80}
                className="h-18 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-base font-semibold text-coffee-primary hover:text-coffee-secondary transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coffee-secondary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-primary/60 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar café premium..."
                className="pl-12 pr-4 py-3 bg-cream/50 border-coffee-light/30 rounded-full focus:ring-2 focus:ring-coffee-primary/20 focus:border-coffee-primary transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/contact">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-2 text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full px-4 py-2"
              >
                <span className="font-medium">Contacto</span>
              </Button>
            </Link>

            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center space-x-2 text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full px-3 py-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-coffee-primary text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{profile.full_name || "Usuario"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                      <p className="text-xs text-coffee-primary font-semibold capitalize">{profile.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardRoute())}>
                    {profile.role === "admin" ? (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Panel Admin</span>
                      </>
                    ) : profile.role === "producer" ? (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Mi Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Mis Pedidos</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full px-4 py-2"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Ingresar</span>
                </Button>
              </Link>
            )}

            <div className="hidden sm:block">
              <NotificationsPanel />
            </div>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full p-3"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coffee-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg border border-white/20">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-coffee-primary hover:text-coffee-secondary hover:bg-coffee-primary/5 transition-all duration-300 rounded-full p-3"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-gradient-to-b from-white to-cream/30">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="text-center pb-4 border-b border-coffee-light/20">
                    <Image
                      src="/aromabyte-logo.png"
                      alt="AromaByte Logo"
                      width={150}
                      height={50}
                      className="h-12 w-auto mx-auto"
                    />
                  </div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-semibold text-coffee-primary hover:text-coffee-secondary transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-coffee-primary/5"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    className="text-lg font-semibold text-coffee-primary hover:text-coffee-secondary transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-coffee-primary/5"
                    onClick={() => setIsOpen(false)}
                  >
                    Contacto
                  </Link>
                  <div className="pt-4 border-t border-coffee-light/20 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-primary/60 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Buscar café..."
                        className="pl-12 bg-cream/50 border-coffee-light/30 rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                      />
                    </div>
                    {user && profile ? (
                      <>
                        <div className="p-4 bg-cream/50 rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-coffee-primary text-white">
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-coffee-primary">{profile.full_name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              router.push(getDashboardRoute())
                              setIsOpen(false)
                            }}
                            className="w-full mb-2 bg-coffee-primary hover:bg-coffee-secondary"
                          >
                            {profile.role === "admin"
                              ? "Panel Admin"
                              : profile.role === "producer"
                                ? "Mi Dashboard"
                                : "Mis Pedidos"}
                          </Button>
                          <Button
                            onClick={handleSignOut}
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-coffee-primary to-coffee-secondary hover:from-coffee-secondary hover:to-coffee-primary text-white font-semibold py-2.5 rounded-full transition-all duration-300 shadow-lg">
                          <User className="h-4 w-4 mr-2" />
                          Ingresar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
