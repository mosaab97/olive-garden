-- Unset all, then set the chosen one
WITH reset AS (
  UPDATE product_images
  SET is_primary = FALSE
  WHERE product_id = $1
)
UPDATE product_images
SET is_primary = TRUE
WHERE id = $2 AND product_id = $1
RETURNING *;
