-- Unset current default then set the new one, all in one statement
WITH reset AS (
  UPDATE addresses
  SET is_default = FALSE
  WHERE user_id = $1 AND is_default = TRUE
)
UPDATE addresses
SET is_default = TRUE
WHERE id = $2 AND user_id = $1
RETURNING *;
