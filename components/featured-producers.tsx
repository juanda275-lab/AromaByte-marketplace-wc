import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Award, Coffee } from "lucide-react"
import { getProducers } from "@/lib/producers-data"

export async function FeaturedProducers() {
  const allProducers = await getProducers()
  const featuredProducers = (allProducers ?? []).slice(0, 3)

  return (
    <section className="py-16 lg:py-24 bg-coffee-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-coffee-primary mb-4">
            Nuestros Productores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Conoce a los apasionados caficultores que hacen posible cada taza excepcional. Cada productor tiene una
            historia única y un compromiso con la calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProducers.map((producer: any) => (
            <Card
              key={producer.id}
              className="group hover:shadow-xl transition-all duration-300 bg-white border-coffee-light"
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={producer.image || "/placeholder.svg"}
                      alt={producer.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-coffee-primary/20"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-coffee-primary text-white rounded-full p-2">
                      <Coffee className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="font-poppins font-bold text-xl text-coffee-primary mb-1">
                    {producer.name}
                  </h3>
                  <p className="text-coffee-secondary font-medium mb-2">
                    {producer.farmName}
                  </p>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{producer.location}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experiencia:</span>
                    <span className="font-medium text-coffee-primary">{producer.experience}</span>
                  </div>

                  {producer.specialty && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Especialidad:</span>
                      <span className="font-medium text-coffee-primary">{producer.specialty}</span>
                    </div>
                  )}

                  {producer.certifications?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Certificaciones:</span>
                      <div className="flex flex-wrap gap-1">
                        {producer.certifications.slice(0, 2).map((cert: string) => (
                          <Badge
                            key={cert}
                            variant="secondary"
                            className="text-xs bg-coffee-primary/10 text-coffee-primary"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {producer.story && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty line-clamp-3">
                      {producer.story.split("\n\n")[0]}
                    </p>
                  )}

                  <Button asChild className="w-full bg-coffee-primary hover:bg-coffee-secondary mt-4">
                    <Link href={`/producer/${producer.id}`}>Conocer Más</Link>
                  </Button>
                </div>
              </CardContent>
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
            <Link href="/producers">Ver Todos los Productores</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}