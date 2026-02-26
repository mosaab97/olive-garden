const router = require('express').Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/me',                      usersController.getMe);
router.put('/me',                      usersController.updateMe);
router.put('/me/password',             usersController.changePassword);
router.get('/me/addresses',            usersController.getAddresses);
router.post('/me/addresses',           usersController.createAddress);
router.put('/me/addresses/:id',        usersController.updateAddress);
router.patch('/me/addresses/:id/default', usersController.setDefaultAddress);
router.delete('/me/addresses/:id',     usersController.deleteAddress);

module.exports = router;
