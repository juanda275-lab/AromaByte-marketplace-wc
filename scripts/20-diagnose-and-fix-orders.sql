-- Paso 1: Ver el esquema actual de orders
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Paso 2: Renombrar total_amount a total si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'total_amount'
    ) THEN
        ALTER TABLE orders RENAME COLUMN total_amount TO total;
    END IF;
END $$;

-- Paso 3: Asegurar que total existe y no es nullable
ALTER TABLE orders ALTER COLUMN total SET NOT NULL;
ALTER TABLE orders ALTER COLUMN total SET DEFAULT 0;

-- Paso 4: Verificar el resultado final
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('total', 'total_amount')
ORDER BY ordinal_position;
