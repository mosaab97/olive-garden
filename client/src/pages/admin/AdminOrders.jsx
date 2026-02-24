import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
  selectAllOrders,
  selectOrdersLoading,
} from '../../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor, ORDER_STATUSES } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders   = useSelector(selectAllOrders);
  const loading  = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchAllOrders({})); }, []);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-olive-900 mb-8">Orders</h1>

      {loading ? (
        <Spinner className="py-16" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-olive-600">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors align-top">
                  <td className="px-4 py-4 font-medium text-olive-800">#{order.id}</td>
                  <td className="px-4 py-4 text-olive-600">
                    <p>{order.first_name} {order.last_name}</p>
                    <p className="text-xs text-olive-400">{order.customer_email}</p>
                    <p className="text-xs text-olive-400 mt-1">
                      {order.shipping_city}, {order.shipping_state}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-olive-500 max-w-xs">
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-xs">
                        {item.product_name} – {item.variant_label} × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-semibold text-olive-800">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs border border-cream-300 rounded-lg px-2 py-1 bg-white text-olive-700
                                 focus:outline-none focus:ring-2 focus:ring-olive-400"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-olive-400 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
