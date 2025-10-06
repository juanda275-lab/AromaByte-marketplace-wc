import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-coffee-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-poppins font-bold text-2xl">AromaByte</h3>
              <p className="text-sm text-white/90 font-medium">Programando el futuro, sorbo a sorbo</p>
            </div>
            <p className="text-sm text-white/80">
              Conectando productores colombianos con amantes del café premium. Programando el futuro, sorbo a sorbo.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>hola@aromabyte.co</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link href="/catalog" className="block text-sm text-white/80 hover:text-white transition-colors">
                Catálogo de Café
              </Link>
              <Link href="/producers" className="block text-sm text-white/80 hover:text-white transition-colors">
                Nuestros Productores
              </Link>
              <Link href="/about" className="block text-sm text-white/80 hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/shipping" className="block text-sm text-white/80 hover:text-white transition-colors">
                Envíos
              </Link>
              <Link href="/returns" className="block text-sm text-white/80 hover:text-white transition-colors">
                Devoluciones
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Soporte</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-white/80 hover:text-white transition-colors">
                Centro de Ayuda
              </Link>
              <Link href="/contact" className="block text-sm text-white/80 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link href="/faq" className="block text-sm text-white/80 hover:text-white transition-colors">
                Preguntas Frecuentes
              </Link>
              <Link href="/privacy" className="block text-sm text-white/80 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="block text-sm text-white/80 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-white/60">© 2024 AromaByte. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
