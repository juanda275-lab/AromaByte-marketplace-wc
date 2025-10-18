"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Award, Users, Coffee } from "lucide-react"
import { getAllProducers } from "@/lib/producers-data"
import { createClient } from "@/lib/supabase/client"

interface DBProducer {
  id: number
  user_id: string
  farm_name: string
  location: string
  story: string
  experience_years: number
  certifications: string[]
  profile_image?: string
  cover_image?: string
  altitude?: string
  varieties?: string
  created_at: string
}

const getUniqueRegions = (producers: any[]) => {
  const regions = producers
    .filter((p) => p.location) // Filter out producers without location
    .map((p) => p.location.split(",")[0].trim())
  return ["Todas las regiones", ...Array.from(new Set(regions))]
}

const getUniqueCertifications = (producers: any[]) => {
  const allCerts = producers.flatMap((p) => p.certifications || [])
  return ["Todas las certificaciones", ...Array.from(new Set(allCerts))]
}

export function ProducersPage() {
  const [dbProducers, setDbProducers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const staticProducers = getAllProducers()

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from("producers")
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .not("user_id", "is", null)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[v0] Error fetching producers:", error)
          return
        }

        const producersWithCounts = await Promise.all(
          (data || []).map(async (p: any) => {
            const { count } = await supabase
              .from("products")
              .select("*", { count: "exact", head: true })
              .eq("producer_id", p.id)

            return {
              id: `db-${p.id}`,
              name: p.profiles?.full_name || p.farm_name || "Productor",
              farmName: p.farm_name || "Finca sin nombre",
              location: p.location || "Colombia",
              story:
                p.story ||
                `Productor de café especial en ${p.location || "Colombia"}. Cultivando café de alta calidad con dedicación y pasión.`,
              experience: p.experience_years ? `${p.experience_years} años` : "Nuevo productor",
              profileImage: p.profile_image || "/lush-coffee-farm.png",
              coverImage: p.cover_image || "/rustic-coffee-bag.png",
              certifications: Array.isArray(p.certifications) ? p.certifications : [],
              stats: {
                altitude: p.altitude || "1800 msnm",
                varieties: p.varieties || "Caturra, Castillo",
                production: "N/A",
              },
              products: Array(count || 0).fill({}),
            }
          }),
        )

        setDbProducers(producersWithCounts)
      } catch (error) {
        console.error("[v0] Error loading producers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducers()
  }, [])

  const allProducers = [...dbProducers, ...staticProducers]
  const regions = getUniqueRegions(allProducers)
  const certifications = getUniqueCertifications(allProducers)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Todas las regiones")
  const [selectedCertification, setSelectedCertification] = useState("Todas las certificaciones")

  const filteredProducers = allProducers.filter((producer) => {
    const matchesSearch =
      producer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const producerRegion = producer.location?.split(",")[0]?.trim() || ""
    const matchesRegion = selectedRegion === "Todas las regiones" || producerRegion === selectedRegion

    const matchesCertification =
      selectedCertification === "Todas las certificaciones" ||
      (producer.certifications && producer.certifications.includes(selectedCertification))

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
                <span>{allProducers.length} Productores</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{regions.length - 1} Regiones</span>
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
              {loading ? (
                "Cargando productores..."
              ) : (
                <>
                  Mostrando {filteredProducers.length} de {allProducers.length} productores
                  {dbProducers.length > 0 && (
                    <span className="ml-2 text-coffee-primary font-medium">({dbProducers.length} nuevos)</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Producers Grid */}
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <Coffee className="h-16 w-16 text-coffee-medium mx-auto mb-4 animate-pulse" />
                <p className="text-coffee-medium">Cargando productores...</p>
              </div>
            ) : filteredProducers.length === 0 ? (
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
                        src={producer.profileImage || "/placeholder.svg"}
                        alt={`${producer.name} - ${producer.farmName}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-coffee-dark text-white">
                          {producer.products?.length || 0} productos
                        </Badge>
                      </div>
                      {String(producer.id).startsWith("db-") && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-coffee-dark">Nuevo</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-coffee-dark mb-1">{producer.name}</h3>
                        <p className="text-coffee-medium font-medium mb-2">{producer.farmName}</p>
                        <div className="flex items-center gap-1 text-coffee-medium mb-3">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{producer.location}</span>
                        </div>
                      </div>

                      <p className="text-coffee-medium text-sm mb-4 line-clamp-3">
                        {producer.story?.split("\n\n")[0] || producer.story || "Historia del productor"}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-medium">Experiencia:</span>
                          <span className="font-medium text-coffee-dark">{producer.experience}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-medium">Altitud:</span>
                          <span className="font-medium text-gray-900">{producer.stats?.altitude || "N/A"}</span>
                        </div>
                        {producer.stats?.varieties && (
                          <div className="text-sm">
                            <span className="text-coffee-medium">Variedades:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {producer.stats.varieties.split(", ").map((variety: string) => (
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
                        )}
                      </div>

                      {producer.certifications && producer.certifications.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1 mb-2">
                            <Award className="h-4 w-4 text-coffee-medium" />
                            <span className="text-sm text-coffee-medium">Certificaciones:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {producer.certifications.map((cert: string) => (
                              <Badge key={cert} className="text-xs bg-accent text-coffee-dark">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

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
