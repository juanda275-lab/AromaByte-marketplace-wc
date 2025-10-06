import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-coffee-beige to-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-poppins font-bold text-4xl lg:text-6xl text-coffee-primary leading-tight text-balance">
                Café Colombiano Premium
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                Descubre los sabores únicos de Colombia. Conectamos directamente a los productores con tu taza,
                garantizando frescura y calidad excepcional en cada grano.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-coffee-primary hover:bg-coffee-secondary text-white">
                <Link href="/catalog">Explorar Catálogo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white bg-transparent"
              >
                <Link href="/producers">Conocer Productores</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-coffee-light">
              <div className="text-center">
                <div className="font-poppins font-bold text-2xl text-coffee-primary">50+</div>
                <div className="text-sm text-muted-foreground">Productores</div>
              </div>
              <div className="text-center">
                <div className="font-poppins font-bold text-2xl text-coffee-primary">15</div>
                <div className="text-sm text-muted-foreground">Regiones</div>
              </div>
              <div className="text-center">
                <div className="font-poppins font-bold text-2xl text-coffee-primary">100%</div>
                <div className="text-sm text-muted-foreground">Orgánico</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-coffee-secondary to-coffee-primary p-8">
              <img
                src="/hero-coffee-beans-premium.jpg"
                alt="Café colombiano premium"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="font-poppins font-bold text-coffee-primary">4.9</div>
                <div className="text-xs text-muted-foreground">★★★★★</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent text-white rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="font-poppins font-bold">24h</div>
                <div className="text-xs">Envío</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
