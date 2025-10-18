-- Verificar usuarios en auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Verificar perfiles en profiles
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;

-- Verificar que el trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar que la función existe
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
