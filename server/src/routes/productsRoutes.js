const router  = require('express').Router();
const multer  = require('multer');
const productsController = require('../controllers/productsController');
const auth    = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const upload  = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// Public
router.get('/',       productsController.getAll);
router.get('/:slug',  productsController.getBySlug);

// Admin — product CRUD
router.post('/',      auth, isAdmin, productsController.create);
router.put('/:id',    auth, isAdmin, productsController.update);
router.delete('/:id', auth, isAdmin, productsController.remove);

// Admin — image management (uses :id not :slug)
router.get('/:id/images',                        auth, isAdmin, productsController.getImages);
router.post('/:id/images',                       auth, isAdmin, upload.single('image'), productsController.uploadImage);
router.patch('/:id/images/:imageId/primary',     auth, isAdmin, productsController.setPrimaryImage);
router.delete('/:id/images/:imageId',            auth, isAdmin, productsController.deleteImage);

module.exports = router;
