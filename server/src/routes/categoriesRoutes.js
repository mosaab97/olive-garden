const router = require('express').Router();
const categoriesController = require('../controllers/categoriesController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public
router.get('/', categoriesController.getAll);

// Admin only
router.post('/',   auth, isAdmin, categoriesController.create);
router.put('/:id', auth, isAdmin, categoriesController.update);

module.exports = router;
