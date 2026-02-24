INSERT INTO orders (
  user_id,
  shipping_name,
  shipping_street,
  shipping_city,
  shipping_state,
  shipping_zip,
  subtotal,
  shipping_cost,
  tax,
  total,
  stripe_payment_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;
