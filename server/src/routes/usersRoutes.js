const router = require('express').Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

router.use(auth); // all user routes require auth

router.get('/me',               usersController.getMe);
router.put('/me',               usersController.updateMe);
router.get('/me/addresses',     usersController.getAddresses);
router.post('/me/addresses',    usersController.createAddress);
router.put('/me/addresses/:id', usersController.setDefaultAddress);

module.exports = router;
