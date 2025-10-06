import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Coffee, Users, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-cream py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-coffee-primary">Nosotros</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-coffee-secondary">
              Conectando directamente a los productores de café colombiano con los amantes del café en todo el mundo
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-coffee-primary mb-6">Nuestra Misión</h2>
                <p className="text-lg text-gray-700 mb-6">
                  En AromaByte, creemos que cada taza de café cuenta una historia. Nuestra misión es conectar
                  directamente a los productores de café colombiano con los consumidores, eliminando intermediarios y
                  asegurando que cada grano llegue con su máxima calidad y frescura.
                </p>
                <p className="text-lg text-gray-700">
                  Programamos el futuro del comercio de café, sorbo a sorbo, utilizando tecnología para crear un
                  marketplace transparente, justo y sostenible.
                </p>
              </div>
              <div className="bg-coffee-light/20 p-8 rounded-lg">
                <img
                  src="/colombian-coffee-farmer-picking-coffee-beans.jpg"
                  alt="Productor de café colombiano"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-coffee-light/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-coffee-primary mb-12">Nuestros Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-coffee-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calidad Premium</h3>
                <p className="text-gray-600">
                  Seleccionamos únicamente los mejores granos de café colombiano de alta calidad.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-coffee-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comercio Directo</h3>
                <p className="text-gray-600">
                  Conectamos directamente productores y consumidores para un comercio más justo.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-coffee-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparencia</h3>
                <p className="text-gray-600">Información completa sobre el origen, proceso y productor de cada café.</p>
              </div>
              <div className="text-center">
                <div className="bg-coffee-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sostenibilidad</h3>
                <p className="text-gray-600">
                  Promovemos prácticas sostenibles que benefician al medio ambiente y las comunidades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-coffee-primary mb-12">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <img
                  src="/team-maria-gonzalez.jpg"
                  alt="María González"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">María González</h3>
                <p className="text-coffee-secondary mb-2">Fundadora & CEO</p>
                <p className="text-gray-600">
                  Experta en café con 15 años de experiencia en la industria cafetera colombiana.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/team-carlos-rodriguez.jpg"
                  alt="Carlos Rodríguez"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Carlos Rodríguez</h3>
                <p className="text-coffee-secondary mb-2">CTO</p>
                <p className="text-gray-600">
                  Desarrollador full-stack especializado en plataformas de e-commerce y blockchain.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/team-ana-martinez.jpg"
                  alt="Ana Martínez"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Ana Martínez</h3>
                <p className="text-coffee-secondary mb-2">Directora de Operaciones</p>
                <p className="text-gray-600">
                  Especialista en cadena de suministro y relaciones con productores de café.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
