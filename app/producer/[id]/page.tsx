import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProducerProfile } from "@/components/producer-profile"

export default function ProducerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProducerProfile producerId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
