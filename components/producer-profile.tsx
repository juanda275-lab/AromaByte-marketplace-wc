"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Award, Coffee, Star, Calendar, Users, Leaf, Heart } from "lucide-react"

// Mock producer data
const producerData = {
  id: 1,
  name: "María Elena Rodríguez",
  farmName: "Finca El Paraíso",
  location: "Huila, Colombia",
  experience: "25 años",
  specialty: "Café de Altura",
  coverImage: "/coffee-farm-landscape.jpg",
  profileImage: "/maria-elena-producer.jpg",
  certifications: ["Orgánico", "Comercio Justo", "Rainforest Alliance", "UTZ Certified"],
  story: `María Elena es una productora de tercera generación que ha dedicado su vida al cultivo de café de alta calidad. 
  Su finca, ubicada en las montañas de Huila a 1,650 metros sobre el nivel del mar, se extiende por 15 hectáreas de 
  terreno volcánico rico en nutrientes.
  
  Desde pequeña, María Elena aprendió los secretos del café de su abuelo, quien estableció la finca en 1952. 
  Con el tiempo, ha combinado las técnicas tradicionales con métodos modernos y sostenibles, logrando un café 
  excepcional que respeta el medio ambiente y apoya a su comunidad.
  
  Su compromiso con la calidad se refleja en cada grano: desde la selección cuidadosa de las variedades Caturra y 
  Castillo, hasta el proceso de secado al sol en patios de concreto. María Elena también lidera un grupo de 
  mujeres caficultoras en su región, promoviendo la igualdad de género y el empoderamiento femenino en el sector cafetero.`,
  stats: {
    farmSize: "15 hectáreas",
    altitude: "1,650 msnm",
    varieties: "Caturra, Castillo",
    annualProduction: "120 sacos",
    employees: "8 trabajadores",
    foundedYear: "1952",
  },
  sustainabilityPractices: [
    "Agricultura orgánica certificada",
    "Conservación de agua y suelos",
    "Protección de la biodiversidad",
    "Energía solar para el procesamiento",
    "Compostaje de pulpa de café",
    "Reforestación con especies nativas",
  ],
}

const producerProducts = [
  {
    id: 1,
    name: "Café Huila Premium",
    origin: "Huila",
    price: 45000,
    rating: 4.8,
    reviews: 127,
    image: "/coffee-huila-premium.jpg",
    roastLevel: "Medio",
    isNew: true,
  },
  {
    id: 5,
    name: "Huila Especial Reserva",
    origin: "Huila",
    price: 58000,
    rating: 4.9,
    reviews: 89,
    image: "/coffee-huila-especial.jpg",
    roastLevel: "Suave",
    isLimited: true,
  },
  {
    id: 6,
    name: "Huila Orgánico",
    origin: "Huila",
    price: 52000,
    rating: 4.8,
    reviews: 156,
    image: "/coffee-huila-organico.jpg",
    roastLevel: "Medio",
    isOrganic: true,
  },
  {
    id: 7,
    name: "Huila Tradicional",
    origin: "Huila",
    price: 42000,
    rating: 4.7,
    reviews: 73,
    image: "/coffee-huila-tradicional.jpg",
    roastLevel: "Fuerte",
    isBestseller: true,
  },
  {
    id: 8,
    name: "Huila Micro Lote",
    origin: "Huila",
    price: 65000,
    rating: 4.9,
    reviews: 45,
    image: "/coffee-huila-micro-lote.jpg",
    roastLevel: "Suave",
    isLimited: true,
  },
  {
    id: 9,
    name: "Huila Honey Process",
    origin: "Huila",
    price: 55000,
    rating: 4.8,
    reviews: 92,
    image: "/coffee-huila-honey.jpg",
    roastLevel: "Medio",
    isNew: true,
  },
]

interface ProducerProfileProps {
  producerId: string
}

export function ProducerProfile({ producerId }: ProducerProfileProps) {
  const producer = producerData // In a real app, fetch by producerId

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={producer.coverImage || "/placeholder.svg"}
          alt={`${producer.farmName} - Finca de café`}
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

        {/* Producer Info Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl mb-2">{producer.farmName}</h1>
          <div className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            <span>{producer.location}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Producer Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Producer Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={producer.profileImage || "/placeholder.svg"}
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

                <div className="flex flex-wrap gap-2">
                  {producer.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="bg-coffee-primary/10 text-coffee-primary">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
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
        </div>

        {/* Our Story Section */}
        <div className="mb-12">
          <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-6">Nuestra Historia</h2>
          <div className="prose prose-lg max-w-none">
            {producer.story.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-pretty">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>

        {/* Sustainability Practices */}
        <div className="mb-12">
          <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-6">Prácticas Sostenibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {producer.sustainabilityPractices.map((practice, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-coffee-beige rounded-lg">
                <Leaf className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-coffee-primary">{practice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Producer's Products */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="font-poppins font-bold text-2xl text-coffee-primary mb-2">Productos de {producer.name}</h2>
              <p className="text-muted-foreground">Descubre todos los cafés de esta finca excepcional</p>
            </div>
            <Button asChild variant="outline" className="border-coffee-primary text-coffee-primary bg-transparent">
              <Link href="/catalog">Ver Más Productos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {producerProducts.map((product) => (
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
                      <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
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
                    <Link href={`/product/${product.id}`}>Ver Detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
