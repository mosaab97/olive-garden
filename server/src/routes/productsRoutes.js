const router = require('express').Router();
const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public
router.get('/',      productsController.getAll);
router.get('/:slug', productsController.getBySlug);

// Admin only
router.post('/',     auth, isAdmin, productsController.create);
router.put('/:id',   auth, isAdmin, productsController.update);
router.delete('/:id',auth, isAdmin, productsController.remove);

module.exports = router;
