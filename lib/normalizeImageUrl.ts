// lib/normalizeImageUrl.ts

export function normalizeImageUrl(imagePath?: string): string {
  if (!imagePath) return "/placeholder.svg"

  // Si ya es una URL completa (ej: de Supabase Storage)
  if (imagePath.startsWith("http")) return imagePath

  // Si es una ruta local (ej: "maria.jpg" o "/producers/maria.jpg")
  if (imagePath.startsWith("/")) return imagePath

  // Si es solo el nombre del archivo
  return `/producers/${imagePath}`
}