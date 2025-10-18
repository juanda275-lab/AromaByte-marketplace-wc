-- Deshabilitar RLS temporalmente en la tabla profiles para permitir el registro
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
