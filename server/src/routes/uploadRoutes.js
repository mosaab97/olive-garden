const router = require('express').Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Admin only
router.post('/image', auth, isAdmin, upload.single('image'), uploadController.uploadImage);

module.exports = router;
