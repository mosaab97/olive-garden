const router = require('express').Router();
const ordersController = require('../controllers/ordersController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Customer
router.post('/', auth, ordersController.create);
router.get('/mine', auth, ordersController.getMyOrders);
router.get('/:id', auth, ordersController.getById);
router.patch('/:id/cancel', auth, ordersController.cancel);

// Admin
router.get('/', auth, isAdmin, ordersController.getAll);
router.put('/:id/status', auth, isAdmin, ordersController.updateStatus);
router.patch('/:id/tracking', auth, isAdmin, ordersController.addTracking);

module.exports = router;
