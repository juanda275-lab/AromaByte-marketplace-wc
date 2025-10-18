-- Eliminar la columna total_amount duplicada

-- 1. Ver las columnas actuales relacionadas con total
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name LIKE '%total%'
ORDER BY column_name;

-- 2. Copiar datos de total a total_amount si total_amount tiene datos
UPDATE orders 
SET total_amount = total 
WHERE total_amount IS NULL AND total IS NOT NULL;

-- 3. Eliminar la columna total_amount (ya que el API usa 'total')
ALTER TABLE orders DROP COLUMN IF EXISTS total_amount;

-- 4. Asegurar que total tiene las restricciones correctas
ALTER TABLE orders ALTER COLUMN total SET NOT NULL;
ALTER TABLE orders ALTER COLUMN total SET DEFAULT 0;

-- 5. Verificar el resultado
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name LIKE '%total%'
ORDER BY column_name;
