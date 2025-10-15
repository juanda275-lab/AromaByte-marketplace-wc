export interface Producer {
  id: number
  name: string
  farmName: string
  location: string
  experience: string
  specialty: string
  coverImage: string
  profileImage: string
  certifications: string[]
  story: string
  stats: {
    farmSize: string
    altitude: string
    varieties: string
    annualProduction: string
    employees: string
    foundedYear: string
  }
  sustainabilityPractices: string[]
  products: number[] // IDs de productos de este productor
}

export const producers: Producer[] = [
  {
    id: 1,
    name: "María Elena Rodríguez",
    farmName: "Finca El Paraíso",
    location: "Huila, Colombia",
    experience: "25 años",
    specialty: "Café de Altura",
    coverImage: "/finca-huila-paisaje.jpg",
    profileImage: "/productora-maria-elena-rodriguez.jpg",
    certifications: ["Orgánico", "Comercio Justo", "Rainforest Alliance", "UTZ Certified"],
    story: `María Elena es una productora de tercera generación que ha dedicado su vida al cultivo de café de alta calidad. Su finca, ubicada en las montañas de Huila a 1,650 metros sobre el nivel del mar, se extiende por 15 hectáreas de terreno volcánico rico en nutrientes.

Desde pequeña, María Elena aprendió los secretos del café de su abuelo, quien estableció la finca en 1952. Con el tiempo, ha combinado las técnicas tradicionales con métodos modernos y sostenibles, logrando un café excepcional que respeta el medio ambiente y apoya a su comunidad.

Su compromiso con la calidad se refleja en cada grano: desde la selección cuidadosa de las variedades Caturra y Castillo, hasta el proceso de secado al sol en patios de concreto. María Elena también lidera un grupo de mujeres caficultoras en su región, promoviendo la igualdad de género y el empoderamiento femenino en el sector cafetero.`,
    stats: {
      farmSize: "15 hectáreas",
      altitude: "1,650 msnm",
      varieties: "Caturra, Castillo",
      annualProduction: "120 sacos",
      employees: "8 trabajadores",
      foundedYear: "1952",
    },
    sustainabilityPractices: [
      "Agricultura orgánica certificada",
      "Conservación de agua y suelos",
      "Protección de la biodiversidad",
      "Energía solar para el procesamiento",
      "Compostaje de pulpa de café",
      "Reforestación con especies nativas",
    ],
    products: [1], // Café Huila Premium
  },
  {
    id: 2,
    name: "Carlos Andrés Muñoz",
    farmName: "Hacienda Los Andes",
    location: "Nariño, Colombia",
    experience: "18 años",
    specialty: "Café Especial",
    coverImage: "/finca-narino-paisaje.jpg",
    profileImage: "/productor-de-caf--colombiano-carlos-andr-s.jpg",
    certifications: ["Rainforest Alliance", "UTZ Certified", "Comercio Justo"],
    story: `Carlos Andrés es un innovador en el mundo del café especial. Después de estudiar agronomía, regresó a las tierras de su familia en Nariño para revolucionar la forma en que se cultiva y procesa el café en la región.

Su hacienda, ubicada a 2,100 metros sobre el nivel del mar, es un laboratorio viviente donde experimenta con diferentes métodos de fermentación y procesamiento. Carlos ha desarrollado técnicas únicas que resaltan los sabores frutales y florales característicos del café nariñense.

Además de su trabajo en la finca, Carlos es un líder comunitario que ha establecido una cooperativa de pequeños productores, compartiendo sus conocimientos y ayudando a mejorar la calidad del café en toda la región. Su pasión por la innovación y la sostenibilidad lo ha convertido en un referente en la industria cafetera colombiana.`,
    stats: {
      farmSize: "12 hectáreas",
      altitude: "2,100 msnm",
      varieties: "Geisha, Bourbon Rosado",
      annualProduction: "95 sacos",
      employees: "6 trabajadores",
      foundedYear: "2006",
    },
    sustainabilityPractices: [
      "Procesamiento experimental sostenible",
      "Manejo integrado de plagas",
      "Captación de agua lluvia",
      "Producción de abono orgánico",
      "Conservación de bosques nativos",
      "Capacitación a productores locales",
    ],
    products: [2], // Nariño Especial
  },
  {
    id: 3,
    name: "Juan Pablo Ramírez",
    farmName: "Finca La Esperanza",
    location: "Eje Cafetero, Colombia",
    experience: "22 años",
    specialty: "Café Tradicional",
    coverImage: "/finca-eje-cafetero-paisaje.jpg",
    profileImage: "/productor-juan-pablo-eje-cafetero.jpg",
    certifications: ["Orgánico", "Bird Friendly", "Comercio Justo"],
    story: `Juan Pablo creció entre cafetales en el corazón del Eje Cafetero. Su finca, La Esperanza, lleva ese nombre porque representa el sueño de su padre de crear un legado familiar basado en el café de calidad y el respeto por la naturaleza.

Con más de dos décadas de experiencia, Juan Pablo ha perfeccionado el arte del café tradicional colombiano. Su enfoque se centra en mantener las variedades clásicas y los métodos de cultivo que han hecho famoso al café del Eje Cafetero en todo el mundo.

La Esperanza es también un santuario para aves migratorias, y Juan Pablo ha integrado la conservación de la biodiversidad en cada aspecto de su operación. Su café no solo es delicioso, sino que también contribuye a la protección del ecosistema cafetero colombiano.`,
    stats: {
      farmSize: "18 hectáreas",
      altitude: "1,450 msnm",
      varieties: "Típica, Caturra",
      annualProduction: "150 sacos",
      employees: "10 trabajadores",
      foundedYear: "1978",
    },
    sustainabilityPractices: [
      "Certificación Bird Friendly",
      "Sombra con árboles nativos",
      "Cero uso de químicos sintéticos",
      "Corredores biológicos",
      "Educación ambiental",
      "Turismo cafetero sostenible",
    ],
    products: [3], // Eje Cafetero Clásico
  },
  {
    id: 4,
    name: "Ana María Vargas",
    farmName: "Finca Los Andes",
    location: "Tolima, Colombia",
    experience: "15 años",
    specialty: "Café Gourmet",
    coverImage: "/finca-tolima-paisaje.jpg",
    profileImage: "/productora-ana-maria-tolima.jpg",
    certifications: ["Orgánico", "Comercio Justo"],
    story: `Ana María ha innovado en procesos de beneficio para crear perfiles de sabor únicos. Su café gourmet es reconocido por su complejidad y balance excepcional, resultado de años de experimentación y dedicación.

Después de heredar la finca familiar, Ana María decidió transformarla completamente, implementando prácticas orgánicas y desarrollando su propia marca de café gourmet. Su enfoque meticuloso en cada etapa del proceso, desde la selección de cerezas hasta el secado, ha resultado en cafés que han ganado reconocimiento nacional e internacional.

Ana María también es mentora de jóvenes caficultores, especialmente mujeres, compartiendo su conocimiento y ayudando a la próxima generación a ver el café como una oportunidad de negocio sostenible y rentable.`,
    stats: {
      farmSize: "10 hectáreas",
      altitude: "1,800 msnm",
      varieties: "Caturra, Castillo",
      annualProduction: "85 sacos",
      employees: "5 trabajadores",
      foundedYear: "2009",
    },
    sustainabilityPractices: [
      "Procesamiento honey y natural",
      "Secado en camas africanas",
      "Gestión eficiente del agua",
      "Compostaje de residuos orgánicos",
      "Energía renovable",
      "Empoderamiento femenino",
    ],
    products: [4], // Tolima Gourmet
  },
  {
    id: 5,
    name: "Pedro Antonio Gómez",
    farmName: "Finca San José",
    location: "Cauca, Colombia",
    experience: "28 años",
    specialty: "Café Artesanal",
    coverImage: "/finca-cauca-paisaje.jpg",
    profileImage: "/productor-pedro-cauca.jpg",
    certifications: ["Orgánico", "Rainforest Alliance"],
    story: `Pedro Antonio es un maestro del café artesanal. Con casi tres décadas de experiencia, ha perfeccionado técnicas tradicionales que se transmiten de generación en generación en su familia. Su finca en Cauca es un ejemplo de cómo la tradición y la calidad pueden ir de la mano.

Cada lote de café de Pedro es tratado con el cuidado de un artesano. Desde la recolección manual selectiva hasta el secado controlado, cada paso es supervisado personalmente para garantizar la máxima calidad. Su café artesanal es apreciado por conocedores que buscan sabores auténticos y complejos.

Pedro también es un defensor de la agricultura familiar y trabaja activamente para preservar las tradiciones cafeteras de Cauca, mientras adapta prácticas sostenibles modernas que aseguran la viabilidad a largo plazo de su finca.`,
    stats: {
      farmSize: "8 hectáreas",
      altitude: "1,900 msnm",
      varieties: "Típica, Bourbon",
      annualProduction: "70 sacos",
      employees: "4 trabajadores",
      foundedYear: "1996",
    },
    sustainabilityPractices: [
      "Métodos tradicionales de cultivo",
      "Procesamiento artesanal",
      "Conservación de variedades antiguas",
      "Agricultura familiar",
      "Secado solar tradicional",
      "Preservación cultural",
    ],
    products: [5], // Cauca Artesanal
  },
  {
    id: 6,
    name: "Roberto Silva",
    farmName: "Hacienda El Roble",
    location: "Santander, Colombia",
    experience: "20 años",
    specialty: "Café Tradicional",
    coverImage: "/finca-santander-paisaje.jpg",
    profileImage: "/productor-roberto-santander.jpg",
    certifications: ["UTZ Certified", "Comercio Justo"],
    story: `Roberto Silva representa la tradición cafetera de Santander. Su hacienda, El Roble, lleva el nombre del majestuoso árbol que ha sido testigo de generaciones de caficultores en su familia. Roberto ha mantenido vivas las prácticas tradicionales mientras incorpora mejoras que benefician tanto la calidad como la sostenibilidad.

Con veinte años de experiencia, Roberto ha desarrollado un profundo conocimiento del terroir de Santander y cómo este influye en el perfil de sabor de su café. Su enfoque equilibrado entre tradición e innovación ha resultado en un café que captura la esencia de la región.

Roberto es también un líder en su comunidad, promoviendo prácticas de comercio justo y trabajando para mejorar las condiciones de vida de los trabajadores cafeteros en toda la región de Santander.`,
    stats: {
      farmSize: "14 hectáreas",
      altitude: "1,550 msnm",
      varieties: "Caturra, Colombia",
      annualProduction: "110 sacos",
      employees: "7 trabajadores",
      foundedYear: "2004",
    },
    sustainabilityPractices: [
      "Comercio justo certificado",
      "Mejora continua de calidad",
      "Bienestar de trabajadores",
      "Manejo sostenible de recursos",
      "Capacitación técnica",
      "Desarrollo comunitario",
    ],
    products: [6], // Santander Tradicional
  },
  {
    id: 7,
    name: "Claudia Patricia Moreno",
    farmName: "Finca Vista Hermosa",
    location: "Quindío, Colombia",
    experience: "17 años",
    specialty: "Café Premium",
    coverImage: "/finca-quindio-paisaje.jpg",
    profileImage: "/productora-claudia-quindio.jpg",
    certifications: ["Orgánico", "Rainforest Alliance", "Bird Friendly"],
    story: `Claudia Patricia transformó una finca abandonada en una de las productoras de café premium más reconocidas del Quindío. Su visión de crear un café excepcional mientras protege el medio ambiente la ha llevado a implementar algunas de las prácticas más avanzadas de sostenibilidad en la región.

Vista Hermosa no solo produce café de alta calidad, sino que también es un modelo de biodiversidad. Claudia ha creado un ecosistema donde el café crece en armonía con cientos de especies de plantas y animales nativos. Su café premium refleja este equilibrio perfecto entre naturaleza y agricultura.

Además de su trabajo en la finca, Claudia ofrece talleres de café y tours educativos, compartiendo su pasión y conocimiento con visitantes de todo el mundo. Su compromiso con la excelencia y la sostenibilidad la ha convertido en una embajadora del café colombiano.`,
    stats: {
      farmSize: "11 hectáreas",
      altitude: "1,700 msnm",
      varieties: "Geisha, Caturra",
      annualProduction: "90 sacos",
      employees: "6 trabajadores",
      foundedYear: "2007",
    },
    sustainabilityPractices: [
      "Biodiversidad excepcional",
      "Turismo cafetero educativo",
      "Procesamiento de especialidad",
      "Conservación de fauna nativa",
      "Agricultura regenerativa",
      "Educación ambiental",
    ],
    products: [7], // Quindío Premium
  },
  {
    id: 8,
    name: "Diego Fernando Ospina",
    farmName: "Finca El Mirador",
    location: "Valle del Cauca, Colombia",
    experience: "19 años",
    specialty: "Café Especial",
    coverImage: "/finca-valle-paisaje.jpg",
    profileImage: "/productor-diego-valle.jpg",
    certifications: ["Orgánico", "UTZ Certified"],
    story: `Diego Fernando es un pionero en el cultivo de café especial en el Valle del Cauca. Su finca, El Mirador, está estratégicamente ubicada en una ladera que ofrece condiciones ideales para el café de altura. Diego ha dedicado casi dos décadas a perfeccionar cada aspecto de su producción.

Su enfoque científico y meticuloso ha resultado en cafés con perfiles de sabor únicos que destacan las características especiales del Valle del Cauca. Diego experimenta constantemente con diferentes métodos de procesamiento y fermentación, siempre buscando nuevas formas de expresar el potencial de su terroir.

Diego también es un mentor activo en la comunidad cafetera, compartiendo sus conocimientos técnicos y ayudando a otros productores a mejorar la calidad de sus cafés. Su pasión por la innovación y la excelencia lo ha convertido en un referente en el café especial colombiano.`,
    stats: {
      farmSize: "13 hectáreas",
      altitude: "1,850 msnm",
      varieties: "Bourbon, Typica",
      annualProduction: "100 sacos",
      employees: "7 trabajadores",
      foundedYear: "2005",
    },
    sustainabilityPractices: [
      "Experimentación en procesamiento",
      "Control de calidad riguroso",
      "Fermentación controlada",
      "Trazabilidad completa",
      "Innovación sostenible",
      "Transferencia de conocimiento",
    ],
    products: [8], // Valle del Cauca Especial
  },
  {
    id: 9,
    name: "Sofía Martínez",
    farmName: "Finca Tierra Verde",
    location: "Boyacá, Colombia",
    experience: "12 años",
    specialty: "Café Orgánico",
    coverImage: "/finca-boyaca-paisaje.jpg",
    profileImage: "/productora-sofia-boyaca.jpg",
    certifications: ["Orgánico", "Comercio Justo", "Rainforest Alliance"],
    story: `Sofía Martínez es una joven productora que ha revolucionado el café orgánico en Boyacá. Después de estudiar agricultura sostenible, regresó a su tierra natal con la misión de crear una finca completamente orgánica que sirviera como modelo para otros productores.

Tierra Verde es el resultado de años de dedicación y aprendizaje. Sofía ha implementado un sistema de agricultura orgánica integral que no solo produce café excepcional, sino que también regenera el suelo y protege el ecosistema local. Su café orgánico es apreciado por su pureza y sabor limpio.

A pesar de su juventud, Sofía ya es una líder reconocida en el movimiento de café orgánico en Colombia. Ofrece capacitaciones y asesorías a otros productores que desean hacer la transición a la agricultura orgánica, demostrando que es posible producir café de alta calidad de manera completamente sostenible.`,
    stats: {
      farmSize: "9 hectáreas",
      altitude: "1,950 msnm",
      varieties: "Caturra, Colombia",
      annualProduction: "75 sacos",
      employees: "5 trabajadores",
      foundedYear: "2012",
    },
    sustainabilityPractices: [
      "100% agricultura orgánica",
      "Regeneración de suelos",
      "Cero químicos sintéticos",
      "Compostaje avanzado",
      "Agricultura regenerativa",
      "Educación en agricultura orgánica",
    ],
    products: [9], // Boyacá Orgánico
  },
]

export function getProducerById(id: number): Producer | undefined {
  return producers.find((producer) => producer.id === id)
}

export function getAllProducers(): Producer[] {
  return producers
}
