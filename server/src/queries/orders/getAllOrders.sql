SELECT
  o.*,
  u.email AS customer_email,
  u.first_name,
  u.last_name,
  json_agg(
    json_build_object(
      'id',            oi.id,
      'product_name',  oi.product_name,
      'variant_label', oi.variant_label,
      'quantity',      oi.quantity,
      'line_total',    oi.line_total
    )
  ) AS items
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE ($1::text IS NULL OR o.status = $1)
GROUP BY o.id, u.email, u.first_name, u.last_name
ORDER BY o.created_at DESC
LIMIT $2 OFFSET $3;
