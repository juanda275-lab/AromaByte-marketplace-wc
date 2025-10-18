-- Arreglar recursión infinita en order_items

-- 1. Agregar user_id a order_items para evitar JOIN en RLS
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- 2. Actualizar user_id en order_items existentes
UPDATE order_items oi
SET user_id = o.user_id
FROM orders o
WHERE oi.order_id = o.id AND oi.user_id IS NULL;

-- 3. Eliminar TODAS las políticas existentes de order_items
DROP POLICY IF EXISTS "users_select_order_items" ON order_items;
DROP POLICY IF EXISTS "users_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "Los usuarios pueden ver items de sus pedidos" ON order_items;
DROP POLICY IF EXISTS "Los usuarios pueden insertar order_items" ON order_items;
DROP POLICY IF EXISTS "Los productores pueden ver order_items de sus productos" ON order_items;
DROP POLICY IF EXISTS "Admins pueden ver todos los order_items" ON order_items;

-- 4. Crear políticas simples SIN recursión
CREATE POLICY "users_view_own_order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_create_order_items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5. Crear trigger para auto-llenar user_id en order_items
CREATE OR REPLACE FUNCTION set_order_item_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Obtener el user_id de la orden
  SELECT user_id INTO NEW.user_id
  FROM orders
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_order_item_user_id_trigger ON order_items;
CREATE TRIGGER set_order_item_user_id_trigger
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION set_order_item_user_id();

-- 6. Verificar las políticas
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'order_items'
ORDER BY policyname;
