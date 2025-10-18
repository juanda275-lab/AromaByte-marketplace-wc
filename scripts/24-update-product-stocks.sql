-- Script 24: Actualizar stocks de productos a los valores originales
-- Este script actualiza los stocks de todos los productos para que coincidan con los valores originales del diseño

-- Actualizar stocks de productos
UPDATE products SET stock = 15 WHERE name = 'Café Huila Premium';
UPDATE products SET stock = 12 WHERE name = 'Nariño Especial';
UPDATE products SET stock = 20 WHERE name = 'Eje Cafetero Clásico';
UPDATE products SET stock = 8 WHERE name = 'Tolima Gourmet';
UPDATE products SET stock = 10 WHERE name = 'Cauca Artesanal';
UPDATE products SET stock = 18 WHERE name = 'Santander Tradicional';
UPDATE products SET stock = 14 WHERE name = 'Quindío Premium';
UPDATE products SET stock = 9 WHERE name = 'Valle del Cauca Especial';
UPDATE products SET stock = 11 WHERE name = 'Boyacá Orgánico';

-- Verificar que los cambios se aplicaron correctamente
SELECT id, name, stock, price 
FROM products 
ORDER BY id;
