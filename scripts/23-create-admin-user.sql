-- Crear usuario administrador

-- 1. Verificar si el perfil existe
SELECT id, email, role FROM profiles WHERE email = 'alzatehenaojuandavid59@gmail.com';

-- 2. Actualizar el rol a admin si el usuario ya existe
UPDATE profiles 
SET role = 'admin'
WHERE email = 'alzatehenaojuandavid59@gmail.com';

-- 3. Si el usuario no existe, se creará automáticamente cuando inicie sesión por primera vez
-- El trigger de Supabase creará el perfil con rol 'customer' por defecto
-- Luego puedes ejecutar el UPDATE de arriba para cambiar el rol a 'admin'

-- 4. Verificar el resultado
SELECT id, email, role, full_name, created_at 
FROM profiles 
WHERE email = 'alzatehenaojuandavid59@gmail.com';
