"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Award, Coffee, Star, Calendar, Users, Leaf, Heart } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface ProducerProfileProps {
  producerId: string
}

export function ProducerProfile({ producerId }: ProducerProfileProps) {
  const [producer, setProducer] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducerData = async () => {
      try {
        setLoading(true)
        console.log("🧠 Buscando productor y productos relacionados...")

        // 🔹 Obtener productor por ID
        const { data: producerData, error: producerError } = await supabase
          .from("producers")
          .select("*")
          .eq("id", producerId)
          .single()

        if (producerError) throw producerError
        setProducer(producerData)

        // 🔹 Obtener productos relacionados (campo JSONB "producer")
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .filter("producer->>id", "eq", producerId.toString()) // ✅ Buscar dentro del JSONB

        if (productsError) throw productsError

        console.log("✅ Productos obtenidos:", productsData)
        setProducts(productsData || [])
      } catch (err) {
        console.error("❌ Error cargando datos del productor:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducerData()
  }, [producerId])

  console.log("🧩 Productos en render:", products)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Cargando información del productor...</p>
      </div>
    )
  }

  if (!producer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-coffee-primary mb-4">Productor no encontrado</h1>
        <Button asChild>
          <Link href="/producers">Ver Todos los Productores</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={producer.cover_image || "/placeholder.svg?height=400&width=1200&query=coffee farm landscape"}
          alt={`${producer.farm_name} - Finca de café`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Breadcrumb */}
        <nav className="absolute top-4 left-4 flex items-center space-x-2 text-sm text-white">
          <Link href="/" className="hover:text-coffee-beige">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/producers" className="hover:text-coffee-beige">
            Productores
          </Link>
          <span>/</span>
          <span className="text-coffee-beige">{producer.name}</span>
        </nav>

        {/* Overlay Info */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl mb-2">{producer.farm_name}</h1>
          <div className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            <span>{producer.location}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Producer Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={producer.profile_image || "/placeholder.svg?height=128&width=128&query=coffee producer"}
                    alt={producer.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-coffee-primary/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-coffee-primary text-white rounded-full p-3">
                    <Coffee className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-2">{producer.name}</h2>
                  <p className="text-lg text-coffee-secondary font-medium">{producer.specialty}</p>
                </div>

                {producer.stats && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-coffee-primary" />
                      <span>
                        <strong>Experiencia:</strong> {producer.experience}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-coffee-primary" />
                      <span>
                        <strong>Empleados:</strong> {producer.stats.employees}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-coffee-primary" />
                      <span>
                        <strong>Finca:</strong> {producer.stats.farmSize}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-coffee-primary" />
                      <span>
                        <strong>Producción:</strong> {producer.stats.annualProduction}
                      </span>
                    </div>
                  </div>
                )}

                {producer.certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {producer.certifications.map((cert: string) => (
                      <Badge key={cert} variant="secondary" className="bg-coffee-primary/10 text-coffee-primary">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {producer.stats && (
            <div className="space-y-4">
              <Card className="border-coffee-light">
                <CardContent className="p-6">
                  <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-4">Datos de la Finca</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fundada:</span>
                      <span className="font-medium">{producer.stats.foundedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Altitud:</span>
                      <span className="font-medium">{producer.stats.altitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variedades:</span>
                      <span className="font-medium">{producer.stats.varieties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Área:</span>
                      <span className="font-medium">{producer.stats.farmSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                <Heart className="h-4 w-4 mr-2" />
                Seguir Productor
              </Button>
            </div>
          )}
        </div>

        {/* Story */}
        {producer.story && (
          <div className="mb-12">
            <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-6">
              Nuestra Historia
            </h2>
            <div className="prose prose-lg max-w-none">
              {producer.story
                .replace(/\\n/g, "\n") // 🔥 Convierte "\n" en saltos reales
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-muted-foreground leading-relaxed mb-4 text-pretty"
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Sustainability */}
        {producer.sustainability_practices?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-6">Prácticas Sostenibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {producer.sustainability_practices.map((practice: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-coffee-beige rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-coffee-primary">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products.length > 0 ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-2">
                  Productos de {producer.name}
                </h2>
                <p className="text-muted-foreground">Descubre todos los cafés de esta finca excepcional</p>
              </div>
              <Button asChild variant="outline" className="border-coffee-primary text-coffee-primary bg-transparent">
                <Link href="/catalog">Ver Más Productos</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-coffee-light">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.images?.[0] || "/placeholder.svg?height=200&width=300&query=coffee bag"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.badges?.map((badge: string) => (
                          <Badge key={badge} className="bg-accent text-white">
                            {badge}
                          </Badge>
                        ))}
                      </div>
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
                          ${product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">{product.weight}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                      <Link href={`/product/${product.id}`}>Ver Detalles</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            <p>Este productor aún no tiene productos publicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}