-- Script 26: Arreglar políticas RLS para productos (solo admins)
-- Este script permite que los administradores actualicen productos

-- 1. Ver las políticas actuales en la tabla products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';

-- 2. Verificar si RLS está habilitado en products
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- 3. Eliminar políticas existentes que puedan estar bloqueando las actualizaciones
DROP POLICY IF EXISTS "Allow admin to update products" ON products;
DROP POLICY IF EXISTS "Allow producers to update their products" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON products;

-- 4. Crear política para permitir que admins actualicen cualquier producto
CREATE POLICY "Allow admin to update products"
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

-- 5. También crear política para SELECT (lectura) para todos los usuarios autenticados
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Enable read access for all users"
ON products
FOR SELECT
TO authenticated
USING (true);

-- 6. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- 7. Verificar tu rol de admin
SELECT id, email, role 
FROM profiles 
WHERE email = 'alzatehenaojuandavid59@gmail.com';
