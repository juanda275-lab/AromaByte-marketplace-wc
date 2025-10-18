-- Script para confirmar manualmente el email del usuario que ya se registró
-- Reemplaza el email con el del usuario que necesita ser confirmado

UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'juandavidalzatehenao275@gmail.com';

-- Verificar que se actualizó correctamente
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = 'juandavidalzatehenao275@gmail.com';
