-- Agregar columnas faltantes a la tabla orders

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP WITH TIME ZONE;

-- Actualizar órdenes existentes sin order_number
UPDATE orders 
SET order_number = 'ORD-' || id || '-' || EXTRACT(EPOCH FROM created_at)::bigint
WHERE order_number IS NULL;

-- Verificar las columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
