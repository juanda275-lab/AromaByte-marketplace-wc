-- Script 28: Actualizar perfil de Eduardo Marin con contenido completo
-- Este script agrega una historia completa y datos al productor Eduardo Marin

-- 1. Ver el perfil actual de Eduardo Marin
SELECT * FROM producers WHERE id = 11;

-- Actualizado farm_name a "Finca La Poderosa" y agregadas más certificaciones
-- 2. Actualizar el perfil de Eduardo Marin con contenido completo
UPDATE producers
SET 
  farm_name = 'Finca La Poderosa',
  location = 'Huila, Colombia',
  story = 'Eduardo Marin es un caficultor de tercera generación que ha dedicado su vida al cultivo de café especial en las montañas de Huila. Su finca, La Poderosa, se encuentra a 1,850 metros sobre el nivel del mar, donde las condiciones climáticas perfectas y el suelo volcánico rico en nutrientes producen granos de café excepcionales.

Con más de 20 años de experiencia, Eduardo ha perfeccionado técnicas de cultivo sostenible que respetan el medio ambiente y producen café de la más alta calidad. Su pasión por el café va más allá del cultivo: cada grano es cuidadosamente seleccionado y procesado para garantizar que llegue a tu taza con todo su sabor y aroma característicos.

La Finca La Poderosa no solo produce café excepcional, sino que también es un modelo de agricultura sostenible en la región. Eduardo implementa prácticas orgánicas certificadas, sistemas de riego eficientes y programas de comercio justo que benefician tanto a la tierra como a la comunidad local.

Cada cosecha es un testimonio del compromiso de Eduardo con la excelencia. Desde la selección de las semillas hasta el secado final, cada paso del proceso es supervisado personalmente para asegurar que solo los mejores granos lleguen al mercado internacional.

La Poderosa es más que una finca de café: es un legado familiar, un compromiso con la sostenibilidad y una promesa de calidad que Eduardo mantiene con orgullo cada día.',
  experience_years = 20,
  altitude = '1850 msnm',
  varieties = 'Caturra, Castillo, Colombia',
  certifications = ARRAY['Orgánico', 'Comercio Justo', 'Rainforest Alliance', 'UTZ Certified', '4C Association'],
  specialty = 'Café de Especialidad Premium',
  farm_size = '8 hectáreas',
  annual_production = '1200 kg/año',
  employees = '8',
  founded_year = 2004,
  sustainability_practices = ARRAY['Cultivo orgánico certificado', 'Conservación del agua', 'Energía solar', 'Compostaje natural', 'Reforestación'],
  profile_image = '/lush-coffee-farm.png',
  cover_image = '/rustic-coffee-bag.png',
  updated_at = NOW()
WHERE id = 11;

-- 3. Verificar que los cambios se aplicaron correctamente
SELECT 
  id,
  farm_name,
  location,
  experience_years,
  altitude,
  varieties,
  certifications,
  specialty,
  LEFT(story, 100) as story_preview
FROM producers 
WHERE id = 11;

-- 4. Verificar cuántos productos tiene Eduardo Marin
SELECT COUNT(*) as product_count
FROM products
WHERE producer_id = (SELECT user_id FROM producers WHERE id = 11);
