const router = require('express').Router();

router.use('/auth',       require('./authRoutes'));
router.use('/users',      require('./usersRoutes'));
router.use('/products',   require('./productsRoutes'));
router.use('/variants',   require('./variantsRoutes'));
router.use('/orders',     require('./ordersRoutes'));
router.use('/categories', require('./categoriesRoutes'));
router.use('/upload',     require('./uploadRoutes'));

module.exports = router;
