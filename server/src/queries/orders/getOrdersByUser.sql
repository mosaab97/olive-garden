SELECT
  o.*,
  json_agg(
    json_build_object(
      'id',            oi.id,
      'product_name',  oi.product_name,
      'variant_label', oi.variant_label,
      'unit_price',    oi.unit_price,
      'quantity',      oi.quantity,
      'line_total',    oi.line_total
    )
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = $1
GROUP BY o.id
ORDER BY o.created_at DESC;
