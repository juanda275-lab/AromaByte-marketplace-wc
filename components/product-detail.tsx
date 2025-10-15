"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  MapPin,
  Award,
  Coffee,
} from "lucide-react"
import { getProductById, getRelatedProducts } from "@/lib/products-data"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  // 🔄 Cargar producto desde Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const p = await getProductById(Number(productId))
      setProduct(p)
      if (p) {
        const related = await getRelatedProducts(p.id, 4)
        setRelatedProducts(related)
      }
      setLoading(false)
    }
    loadData()
  }, [productId])

  const handleQuantityChange = (change: number) => {
    if (!product) return
    setQuantity(Math.max(1, Math.min(product.stockCount, quantity + change)))
  }

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addItem(product.id, quantity)
      setQuantity(1)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins font-bold text-3xl text-coffee-primary mb-4">
            Cargando producto...
          </h1>
          <p className="text-muted-foreground">Por favor espera un momento.</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-poppins font-bold text-3xl text-coffee-primary mb-4">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild className="bg-coffee-primary hover:bg-coffee-secondary">
            <Link href="/catalog">Ver Catálogo</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-coffee-primary">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-coffee-primary">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-coffee-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-coffee-beige">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-coffee-primary"
                        : "border-coffee-light"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-poppins font-bold text-3xl text-coffee-primary mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.origin} • {product.roastLevel}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviews} reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-poppins font-bold text-3xl text-coffee-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Tasting Notes */}
            <div>
              <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-3">
                Notas de Cata
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note: string) => (
                  <Badge
                    key={note}
                    variant="secondary"
                    className="bg-coffee-beige text-coffee-primary"
                  >
                    {note}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={product.inStock ? "text-green-700" : "text-red-700"}
              >
                {product.inStock
                  ? `En stock (${product.stockCount} disponibles)`
                  : "Agotado"}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border border-coffee-light rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-coffee-primary hover:bg-coffee-secondary"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : ""
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <Card className="border-coffee-light">
                <CardContent className="p-4">
                  <h3 className="font-poppins font-semibold text-lg text-coffee-primary mb-3">
                    Especificaciones
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Peso:</span>
                      <span className="font-medium">
                        {product.specifications.weight}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Altitud:</span>
                      <span className="font-medium">
                        {product.specifications.altitude}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proceso:</span>
                      <span className="font-medium">
                        {product.specifications.process}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variedad:</span>
                      <span className="font-medium">
                        {product.specifications.variety}
                      </span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-muted-foreground">Cosecha:</span>
                      <span className="font-medium">
                        {product.specifications.harvest}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Producer Profile Section */}
        {product.producer && (
          <div className="mb-16">
            <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-8 text-center">
              Conoce al Productor
            </h2>
            <Card className="border-coffee-light">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={product.producer.image || "/placeholder.svg"}
                        alt={product.producer.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-coffee-primary/20"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-coffee-primary text-white rounded-full p-2">
                        <Coffee className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-poppins font-bold text-xl text-coffee-primary mb-1">
                      {product.producer.name}
                    </h3>
                    <p className="text-coffee-secondary font-medium mb-2">
                      {product.producer.farmName}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{product.producer.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Experiencia:</strong>{" "}
                      {product.producer.experience}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-poppins font-semibold text-lg text-coffee-primary mb-3">
                        Nuestra Historia
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.producer.story}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-poppins font-semibold text-lg text-coffee-primary mb-3">
                        Certificaciones
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.producer.certifications.map((cert: string) => (
                          <Badge
                            key={cert}
                            variant="secondary"
                            className="bg-coffee-primary/10 text-coffee-primary"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      asChild
                      className="bg-coffee-primary hover:bg-coffee-secondary"
                    >
                      <Link href={`/producer/${product.producer.id}`}>
                        Ver Perfil Completo
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-8 text-center">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group hover:shadow-lg transition-all duration-300 border-coffee-light"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-poppins font-semibold text-lg text-coffee-primary">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {relatedProduct.origin}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {relatedProduct.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins font-bold text-xl text-coffee-primary">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-coffee-primary hover:bg-coffee-secondary"
                      >
                        <Link href={`/product/${relatedProduct.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}