UPDATE orders
SET status = 'cancelled', updated_at = NOW()
WHERE id = $1
  AND user_id = $2
  AND status = 'pending'
RETURNING *;
