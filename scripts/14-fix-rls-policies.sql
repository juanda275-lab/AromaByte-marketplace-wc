-- Arreglar políticas RLS que causan recursión infinita

-- 1. Eliminar todas las políticas problemáticas de order_items
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios order_items" ON order_items;
DROP POLICY IF EXISTS "Los usuarios pueden insertar order_items" ON order_items;
DROP POLICY IF EXISTS "Los productores pueden ver order_items de sus productos" ON order_items;
DROP POLICY IF EXISTS "Admins pueden ver todos los order_items" ON order_items;

-- 2. Eliminar políticas de orders
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias órdenes" ON orders;
DROP POLICY IF EXISTS "Los usuarios pueden insertar órdenes" ON orders;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus órdenes" ON orders;
DROP POLICY IF EXISTS "Admins pueden ver todas las órdenes" ON orders;

-- 3. Eliminar políticas de favorites
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios favoritos" ON favorites;
DROP POLICY IF EXISTS "Los usuarios pueden insertar favoritos" ON favorites;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus favoritos" ON favorites;

-- 4. Crear políticas simples y sin recursión para orders
CREATE POLICY "users_select_own_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Crear políticas simples para order_items (SIN JOINS que causen recursión)
CREATE POLICY "users_select_order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "users_insert_order_items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 6. Crear políticas simples para favorites
CREATE POLICY "users_select_own_favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_delete_own_favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 7. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('orders', 'order_items', 'favorites')
ORDER BY tablename, policyname;
