-- Script 27: Arreglar políticas RLS para la tabla producers
-- Permite que los productores creen y actualicen sus propios perfiles

-- 1. Ver las políticas actuales en la tabla producers
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'producers';

-- 2. Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'producers';

-- 3. Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Allow producers to insert their profile" ON producers;
DROP POLICY IF EXISTS "Allow producers to update their profile" ON producers;
DROP POLICY IF EXISTS "Allow producers to read their profile" ON producers;
DROP POLICY IF EXISTS "Allow public to read producers" ON producers;
DROP POLICY IF EXISTS "Allow admin to manage producers" ON producers;

-- 4. Crear política para permitir que productores creen su propio perfil
CREATE POLICY "Allow producers to insert their profile"
ON producers
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'producer'
  )
);

-- 5. Crear política para permitir que productores actualicen su propio perfil
CREATE POLICY "Allow producers to update their profile"
ON producers
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'producer'
  )
)
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'producer'
  )
);

-- 6. Crear política para permitir que productores lean su propio perfil
CREATE POLICY "Allow producers to read their profile"
ON producers
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'producer')
  )
);

-- 7. Crear política para permitir lectura pública de productores
CREATE POLICY "Allow public to read producers"
ON producers
FOR SELECT
TO authenticated
USING (true);

-- 8. Crear política para permitir que admins gestionen todos los productores
CREATE POLICY "Allow admin to manage producers"
ON producers
FOR ALL
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

-- 9. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'producers'
ORDER BY cmd, policyname;
