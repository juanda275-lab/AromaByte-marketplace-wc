-- Script 25: Arreglar políticas RLS para permitir actualizaciones de productos por admins
-- Este script permite que los administradores puedan actualizar productos

-- 1. Ver las políticas RLS actuales en la tabla products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';

-- 2. Verificar si RLS está habilitado en products
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'products';

-- 3. Eliminar políticas existentes que puedan estar bloqueando updates
DROP POLICY IF EXISTS "Allow admin to update products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;

-- 4. Crear política que permita a admins actualizar productos
CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. Crear política que permita a productores actualizar sus propios productos
CREATE POLICY "Producers can update own products"
ON products
FOR UPDATE
TO authenticated
USING (
  producer_id IN (
    SELECT id FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'producer'
  )
)
WITH CHECK (
  producer_id IN (
    SELECT id FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'producer'
  )
);

-- 6. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'products'
AND cmd = 'UPDATE';

-- 7. Probar actualización de un producto (esto debería funcionar ahora)
-- Nota: Reemplaza el ID con un producto real de tu base de datos
UPDATE products 
SET stock = stock 
WHERE id = 1;

SELECT 'Políticas RLS actualizadas correctamente' as status;
