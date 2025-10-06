import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-cream py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-coffee-primary">Contacto</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-coffee-secondary">
              ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos y te responderemos pronto.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-coffee-primary">Envíanos un mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          Nombre
                        </label>
                        <Input id="firstName" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Apellido
                        </label>
                        <Input id="lastName" placeholder="Tu apellido" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Teléfono (opcional)
                      </label>
                      <Input id="phone" type="tel" placeholder="+57 300 123 4567" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Asunto
                      </label>
                      <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Mensaje
                      </label>
                      <Textarea id="message" placeholder="Cuéntanos más detalles sobre tu consulta..." rows={5} />
                    </div>
                    <Button className="w-full bg-coffee-primary hover:bg-coffee-secondary">Enviar mensaje</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-coffee-primary">Información de contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-coffee-primary text-white p-3 rounded-full">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-600">hola@aromabyte.com</p>
                        <p className="text-gray-600">soporte@aromabyte.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-coffee-primary text-white p-3 rounded-full">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Teléfono</h3>
                        <p className="text-gray-600">+57 (1) 234-5678</p>
                        <p className="text-gray-600">WhatsApp: +57 300 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-coffee-primary text-white p-3 rounded-full">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Dirección</h3>
                        <p className="text-gray-600">
                          Carrera 11 #93-07
                          <br />
                          Bogotá, Colombia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-coffee-primary text-white p-3 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Horario de atención</h3>
                        <p className="text-gray-600">
                          Lunes a Viernes: 8:00 AM - 6:00 PM
                          <br />
                          Sábados: 9:00 AM - 2:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-coffee-primary">Preguntas frecuentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">¿Cuánto tiempo tarda el envío?</h4>
                      <p className="text-gray-600 text-sm">
                        Los envíos nacionales tardan entre 2-5 días hábiles dependiendo de la ciudad.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">¿El café viene recién tostado?</h4>
                      <p className="text-gray-600 text-sm">
                        Sí, todos nuestros cafés se tuestan bajo pedido para garantizar máxima frescura.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">¿Puedo visitar las fincas?</h4>
                      <p className="text-gray-600 text-sm">
                        Organizamos tours a las fincas productoras. Contáctanos para más información.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
