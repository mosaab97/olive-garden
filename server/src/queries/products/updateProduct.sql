UPDATE products
SET
  category_id  = $1,
  name         = $2,
  slug         = $3,
  description  = $4,
  ingredients  = $5,
  is_active    = $6,
  updated_at   = NOW()
WHERE id = $7
RETURNING *;
