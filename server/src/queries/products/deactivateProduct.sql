UPDATE products
SET is_active = FALSE, updated_at = NOW()
WHERE id = $1;
