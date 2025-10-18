-- Script para resetear la contraseña de un usuario
-- IMPORTANTE: Reemplaza 'tu-email@ejemplo.com' y 'nueva-contraseña-segura' con tus datos

-- Opción 1: Ver el estado completo del usuario
SELECT 
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'juandavidalzatehenao275@gmail.com';

-- Opción 2: Si necesitas resetear la contraseña, usa la función de Supabase
-- Ve a Authentication > Users en Supabase Dashboard
-- Busca el usuario y haz clic en los 3 puntos > "Reset Password"
-- O usa el siguiente comando (requiere extensión pgcrypto):

-- Primero verifica que la extensión esté habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Luego actualiza la contraseña (reemplaza con tu email y nueva contraseña)
UPDATE auth.users
SET 
  encrypted_password = crypt('TuNuevaContraseña123!', gen_salt('bf')),
  email_confirmed_at = NOW()
WHERE email = 'juandavidalzatehenao275@gmail.com';
