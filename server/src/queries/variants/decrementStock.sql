UPDATE product_variants
SET
  stock_qty  = stock_qty - $1,
  updated_at = NOW()
WHERE id = $2
RETURNING *;
