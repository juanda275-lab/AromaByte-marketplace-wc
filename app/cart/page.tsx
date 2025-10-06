import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShoppingCartPage } from "@/components/shopping-cart-page"

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ShoppingCartPage />
      </main>
      <Footer />
    </div>
  )
}
