import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const adminLinks = [
  { to: '/admin',          label: 'Dashboard',   exact: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders',   label: 'Orders' },
];

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside className="w-56 bg-olive-900 text-olive-200 flex flex-col">
        <div className="px-6 py-5 border-b border-olive-700">
          <p className="font-serif text-lg text-white">Olive  Garden</p>
          <p className="text-xs text-olive-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminLinks.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-olive-700 text-white font-medium'
                    : 'text-olive-300 hover:bg-olive-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-olive-700">
          <button
            onClick={logout}
            className="text-sm text-olive-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
