"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { productsData, type Product } from "@/lib/products-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, SearchIcon } from "lucide-react"
import Image from "next/image"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      const results = productsData.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.origin.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tastingNotes.some((note) => note.toLowerCase().includes(searchTerm)) ||
          product.roastLevel.toLowerCase().includes(searchTerm) ||
          product.producer.name.toLowerCase().includes(searchTerm)
        )
      })
      setFilteredProducts(results)
    } else {
      setFilteredProducts([])
    }
  }, [query])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream/30 via-white to-cream/20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <SearchIcon className="h-8 w-8 text-coffee-primary" />
              <h1 className="text-4xl font-bold text-coffee-primary">Resultados de Búsqueda</h1>
            </div>
            <p className="text-lg text-coffee-medium">
              {query ? (
                <>
                  Buscando: <span className="font-semibold text-coffee-primary">&quot;{query}&quot;</span>
                </>
              ) : (
                "Ingresa un término de búsqueda"
              )}
            </p>
            {query && (
              <p className="text-coffee-medium mt-2">
                {filteredProducts.length === 0
                  ? "No se encontraron productos"
                  : `${filteredProducts.length} ${filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}`}
              </p>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-coffee-light/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
                >
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-cream/50 to-coffee-light/10">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-4 right-4 bg-coffee-primary text-white font-bold shadow-lg">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-coffee-primary mb-1 group-hover:text-coffee-secondary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-coffee-medium flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-coffee-primary"></span>
                        {product.origin}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-semibold text-coffee-primary">{product.rating}</span>
                      </div>
                      <span className="text-xs text-coffee-medium">({product.reviews} reseñas)</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.tastingNotes.slice(0, 3).map((note, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-cream/80 text-coffee-primary border border-coffee-light/30"
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-coffee-primary">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-coffee-medium line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border-coffee-primary/30 text-coffee-primary bg-cream/50"
                      >
                        {product.roastLevel}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/product/${product.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white transition-all duration-300 bg-transparent"
                        >
                          Ver Más
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        className="bg-gradient-to-r from-coffee-primary to-coffee-secondary hover:from-coffee-secondary hover:to-coffee-primary text-white transition-all duration-300 shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <SearchIcon className="h-24 w-24 text-coffee-light mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-coffee-primary mb-3">No se encontraron resultados</h2>
                <p className="text-coffee-medium mb-6">
                  No encontramos productos que coincidan con &quot;{query}&quot;. Intenta con otros términos de
                  búsqueda.
                </p>
                <Link href="/catalog">
                  <Button className="bg-gradient-to-r from-coffee-primary to-coffee-secondary hover:from-coffee-secondary hover:to-coffee-primary text-white">
                    Ver Todo el Catálogo
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-24 w-24 text-coffee-light mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-coffee-primary mb-3">Comienza tu búsqueda</h2>
              <p className="text-coffee-medium">Usa la barra de búsqueda para encontrar tu café ideal</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-cream/30 via-white to-cream/20">
          <Header />
          <main className="container mx-auto px-4 py-12">
            <div className="text-center">
              <p className="text-coffee-medium">Cargando resultados...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
