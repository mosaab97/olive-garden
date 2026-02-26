DELETE FROM product_images
WHERE id = $1 AND product_id = $2
RETURNING public_id, is_primary;
