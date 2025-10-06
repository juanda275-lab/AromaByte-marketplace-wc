"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Award, Users, Coffee } from "lucide-react"

const producers = [
  {
    id: "maria-gonzalez",
    name: "María González",
    farm: "Finca El Paraíso",
    region: "Huila",
    image: "/maria-gonzalez-producer.jpg",
    certifications: ["Orgánico", "Comercio Justo", "Rainforest Alliance"],
    experience: "25 años",
    altitude: "1,800 msnm",
    varieties: ["Caturra", "Colombia", "Castillo"],
    description:
      "Productora de tercera generación dedicada al cultivo sostenible de café especial en las montañas del Huila.",
    products: 3,
  },
  {
    id: "carlos-rodriguez",
    name: "Carlos Rodríguez",
    farm: "Hacienda San José",
    region: "Nariño",
    image: "/carlos-rodriguez-producer.jpg",
    certifications: ["Orgánico", "UTZ"],
    experience: "30 años",
    altitude: "2,100 msnm",
    varieties: ["Geisha", "Bourbon", "Typica"],
    description: "Pionero en técnicas de fermentación controlada y procesamiento experimental en Nariño.",
    products: 4,
  },
  {
    id: "ana-martinez",
    name: "Ana Martínez",
    farm: "Finca La Esperanza",
    region: "Eje Cafetero",
    image: "/ana-martinez-producer.jpg",
    certifications: ["Comercio Justo", "Rainforest Alliance"],
    experience: "20 años",
    altitude: "1,650 msnm",
    varieties: ["Caturra", "Colombia"],
    description: "Líder en su comunidad, promueve prácticas agrícolas sostenibles y empoderamiento femenino.",
    products: 2,
  },
  {
    id: "diego-herrera",
    name: "Diego Herrera",
    farm: "Finca Los Andes",
    region: "Cauca",
    image: "/diego-herrera-producer.jpg",
    certifications: ["Orgánico", "Bird Friendly"],
    experience: "15 años",
    altitude: "1,950 msnm",
    varieties: ["Geisha", "Pink Bourbon", "Java"],
    description: "Joven productor innovador especializado en variedades exóticas y métodos de procesamiento únicos.",
    products: 5,
  },
  {
    id: "lucia-torres",
    name: "Lucía Torres",
    farm: "Finca El Mirador",
    region: "Tolima",
    image: "/lucia-torres-producer.jpg",
    certifications: ["Orgánico", "Comercio Justo"],
    experience: "22 años",
    altitude: "1,750 msnm",
    varieties: ["Caturra", "Castillo", "Colombia"],
    description: "Experta en café de altura con enfoque en la conservación del medio ambiente y biodiversidad.",
    products: 3,
  },
  {
    id: "roberto-silva",
    name: "Roberto Silva",
    farm: "Hacienda Vista Hermosa",
    region: "Santander",
    image: "/roberto-silva-producer.jpg",
    certifications: ["UTZ", "Rainforest Alliance"],
    experience: "28 años",
    altitude: "1,600 msnm",
    varieties: ["Bourbon", "Typica", "Maragogipe"],
    description: "Maestro tostador y productor con décadas de experiencia en el cultivo de variedades tradicionales.",
    products: 4,
  },
]

const regions = ["Todas las regiones", "Huila", "Nariño", "Eje Cafetero", "Cauca", "Tolima", "Santander"]
const certifications = [
  "Todas las certificaciones",
  "Orgánico",
  "Comercio Justo",
  "Rainforest Alliance",
  "UTZ",
  "Bird Friendly",
]

export function ProducersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Todas las regiones")
  const [selectedCertification, setSelectedCertification] = useState("Todas las certificaciones")

  const filteredProducers = producers.filter((producer) => {
    const matchesSearch =
      producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.farm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = selectedRegion === "Todas las regiones" || producer.region === selectedRegion

    const matchesCertification =
      selectedCertification === "Todas las certificaciones" || producer.certifications.includes(selectedCertification)

    return matchesSearch && matchesRegion && matchesCertification
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-coffee-primary">
              Conoce a Nuestros Productores
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pretty text-coffee-secondary">
              Historias auténticas de familias cafeteras colombianas que cultivan con pasión los mejores granos de café
              especial
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-coffee-medium">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{producers.length} Productores</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>6 Regiones</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                <span>15+ Variedades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, finca o región..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-coffee-light focus:border-coffee-medium"
                />
              </div>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-coffee-light rounded-md focus:outline-none focus:border-coffee-medium"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                value={selectedCertification}
                onChange={(e) => setSelectedCertification(e.target.value)}
                className="px-4 py-2 border border-coffee-light rounded-md focus:outline-none focus:border-coffee-medium"
              >
                {certifications.map((cert) => (
                  <option key={cert} value={cert}>
                    {cert}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 text-coffee-medium">
              Mostrando {filteredProducers.length} de {producers.length} productores
            </div>
          </div>
        </div>
      </section>

      {/* Producers Grid */}
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredProducers.length === 0 ? (
              <div className="text-center py-12">
                <Coffee className="h-16 w-16 text-coffee-light mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coffee-dark mb-2">No se encontraron productores</h3>
                <p className="text-coffee-medium">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducers.map((producer) => (
                  <Card
                    key={producer.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-coffee-light/20"
                  >
                    <div className="relative h-64">
                      <Image
                        src={producer.image || "/placeholder.svg"}
                        alt={`${producer.name} - ${producer.farm}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-coffee-dark text-white">
                          {producer.products} productos
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-coffee-dark mb-1">{producer.name}</h3>
                        <p className="text-coffee-medium font-medium mb-2">{producer.farm}</p>
                        <div className="flex items-center gap-1 text-coffee-medium mb-3">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{producer.region}</span>
                        </div>
                      </div>

                      <p className="text-coffee-medium text-sm mb-4 line-clamp-3">{producer.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-medium">Experiencia:</span>
                          <span className="font-medium text-coffee-dark">{producer.experience}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-medium">Altitud:</span>
                          <span className="font-medium text-gray-900">{producer.altitude}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-coffee-medium">Variedades:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {producer.varieties.map((variety) => (
                              <Badge
                                key={variety}
                                variant="outline"
                                className="text-xs border-coffee-light text-coffee-medium"
                              >
                                {variety}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Award className="h-4 w-4 text-coffee-medium" />
                          <span className="text-sm text-coffee-medium">Certificaciones:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {producer.certifications.map((cert) => (
                            <Badge key={cert} className="text-xs bg-accent text-coffee-dark">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button asChild className="w-full bg-coffee-primary hover:bg-coffee-dark text-white">
                        <Link href={`/producer/${producer.id}`}>Conocer Historia</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
