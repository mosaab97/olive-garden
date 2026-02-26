SELECT * FROM product_images
WHERE product_id = $1
ORDER BY sort_order ASC, id ASC;
