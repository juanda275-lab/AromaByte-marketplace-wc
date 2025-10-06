import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const featuredProducts = [
  {
    id: 1,
    name: "Café Huila Premium",
    origin: "Huila",
    price: 45000,
    rating: 4.8,
    image: "/huila-coffee-bag.jpg",
    roastLevel: "Medio",
    isNew: true,
  },
  {
    id: 2,
    name: "Nariño Especial",
    origin: "Nariño",
    price: 52000,
    rating: 4.9,
    image: "/narino-coffee-bag.jpg",
    roastLevel: "Suave",
    isBestseller: true,
  },
  {
    id: 3,
    name: "Eje Cafetero Clásico",
    origin: "Eje Cafetero",
    price: 38000,
    rating: 4.7,
    image: "/eje-cafetero-coffee-bag.jpg",
    roastLevel: "Fuerte",
    isOrganic: true,
  },
  {
    id: 4,
    name: "Tolima Gourmet",
    origin: "Tolima",
    price: 48000,
    rating: 4.8,
    image: "/tolima-coffee-bag.jpg",
    roastLevel: "Medio",
    isLimited: true,
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-coffee-primary mb-4">Productos Destacados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubre nuestra selección de cafés premium, cuidadosamente elegidos por su calidad excepcional y sabores
            únicos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-coffee-light">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && <Badge className="bg-accent text-white">Nuevo</Badge>}
                    {product.isBestseller && <Badge className="bg-coffee-primary text-white">Más Vendido</Badge>}
                    {product.isOrganic && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Orgánico
                      </Badge>
                    )}
                    {product.isLimited && <Badge variant="destructive">Edición Limitada</Badge>}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-poppins font-semibold text-lg text-coffee-primary">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.origin} • {product.roastLevel}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">(127 reseñas)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-xl text-coffee-primary">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">250g</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-coffee-primary hover:bg-coffee-secondary">
                  <Link href={`/product/${product.id}`}>Ver más</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white bg-transparent"
          >
            <Link href="/catalog">Ver Todo el Catálogo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
