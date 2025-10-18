"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, UserIcon, Plus, Edit, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Producer {
  id: number
  name: string
  region: string
  specialty: string
  description: string
  image_url: string
  certification: string
  rating: number
  total_reviews: number
}

interface Product {
  id: number
  name: string
  description: string
  origin: string
  region: string
  price: number
  stock: number
  image_url: string
  roast_level: string
  altitude: string
  process_method: string
  is_featured: boolean
  is_organic: boolean
}

export default function ProducerDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showProducerForm, setShowProducerForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user && profile?.role !== "producer") {
      if (profile?.role === "customer") {
        router.push("/dashboard/customer")
      } else if (profile?.role === "admin") {
        router.push("/test-db")
      }
    }
  }, [user, profile, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchProducerData()
    }
  }, [user])

  const fetchProducerData = async () => {
    try {
      const supabase = createClient()

      // Fetch producer profile
      const { data: producerData, error: producerError } = await supabase
        .from("producers")
        .select("*")
        .eq("user_id", user?.id)
        .single()

      if (producerError && producerError.code !== "PGRST116") {
        console.error("[v0] Error fetching producer:", producerError)
      } else if (producerData) {
        setProducer(producerData)

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("producer_id", producerData.id)
          .order("created_at", { ascending: false })

        if (productsError) {
          console.error("[v0] Error fetching products:", productsError)
        } else {
          setProducts(productsData || [])
        }
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProducerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const producerData = {
      user_id: user?.id,
      name: formData.get("name") as string,
      region: formData.get("region") as string,
      specialty: formData.get("specialty") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      certification: formData.get("certification") as string,
    }

    try {
      const supabase = createClient()

      if (producer) {
        // Update existing producer
        const { error } = await supabase.from("producers").update(producerData).eq("id", producer.id)

        if (error) throw error
        setSuccess("Perfil de productor actualizado exitosamente")
      } else {
        // Create new producer
        const { error } = await supabase.from("producers").insert(producerData)

        if (error) throw error
        setSuccess("Perfil de productor creado exitosamente")
      }

      setShowProducerForm(false)
      fetchProducerData()
    } catch (error: any) {
      console.error("[v0] Error saving producer:", error)
      setError(error.message || "Error al guardar el perfil")
    }
  }

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!producer) {
      setError("Debes crear tu perfil de productor primero")
      return
    }

    const formData = new FormData(e.currentTarget)
    const flavorNotes = (formData.get("flavor_notes") as string).split(",").map((note) => note.trim())

    const productData = {
      producer_id: producer.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      origin: formData.get("origin") as string,
      region: formData.get("region") as string,
      price: Number.parseInt(formData.get("price") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      image_url: formData.get("image_url") as string,
      roast_level: formData.get("roast_level") as string,
      flavor_notes: flavorNotes,
      altitude: formData.get("altitude") as string,
      process_method: formData.get("process_method") as string,
      is_organic: formData.get("is_organic") === "true",
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").insert(productData)

      if (error) throw error

      setSuccess("Producto agregado exitosamente")
      setShowProductForm(false)
      fetchProducerData()
    } catch (error: any) {
      console.error("[v0] Error saving product:", error)
      setError(error.message || "Error al guardar el producto")
    }
  }

  if (authLoading || loading) {
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
            <h1 className="text-3xl font-bold text-coffee-primary mb-2">Dashboard de Productor</h1>
            <p className="text-gray-600">Gestiona tu perfil y productos</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Mi Perfil
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Mis Productos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              {!producer && !showProducerForm ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Crea tu perfil de productor</h3>
                    <p className="text-gray-500 mb-4 text-center max-w-md">
                      Cuéntale al mundo tu historia y comparte tu pasión por el café colombiano
                    </p>
                    <Button
                      onClick={() => setShowProducerForm(true)}
                      className="bg-coffee-primary hover:bg-coffee-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Perfil
                    </Button>
                  </CardContent>
                </Card>
              ) : showProducerForm || !producer ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{producer ? "Editar Perfil" : "Crear Perfil de Productor"}</CardTitle>
                    <CardDescription>Completa la información sobre tu finca y tu café</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProducerSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre del Productor / Finca *</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={producer?.name}
                            placeholder="Ej: Finca La Esperanza"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="region">Región *</Label>
                          <Input
                            id="region"
                            name="region"
                            defaultValue={producer?.region}
                            placeholder="Ej: Huila"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialty">Especialidad *</Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          defaultValue={producer?.specialty}
                          placeholder="Ej: Café de Altura"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Tu Historia *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={producer?.description}
                          placeholder="Cuéntanos sobre tu finca, tu proceso y tu pasión por el café..."
                          rows={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_url">Imagen del Productor (Opcional)</Label>
                        <Input
                          id="image_url"
                          name="image_url"
                          defaultValue={producer?.image_url || "/lush-coffee-farm.png"}
                          placeholder="/lush-coffee-farm.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Deja el valor por defecto para usar una imagen de placeholder, o ingresa tu propia URL
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="certification">Certificaciones</Label>
                        <Input
                          id="certification"
                          name="certification"
                          defaultValue={producer?.certification}
                          placeholder="Ej: Orgánico, Fair Trade, Rainforest Alliance"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-coffee-primary hover:bg-coffee-secondary">
                          {producer ? "Actualizar Perfil" : "Crear Perfil"}
                        </Button>
                        {producer && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowProducerForm(false)}
                            className="bg-transparent"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{producer.name}</CardTitle>
                        <CardDescription className="mt-2">
                          <Badge variant="secondary">{producer.specialty}</Badge>
                          <span className="ml-2 text-sm">{producer.region}</span>
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowProducerForm(true)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {producer.image_url && (
                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                          <Image
                            src={producer.image_url || "/placeholder.svg"}
                            alt={producer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-coffee-primary mb-2">Mi Historia</h4>
                        <p className="text-gray-700">{producer.description}</p>
                      </div>
                      {producer.certification && (
                        <div>
                          <h4 className="font-semibold text-coffee-primary mb-2">Certificaciones</h4>
                          <p className="text-gray-700">{producer.certification}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⭐ {producer.rating.toFixed(1)} / 5.0</span>
                        <span>({producer.total_reviews} reseñas)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-coffee-primary">Mis Productos ({products.length})</h2>
                <Button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="bg-coffee-primary hover:bg-coffee-secondary"
                  disabled={!producer}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {!producer && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-16 w-16 text-yellow-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Crea tu perfil primero</h3>
                    <p className="text-gray-500 mb-4">
                      Necesitas crear tu perfil de productor antes de agregar productos
                    </p>
                  </CardContent>
                </Card>
              )}

              {showProductForm && producer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Agregar Nuevo Producto</CardTitle>
                    <CardDescription>Completa la información de tu café</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="product_name">Nombre del Producto *</Label>
                          <Input id="product_name" name="name" placeholder="Ej: Café Huila Premium" required />
                        </div>
                        <div>
                          <Label htmlFor="origin">Origen *</Label>
                          <Input id="origin" name="origin" placeholder="Ej: San Agustín, Huila" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="product_description">Descripción *</Label>
                        <Textarea
                          id="product_description"
                          name="description"
                          placeholder="Describe las características de tu café..."
                          rows={3}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Precio (COP) *</Label>
                          <Input id="price" name="price" type="number" placeholder="25000" required />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock *</Label>
                          <Input id="stock" name="stock" type="number" placeholder="100" required />
                        </div>
                        <div>
                          <Label htmlFor="product_region">Región *</Label>
                          <Input id="product_region" name="region" placeholder="Huila" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="roast_level">Nivel de Tueste *</Label>
                          <Select name="roast_level" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el nivel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Claro</SelectItem>
                              <SelectItem value="medium">Medio</SelectItem>
                              <SelectItem value="dark">Oscuro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="process_method">Método de Proceso *</Label>
                          <Input id="process_method" name="process_method" placeholder="Ej: Lavado" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="altitude">Altitud *</Label>
                          <Input id="altitude" name="altitude" placeholder="Ej: 1800-2000 msnm" required />
                        </div>
                        <div>
                          <Label htmlFor="is_organic">¿Es Orgánico? *</Label>
                          <Select name="is_organic" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Sí</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="flavor_notes">Notas de Sabor (separadas por comas) *</Label>
                        <Input
                          id="flavor_notes"
                          name="flavor_notes"
                          placeholder="Ej: Chocolate, Caramelo, Nuez"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="product_image_url">Imagen del Producto (Opcional)</Label>
                        <Input
                          id="product_image_url"
                          name="image_url"
                          defaultValue="/rustic-coffee-bag.png"
                          placeholder="/rustic-coffee-bag.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Deja el valor por defecto para usar una imagen de placeholder
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-coffee-primary hover:bg-coffee-secondary">
                          Agregar Producto
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProductForm(false)}
                          className="bg-transparent"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {products.length === 0 && producer && !showProductForm ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No tienes productos aún</h3>
                    <p className="text-gray-500 mb-4">Agrega tu primer producto al catálogo</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-coffee-primary mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-coffee-primary">
                            ${product.price.toLocaleString("es-CO")}
                          </span>
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>Stock: {product.stock}</Badge>
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
