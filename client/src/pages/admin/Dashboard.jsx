import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, selectAllOrders } from '../../features/orders/ordersSlice';
import { fetchProducts, selectAllProducts } from '../../features/products/productsSlice';
import { formatCurrency, formatDate, statusColor } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value }) => (
  <div className="card p-6">
    <p className="text-sm text-olive-500 mb-1">{label}</p>
    <p className="text-3xl font-semibold text-olive-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const dispatch  = useDispatch();
  const orders    = useSelector(selectAllOrders);
  const products  = useSelector(selectAllProducts);

  useEffect(() => {
    dispatch(fetchAllOrders({}));
    dispatch(fetchProducts({}));
  }, []);

  const revenue  = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const pending  = orders.filter((o) => o.status === 'pending').length;

  return (
    <div>
      <h1 className="font-serif text-3xl text-olive-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Orders"    value={orders.length} />
        <StatCard label="Pending Orders"  value={pending} />
        <StatCard label="Total Revenue"   value={formatCurrency(revenue)} />
        <StatCard label="Active Products" value={products.length} />
      </div>

      <h2 className="font-medium text-olive-800 mb-4">Recent Orders</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-olive-600">
            <tr>
              {['Order', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {orders.slice(0, 10).map((order) => (
              <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3 font-medium text-olive-800">#{order.id}</td>
                <td className="px-4 py-3 text-olive-600">
                  {order.first_name} {order.last_name}
                  <span className="block text-xs text-olive-400">{order.customer_email}</span>
                </td>
                <td className="px-4 py-3 text-olive-800">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge className={statusColor(order.status)}>{order.status}</Badge>
                </td>
                <td className="px-4 py-3 text-olive-400">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length > 10 && (
          <div className="px-4 py-3 border-t border-cream-100">
            <Link to="/admin/orders" className="text-sm text-olive-600 hover:underline">
              View all orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
