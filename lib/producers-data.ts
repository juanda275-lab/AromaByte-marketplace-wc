import { supabase } from "./supabaseClient"

export async function getProducers() {
  const { data, error } = await supabase
    .from("producers")
    .select("*")

  if (error) {
    console.error("Error obteniendo productores:", error)
    return []
  }

  // Obtener la URL base pública del bucket
  const {
    data: { publicUrl: baseUrl },
  } = supabase.storage.from("producers").getPublicUrl("")

  // Mapear los productores con URLs completas de imagen
  return data.map((p) => ({
    ...p,
    profile_image: p.profile_image
      ? p.profile_image.startsWith("http")
        ? p.profile_image // ya es una URL completa
        : `${baseUrl}${p.profile_image}` // concatenar base URL + nombre archivo
      : "/placeholder.svg",
  }))
}