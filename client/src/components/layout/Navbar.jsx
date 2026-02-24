import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();

  return (
    <nav className="bg-white border-b border-cream-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-serif text-2xl text-olive-700 tracking-tight">
          Olive <span className="text-earth-500"></span> Garden
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'text-olive-700' : 'text-olive-500 hover:text-olive-700 transition-colors'
            }
          >
            Shop
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'text-olive-700' : 'text-olive-500 hover:text-olive-700 transition-colors'
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative text-olive-600 hover:text-olive-800 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-olive-600 text-white text-xs rounded-full
                               h-4 w-4 flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-olive-600 hover:text-olive-800">
                {user.first_name}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-olive-400 hover:text-olive-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login"    className="text-olive-600 hover:text-olive-800">Sign in</Link>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
