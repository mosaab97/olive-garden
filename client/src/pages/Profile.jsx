import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectAllOrders, selectOrdersLoading } from '../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor } from '../utils/helpers';
import useAuth from '../hooks/useAuth';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user }   = useAuth();
  const dispatch   = useDispatch();
  const orders     = useSelector(selectAllOrders);
  const loading    = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchMyOrders()); }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl text-olive-900 mb-2">My Account</h1>
      <p className="text-olive-400 mb-8">Welcome back, {user?.first_name}!</p>

      <h2 className="font-medium text-olive-800 mb-4">Order History</h2>
      {loading ? (
        <Spinner className="py-12" />
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center text-olive-400">
          <p className="mb-4">No orders yet.</p>
          <Link to="/products" className="text-olive-700 font-medium hover:underline">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-olive-800">Order #{order.id}</p>
                  <p className="text-sm text-olive-400">{formatDate(order.created_at)}</p>
                </div>
                <Badge className={statusColor(order.status)}>{order.status}</Badge>
              </div>
              <div className="text-sm text-olive-500 space-y-1">
                {order.items?.map((item) => (
                  <p key={item.id}>{item.product_name} — {item.variant_label} × {item.quantity}</p>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-cream-200">
                <span className="font-semibold text-olive-800">{formatCurrency(order.total)}</span>
                <Link to={`/order-confirmation/${order.id}`} className="text-sm text-olive-600 hover:underline">
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
