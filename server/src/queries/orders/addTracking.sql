UPDATE orders
SET
  tracking_number = $1,
  status          = 'shipped',
  updated_at      = NOW()
WHERE id = $2
RETURNING *;
