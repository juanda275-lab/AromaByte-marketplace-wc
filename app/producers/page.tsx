import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProducersPage } from "@/components/producers-page"

export const metadata: Metadata = {
  title: "Conocer Productores - AromaByte",
  description:
    "Conoce a los productores de café colombiano que hacen posible nuestros granos premium. Historias auténticas de familias cafeteras.",
}

export default function Producers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProducersPage />
      </main>
      <Footer />
    </div>
  )
}
