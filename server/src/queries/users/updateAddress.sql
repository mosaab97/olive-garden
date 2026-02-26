UPDATE addresses
SET
  label  = $1,
  street = $2,
  city   = $3,
  state  = $4,
  zip    = $5
WHERE id = $6 AND user_id = $7
RETURNING *;
