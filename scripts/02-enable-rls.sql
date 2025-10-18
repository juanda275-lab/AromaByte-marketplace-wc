-- Habilitar Row Level Security en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Cualquiera puede ver perfiles públicos"
  ON profiles FOR SELECT
  USING (true);

-- Políticas para producers
CREATE POLICY "Cualquiera puede ver productores"
  ON producers FOR SELECT
  USING (true);

CREATE POLICY "Los productores pueden actualizar su perfil"
  ON producers FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para products
CREATE POLICY "Cualquiera puede ver productos"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Los productores pueden gestionar sus productos"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM producers
      WHERE producers.id = products.producer_id
      AND producers.user_id = auth.uid()
    )
  );

-- Políticas para orders
CREATE POLICY "Los usuarios pueden ver sus propios pedidos"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear pedidos"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los productores pueden ver pedidos de sus productos"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN producers pr ON p.producer_id = pr.id
      WHERE oi.order_id = orders.id
      AND pr.user_id = auth.uid()
    )
  );

-- Políticas para order_items
CREATE POLICY "Los usuarios pueden ver items de sus pedidos"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Políticas para notifications
CREATE POLICY "Los usuarios pueden ver sus notificaciones"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus notificaciones"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus notificaciones"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para product_reviews
CREATE POLICY "Cualquiera puede ver reseñas"
  ON product_reviews FOR SELECT
  USING (true);

CREATE POLICY "Los usuarios pueden crear reseñas"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus reseñas"
  ON product_reviews FOR UPDATE
  USING (auth.uid() = user_id);
