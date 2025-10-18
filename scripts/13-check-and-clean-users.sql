-- PARTE 1: Verificar si el usuario existe y su estado
-- Reemplaza el email con el que estás intentando registrar
SELECT 
  'auth.users' as tabla,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'juandavidalzatehenao275@gmail.com'

UNION ALL

SELECT 
  'profiles' as tabla,
  id::text,
  email,
  created_at::timestamp,
  created_at
FROM profiles
WHERE email = 'juandavidalzatehenao275@gmail.com';

-- PARTE 2: Si el usuario existe en auth.users pero NO en profiles, 
-- o si quieres eliminar el usuario para volver a registrarlo, ejecuta esto:
-- (DESCOMENTA las siguientes líneas para ejecutar)

/*
-- Eliminar el perfil si existe
DELETE FROM profiles WHERE email = 'juandavidalzatehenao275@gmail.com';

-- Eliminar el usuario de auth.users (esto requiere permisos de admin)
-- ADVERTENCIA: Esto eliminará permanentemente el usuario
DELETE FROM auth.users WHERE email = 'juandavidalzatehenao275@gmail.com';

-- Verificar que se eliminó
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'juandavidalzatehenao275@gmail.com';
*/
