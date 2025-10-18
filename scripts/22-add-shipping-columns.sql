-- Agregar columnas separadas para información de envío

-- 1. Ver columnas actuales de orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 2. Agregar columnas de envío si no existen
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_zip VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100) DEFAULT 'Colombia';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(50);

-- 3. Hacer shipping_address nullable si no lo es (ya que ahora tenemos campos separados)
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;

-- 4. Verificar las nuevas columnas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name LIKE 'shipping%'
ORDER BY column_name;
