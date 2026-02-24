const router = require('express').Router();
const variantsController = require('../controllers/variantsController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public
router.get('/', variantsController.getByProduct); // ?product_id=

// Admin only
router.post('/',     auth, isAdmin, variantsController.create);
router.put('/:id',   auth, isAdmin, variantsController.update);
router.delete('/:id',auth, isAdmin, variantsController.remove);

module.exports = router;
