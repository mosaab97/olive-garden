UPDATE product_variants
SET
  sku        = $1,
  filling    = $2,
  size_oz    = $3,
  label      = $4,
  price      = $5,
  stock_qty  = $6,
  weight_lbs = $7,
  is_active  = $8,
  updated_at = NOW()
WHERE id = $9
RETURNING *;
