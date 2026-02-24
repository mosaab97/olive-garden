UPDATE users
SET
  first_name = $1,
  last_name  = $2,
  phone      = $3,
  updated_at = NOW()
WHERE id = $4
RETURNING id, email, first_name, last_name, phone, role, updated_at;
