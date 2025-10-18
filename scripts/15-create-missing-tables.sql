-- Crear tablas faltantes para favoritos y órdenes

-- 1. Crear tabla de favoritos si no existe
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 2. Crear tabla de órdenes si no existe
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de items de órdenes si no existe
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar RLS en todas las tablas
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas RLS para favorites
DROP POLICY IF EXISTS "users_select_own_favorites" ON favorites;
DROP POLICY IF EXISTS "users_insert_own_favorites" ON favorites;
DROP POLICY IF EXISTS "users_delete_own_favorites" ON favorites;

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

-- 6. Crear políticas RLS para orders
DROP POLICY IF EXISTS "users_select_own_orders" ON orders;
DROP POLICY IF EXISTS "users_insert_own_orders" ON orders;
DROP POLICY IF EXISTS "users_update_own_orders" ON orders;

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

-- 7. Crear políticas RLS para order_items (sin recursión)
DROP POLICY IF EXISTS "users_select_order_items" ON order_items;
DROP POLICY IF EXISTS "users_insert_order_items" ON order_items;

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

-- 8. Verificar que todo se creó correctamente
SELECT 
  'Tablas creadas:' as info,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('favorites', 'orders', 'order_items')

UNION ALL

SELECT 
  'Políticas RLS:' as info,
  tablename || ' - ' || policyname as tablename
FROM pg_policies
WHERE tablename IN ('favorites', 'orders', 'order_items')
ORDER BY info, tablename;
