UPDATE categories
SET
  name        = $1,
  slug        = $2,
  description = $3
WHERE id = $4
RETURNING *;
