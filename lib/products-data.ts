export interface Product {
  id: number
  name: string
  origin: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  roastLevel: string
  tastingNotes: string[]
  description: string
  images: string[]
  specifications: {
    weight: string
    altitude: string
    process: string
    variety: string
    harvest: string
  }
  producer: {
    id: number
    name: string
    farmName: string
    location: string
    experience: string
    image: string
    story: string
    certifications: string[]
  }
  inStock: boolean
  stockCount: number
}

export const productsData: Product[] = [
  {
    id: 1,
    name: "Café Huila Premium",
    origin: "Huila, Colombia",
    price: 45000,
    originalPrice: 52000,
    rating: 4.8,
    reviews: 127,
    roastLevel: "Medio",
    tastingNotes: ["Chocolate", "Frutos Rojos", "Caramelo"],
    description:
      "Un café excepcional cultivado en las montañas de Huila, conocido por su perfil de sabor equilibrado y notas dulces distintivas.",
    images: ["/caf--huila-premium-bolsa-de-caf--colombiano.jpg", "/granos-de-caf--huila-tostados.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,600 - 1,800 msnm",
      process: "Lavado",
      variety: "Caturra, Castillo",
      harvest: "Abril - Junio 2024",
    },
    producer: {
      id: 1,
      name: "María Elena Rodríguez",
      farmName: "Finca El Paraíso",
      location: "Huila, Colombia",
      experience: "25 años",
      image: "/productora-de-caf--colombiana-mar-a-elena.jpg",
      story:
        "María Elena es una productora de tercera generación que ha dedicado su vida al cultivo de café de alta calidad. Su finca, ubicada en las montañas de Huila, utiliza métodos tradicionales combinados con técnicas modernas para producir granos excepcionales.",
      certifications: ["Orgánico", "Comercio Justo", "Rainforest Alliance"],
    },
    inStock: true,
    stockCount: 15,
  },
  {
    id: 2,
    name: "Nariño Especial",
    origin: "Nariño, Colombia",
    price: 52000,
    originalPrice: 58000,
    rating: 4.9,
    reviews: 89,
    roastLevel: "Suave",
    tastingNotes: ["Cítricos", "Miel", "Flores"],
    description:
      "Café de altura excepcional de Nariño, con notas florales y cítricas que lo hacen único. Perfecto para métodos de filtrado.",
    images: ["/caf--nari-o-especial-bolsa-premium.jpg", "/granos-de-caf--nari-o-verde-y-tostado.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,800 - 2,200 msnm",
      process: "Lavado",
      variety: "Caturra, Típica",
      harvest: "Mayo - Julio 2024",
    },
    producer: {
      id: 2,
      name: "Carlos Andrés Muñoz",
      farmName: "Finca La Esperanza",
      location: "Nariño, Colombia",
      experience: "18 años",
      image: "/productor-de-caf--colombiano-carlos-andr-s.jpg",
      story:
        "Carlos Andrés cultiva café en las alturas de Nariño, donde las condiciones climáticas únicas producen granos con características excepcionales. Su dedicación a la calidad lo ha convertido en un referente regional.",
      certifications: ["Comercio Justo", "Rainforest Alliance"],
    },
    inStock: true,
    stockCount: 12,
  },
  {
    id: 3,
    name: "Eje Cafetero Clásico",
    origin: "Eje Cafetero, Colombia",
    price: 38000,
    originalPrice: 42000,
    rating: 4.7,
    reviews: 156,
    roastLevel: "Fuerte",
    tastingNotes: ["Nueces", "Chocolate Oscuro", "Panela"],
    description:
      "El sabor tradicional del café colombiano. Cuerpo robusto y notas intensas, ideal para espresso y preparaciones fuertes.",
    images: ["/caf--eje-cafetero-cl-sico-bolsa-tradicional.jpg", "/granos-de-caf--tostado-oscuro-eje-cafetero.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,400 - 1,600 msnm",
      process: "Natural",
      variety: "Castillo, Colombia",
      harvest: "Marzo - Mayo 2024",
    },
    producer: {
      id: 3,
      name: "Juan Pablo Gómez",
      farmName: "Finca Tradición",
      location: "Quindío, Colombia",
      experience: "30 años",
      image: "/productor-juan-pablo-eje-cafetero.jpg",
      story:
        "Juan Pablo representa la tradición cafetera del Eje Cafetero. Con tres décadas de experiencia, produce café con el sabor auténtico que ha hecho famoso al café colombiano en el mundo.",
      certifications: ["Orgánico"],
    },
    inStock: true,
    stockCount: 20,
  },
  {
    id: 4,
    name: "Tolima Gourmet",
    origin: "Tolima, Colombia",
    price: 48000,
    originalPrice: 54000,
    rating: 4.8,
    reviews: 73,
    roastLevel: "Medio",
    tastingNotes: ["Frutas Tropicales", "Vainilla", "Almendras"],
    description:
      "Café gourmet de Tolima con perfil complejo y balanceado. Notas tropicales y dulces que sorprenden en cada taza.",
    images: ["/caf--tolima-gourmet-bolsa-premium.jpg", "/granos-de-caf--tolima-tostado-medio.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,500 - 1,700 msnm",
      process: "Honey",
      variety: "Caturra, Pink Bourbon",
      harvest: "Abril - Junio 2024",
    },
    producer: {
      id: 4,
      name: "Ana María Vargas",
      farmName: "Finca Los Andes",
      location: "Tolima, Colombia",
      experience: "15 años",
      image: "/productora-ana-maria-tolima.jpg",
      story:
        "Ana María ha innovado en procesos de beneficio para crear perfiles de sabor únicos. Su café gourmet es reconocido por su complejidad y balance excepcional.",
      certifications: ["Comercio Justo", "Orgánico"],
    },
    inStock: true,
    stockCount: 8,
  },
  {
    id: 5,
    name: "Cauca Artesanal",
    origin: "Cauca, Colombia",
    price: 55000,
    originalPrice: 62000,
    rating: 4.9,
    reviews: 92,
    roastLevel: "Suave",
    tastingNotes: ["Jazmín", "Durazno", "Azúcar Morena"],
    description:
      "Café artesanal de las montañas del Cauca, procesado con métodos tradicionales que resaltan su dulzura natural y notas florales delicadas.",
    images: ["/cafe-cauca-artesanal-bolsa.jpg", "/granos-cafe-cauca-verde.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,700 - 2,000 msnm",
      process: "Lavado",
      variety: "Geisha, Caturra",
      harvest: "Mayo - Julio 2024",
    },
    producer: {
      id: 5,
      name: "Pedro Antonio López",
      farmName: "Finca Artesanal",
      location: "Cauca, Colombia",
      experience: "22 años",
      image: "/productor-pedro-cauca.jpg",
      story:
        "Pedro Antonio es reconocido por su enfoque artesanal en cada etapa del proceso. Su café refleja la dedicación y el conocimiento ancestral de las comunidades indígenas del Cauca.",
      certifications: ["Orgánico", "Comercio Justo", "Denominación de Origen"],
    },
    inStock: true,
    stockCount: 10,
  },
  {
    id: 6,
    name: "Santander Tradicional",
    origin: "Santander, Colombia",
    price: 42000,
    originalPrice: 47000,
    rating: 4.6,
    reviews: 134,
    roastLevel: "Fuerte",
    tastingNotes: ["Cacao", "Especias", "Caña de Azúcar"],
    description:
      "Café robusto de Santander con carácter intenso. Perfecto para quienes buscan un café con cuerpo y sabor tradicional colombiano.",
    images: ["/cafe-santander-tradicional-bolsa.jpg", "/granos-cafe-santander-tostado.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,300 - 1,500 msnm",
      process: "Natural",
      variety: "Colombia, Castillo",
      harvest: "Marzo - Mayo 2024",
    },
    producer: {
      id: 6,
      name: "Roberto Sánchez",
      farmName: "Finca El Roble",
      location: "Santander, Colombia",
      experience: "28 años",
      image: "/productor-roberto-santander.jpg",
      story:
        "Roberto mantiene viva la tradición cafetera de Santander. Su café representa el sabor fuerte y auténtico que caracteriza a esta región productora.",
      certifications: ["Rainforest Alliance"],
    },
    inStock: true,
    stockCount: 18,
  },
  {
    id: 7,
    name: "Quindío Premium",
    origin: "Eje Cafetero, Colombia",
    price: 47000,
    originalPrice: 53000,
    rating: 4.8,
    reviews: 108,
    roastLevel: "Medio",
    tastingNotes: ["Caramelo", "Manzana Roja", "Avellana"],
    description:
      "Café premium del corazón del Eje Cafetero. Balance perfecto entre dulzura y acidez, con notas frutales y de frutos secos.",
    images: ["/cafe-quindio-premium-bolsa.jpg", "/granos-cafe-quindio-tostado-medio.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,500 - 1,700 msnm",
      process: "Lavado",
      variety: "Caturra, Típica",
      harvest: "Abril - Junio 2024",
    },
    producer: {
      id: 7,
      name: "Claudia Patricia Restrepo",
      farmName: "Finca Vista Hermosa",
      location: "Quindío, Colombia",
      experience: "20 años",
      image: "/productora-claudia-quindio.jpg",
      story:
        "Claudia Patricia lidera una cooperativa de mujeres caficultoras en Quindío. Su café premium es el resultado de años de perfeccionar técnicas de cultivo y procesamiento.",
      certifications: ["Comercio Justo", "Orgánico", "Mujeres Caficultoras"],
    },
    inStock: true,
    stockCount: 14,
  },
  {
    id: 8,
    name: "Valle del Cauca Especial",
    origin: "Valle del Cauca, Colombia",
    price: 49000,
    originalPrice: 55000,
    rating: 4.7,
    reviews: 85,
    roastLevel: "Suave",
    tastingNotes: ["Mandarina", "Miel de Abeja", "Té Blanco"],
    description:
      "Café especial del Valle del Cauca con perfil delicado y complejo. Notas cítricas brillantes y dulzura natural que lo hacen excepcional.",
    images: ["/cafe-valle-cauca-especial-bolsa.jpg", "/granos-cafe-valle-verde-tostado.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,600 - 1,900 msnm",
      process: "Honey",
      variety: "Pink Bourbon, Geisha",
      harvest: "Mayo - Julio 2024",
    },
    producer: {
      id: 8,
      name: "Diego Ospina",
      farmName: "Finca El Mirador",
      location: "Valle del Cauca, Colombia",
      experience: "16 años",
      image: "/productor-diego-valle.jpg",
      story:
        "Diego se especializa en variedades exóticas y procesos innovadores. Su café especial ha ganado reconocimiento en competencias nacionales por su perfil único.",
      certifications: ["Orgánico", "Rainforest Alliance"],
    },
    inStock: true,
    stockCount: 9,
  },
  {
    id: 9,
    name: "Boyacá Orgánico",
    origin: "Boyacá, Colombia",
    price: 53000,
    originalPrice: 59000,
    rating: 4.9,
    reviews: 67,
    roastLevel: "Medio",
    tastingNotes: ["Frutos del Bosque", "Chocolate con Leche", "Miel"],
    description:
      "Café 100% orgánico de Boyacá, cultivado sin químicos en armonía con la naturaleza. Sabor limpio con notas dulces y frutales.",
    images: ["/cafe-boyaca-organico-bolsa.jpg", "/granos-cafe-boyaca-organico.jpg"],
    specifications: {
      weight: "250g",
      altitude: "1,800 - 2,100 msnm",
      process: "Lavado",
      variety: "Caturra, Castillo",
      harvest: "Abril - Junio 2024",
    },
    producer: {
      id: 9,
      name: "Sofía Díaz",
      farmName: "Finca Orgánica La Montaña",
      location: "Boyacá, Colombia",
      experience: "19 años",
      image: "/productora-sofia-boyaca.jpg",
      story:
        "Sofía es pionera en agricultura orgánica en Boyacá. Su compromiso con prácticas sostenibles produce café de altísima calidad mientras protege el medio ambiente.",
      certifications: ["Orgánico Certificado", "Comercio Justo", "Carbono Neutral"],
    },
    inStock: true,
    stockCount: 11,
  },
]

export function getProductById(id: number): Product | undefined {
  return productsData.find((product) => product.id === id)
}

export function getRelatedProducts(currentProductId: number, limit = 4): Product[] {
  return productsData.filter((product) => product.id !== currentProductId).slice(0, limit)
}

export const products = productsData
