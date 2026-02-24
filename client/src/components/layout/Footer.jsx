import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-olive-900 text-olive-200 mt-auto">
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <p className="font-serif text-xl text-white mb-2">Olive  Garden</p>
        <p className="text-sm text-olive-400">
          Premium stuffed olives crafted with care. Shipped across Illinois and the Midwest.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-3">Shop</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
          <li><Link to="/cart"     className="hover:text-white transition-colors">Cart</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-3">Account</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/login"    className="hover:text-white transition-colors">Sign In</Link></li>
          <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
          <li><Link to="/profile"  className="hover:text-white transition-colors">My Orders</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-olive-700 text-center py-4 text-xs text-olive-500">
      © {new Date().getFullYear()} Olive  Garden All rights reserved.
    </div>
  </footer>
);

export default Footer;
