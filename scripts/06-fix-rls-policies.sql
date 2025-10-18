-- Eliminar políticas restrictivas y crear nuevas que permitan el registro
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Cualquiera puede ver perfiles públicos" ON profiles;

-- Política para permitir que los usuarios creen su propio perfil durante el registro
CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política para que los usuarios vean su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Política para que los usuarios actualicen su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Política para que todos puedan ver perfiles públicos (necesario para mostrar productores)
CREATE POLICY "Todos pueden ver perfiles de productores"
  ON profiles FOR SELECT
  USING (role = 'producer' OR role = 'admin');
