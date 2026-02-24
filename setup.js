const fs = require('fs');
const path = require('path');

const structure = {
  'server': {
    'src': {
      'config': ['db.js', 'stripe.js', 'cloudinary.js'],
      'routes': [
        'index.js', 
        'authRoutes.js', 
        'usersRoutes.js', 
        'productsRoutes.js', 
        'variantsRoutes.js', 
        'ordersRoutes.js', 
        'categoriesRoutes.js', 
        'uploadRoutes.js'
      ],
      'controllers': [
        'authController.js', 
        'usersController.js', 
        'productsController.js',
        'variantsController.js', 
        'ordersController.js', 
        'categoriesController.js', 
        'uploadController.js'
      ],
      'services': [
        'authService.js', 
        'usersService.js', 
        'productsService.js',
        'variantsService.js', 
        'ordersService.js', 
        'categoriesService.js', 
        'uploadService.js'
      ],
      'middleware': ['auth.js', 'isAdmin.js', 'errorHandler.js', 'validate.js'],
      'utils': ['apiError.js', 'asyncHandler.js', 'slugify.js', 'loadQuery.js'],
      'queries': {
        'auth': ['getUserByEmail.sql', 'createUser.sql'],
        'users': [
          'getUserById.sql', 
          'updateUser.sql', 
          'getAddressesByUser.sql',
          'createAddress.sql', 
          'setDefaultAddress.sql'
        ],
        'products': [
          'getAllProducts.sql', 
          'getProductBySlug.sql', 
          'getProductById.sql',
          'createProduct.sql', 
          'updateProduct.sql', 
          'deactivateProduct.sql'
        ],
        'variants': [
          'getVariantsByProduct.sql', 
          'getVariantById.sql', 
          'createVariant.sql',
          'updateVariant.sql', 
          'decrementStock.sql', 
          'deactivateVariant.sql'
        ],
        'categories': ['getAllCategories.sql', 'createCategory.sql', 'updateCategory.sql'],
        'orders': [
          'createOrder.sql', 
          'createOrderItem.sql', 
          'getOrderById.sql',
          'getOrdersByUser.sql', 
          'getAllOrders.sql', 
          'updateOrderStatus.sql'
        ]
      }
    }
  }
};

function createStructure(basePath, structure) {
  Object.entries(structure).forEach(([key, value]) => {
    const currentPath = path.join(basePath, key);
    
    if (Array.isArray(value)) {
      // Create files
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      value.forEach(file => {
        const filePath = path.join(currentPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '');
          console.log(`Created: ${filePath}`);
        }
      });
    } else {
      // Create directory and recurse
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      createStructure(currentPath, value);
    }
  });
}

// Create root files
const rootFiles = ['.env', '.env.example', '.gitignore', 'package.json', 'server.js'];
rootFiles.forEach(file => {
  const filePath = path.join('server', file);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`Created: ${filePath}`);
  }
});

// Create the structure
createStructure('.', structure);

console.log('Folder structure created successfully!');