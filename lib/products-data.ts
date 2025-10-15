import { supabase } from "./supabaseClient"

// ✅ Obtener todos los productos
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*")

  if (error) {
    console.error("Error obteniendo productos:", error)
    return []
  }

  const supabaseUrl =
    "https://tmuxpxscbtvgjdnlufbb.supabase.co/storage/v1/object/public/producers/"

  return data.map((p) => ({
    ...p,
    images: (p.images || []).map((img: string) =>
      img.startsWith("http") ? img : `${supabaseUrl}${img}`
    ),
    tastingNotes: p.tasting_notes || [],
    inStock: p.in_stock ?? true,
    stockCount: p.stock_count ?? 0,
    producer: p.producer
      ? {
          ...p.producer,
          image: p.producer.image?.startsWith("http")
            ? p.producer.image
            : `${supabaseUrl}${p.producer.image}`,
          certifications: p.producer.certifications || [],
        }
      : null,
  }))
}

// ✅ Obtener un producto por ID
export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error obteniendo producto:", error)
    return null
  }

  const supabaseUrl =
    "https://tmuxpxscbtvgjdnlufbb.supabase.co/storage/v1/object/public/producers/"

  return {
    ...data,
    images: (data.images || []).map((img: string) =>
      img.startsWith("http") ? img : `${supabaseUrl}${img}`
    ),
    tastingNotes: data.tasting_notes || [],
    inStock: data.in_stock ?? true,
    stockCount: data.stock_count ?? 0,
    producer: data.producer
      ? {
          ...data.producer,
          image: data.producer.image?.startsWith("http")
            ? data.producer.image
            : `${supabaseUrl}${data.producer.image}`,
          certifications: data.producer.certifications || [],
        }
      : null,
  }
}

// ✅ Obtener productos de un productor específico (usando JSONB)
export async function getProductsByProducer(producerId: string | number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("producer->id", String(producerId))

  if (error) {
    console.error("Error obteniendo productos por productor:", error)
    return []
  }

  const supabaseUrl =
    "https://tmuxpxscbtvgjdnlufbb.supabase.co/storage/v1/object/public/producers/"

  return data.map((p) => ({
    ...p,
    images: (p.images || []).map((img: string) =>
      img.startsWith("http") ? img : `${supabaseUrl}${img}`
    ),
    tastingNotes: p.tasting_notes || [],
    inStock: p.in_stock ?? true,
    stockCount: p.stock_count ?? 0,
    producer: p.producer
      ? {
          ...p.producer,
          image: p.producer.image?.startsWith("http")
            ? p.producer.image
            : `${supabaseUrl}${p.producer.image}`,
          certifications: p.producer.certifications || [],
        }
      : null,
  }))
}

// ✅ Obtener productos relacionados
export async function getRelatedProducts(productId: number, limit = 4) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("origin, roast_level")
    .eq("id", productId)
    .single()

  if (productError || !product) return []

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("id", productId)
    .eq("origin", product.origin)
    .limit(limit)

  if (error) {
    console.error("Error obteniendo productos relacionados:", error)
    return []
  }

  const supabaseUrl =
    "https://tmuxpxscbtvgjdnlufbb.supabase.co/storage/v1/object/public/producers/"

  return data.map((p) => ({
    ...p,
    images: (p.images || []).map((img: string) =>
      img.startsWith("http") ? img : `${supabaseUrl}${img}`
    ),
  }))
}