"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Star, Filter, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"

interface Product {
  id: number
  name: string
  origin: string
  price: number
  original_price?: number
  rating: number
  reviews: number
  roast_level: string
  tasting_notes: string[]
  description: string
  images: string[]
  in_stock: boolean
  stock_count: number
  producer_id?: number
}

export function ProductCatalog() {
  const { addItem } = useCart()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [priceRange, setPriceRange] = useState([30000, 60000])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [selectedRoastLevels, setSelectedRoastLevels] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const itemsPerPage = 6

  // 🧩 Fetch de productos desde Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("products").select("*")
      if (error) console.error("Error al cargar productos:", error)
      else setProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Filtrado local
  const filteredProducts = products.filter((product) => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesOrigin =
      selectedOrigins.length === 0 || selectedOrigins.includes(product.origin)
    const matchesRoast =
      selectedRoastLevels.length === 0 || selectedRoastLevels.includes(product.roast_level)

    return inPriceRange && matchesOrigin && matchesRoast
  })

  // Ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = sortedProducts.slice(startIndex, endIndex)

  const origins = ["Nariño", "Huila", "Eje Cafetero", "Tolima", "Cauca", "Santander", "Valle del Cauca", "Boyacá"]
  const roastLevels = ["Suave", "Medio", "Fuerte"]

  const handleOriginChange = (origin: string, checked: boolean) => {
    setSelectedOrigins((prev) =>
      checked ? [...prev, origin] : prev.filter((o) => o !== origin)
    )
  }

  const handleRoastLevelChange = (level: string, checked: boolean) => {
    setSelectedRoastLevels((prev) =>
      checked ? [...prev, level] : prev.filter((l) => l !== level)
    )
  }

  const handleAddToCart = (product: Product) => {
    addItem(product.id, 1)
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
      duration: 2000,
    })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Origin Filter */}
      <div>
        <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-4">Origen</h3>
        <div className="space-y-3">
          {origins.map((origin) => (
            <div key={origin} className="flex items-center space-x-2">
              <Checkbox
                id={`origin-${origin}`}
                checked={selectedOrigins.includes(origin)}
                onCheckedChange={(checked) => handleOriginChange(origin, checked as boolean)}
              />
              <label htmlFor={`origin-${origin}`} className="text-sm text-foreground cursor-pointer">
                {origin}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-4">Rango de Precio</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={60000}
            min={30000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Roast Level Filter */}
      <div>
        <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-4">Nivel de Tueste</h3>
        <div className="space-y-3">
          {roastLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`roast-${level}`}
                checked={selectedRoastLevels.includes(level)}
                onCheckedChange={(checked) => handleRoastLevelChange(level, checked as boolean)}
              />
              <label htmlFor={`roast-${level}`} className="text-sm text-foreground cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="py-16 text-center text-coffee-primary font-semibold text-lg">
        Cargando productos...
      </div>
    )
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins font-bold text-3xl lg:text-4xl text-coffee-primary mb-4">Catálogo de Café</h1>
          <p className="text-lg text-muted-foreground">
            Descubre nuestra selección completa de cafés colombianos premium
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-coffee-beige rounded-lg p-6">
              <h2 className="font-poppins font-bold text-xl text-coffee-primary mb-6">Filtros</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="mt-8">
                  <h2 className="font-poppins font-bold text-xl text-coffee-primary mb-6">Filtros</h2>
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 🧱 Main Content */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
              </p>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Calificación</SelectItem>
                  <SelectItem value="newest">Más Recientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {currentProducts.length === 0 ? (
              <p className="text-center text-muted-foreground">No se encontraron productos.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {currentProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-coffee-light">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-poppins font-semibold text-lg text-coffee-primary">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.origin} • {product.roast_level}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-poppins font-bold text-xl text-coffee-primary">
                            ${product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white bg-transparent"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Agregar al Carrito
                      </Button>
                      <Button asChild className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                        <Link href={`/product/${product.id}`}>Ver Detalles</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-coffee-primary hover:bg-coffee-secondary" : ""}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}