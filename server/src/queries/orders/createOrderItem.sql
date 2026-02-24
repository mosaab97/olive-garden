INSERT INTO order_items (
  order_id,
  variant_id,
  product_name,
  variant_label,
  unit_price,
  quantity,
  line_total
) VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
