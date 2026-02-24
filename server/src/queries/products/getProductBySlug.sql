SELECT
  p.*,
  c.name AS category_name,
  COALESCE(
    (
      SELECT json_agg(img ORDER BY img.sort_order)
      FROM (
        SELECT * FROM product_images
        WHERE product_id = p.id
      ) img
    ),
    '[]'
  ) AS images,
  COALESCE(
    (
      SELECT json_agg(v)
      FROM (
        SELECT * FROM product_variants
        WHERE product_id = p.id AND is_active = TRUE
        ORDER BY size_oz ASC, filling ASC
      ) v
    ),
    '[]'
  ) AS variants
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.slug = $1
GROUP BY p.id, c.name;
