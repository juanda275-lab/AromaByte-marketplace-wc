-- Verificar si la columna price existe en order_items
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'price'
    ) THEN
        -- Si no existe, renombrar unit_price a price
        ALTER TABLE order_items RENAME COLUMN unit_price TO price;
    END IF;
END $$;

-- Verificar las columnas finales
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;
