import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectAllOrders } from '../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const OrderConfirmation = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const orders    = useSelector(selectAllOrders);
  const order     = orders.find((o) => o.id === parseInt(id));

  useEffect(() => { if (!order) dispatch(fetchMyOrders()); }, []);

  if (!order) return <Spinner className="py-32" />;

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <p className="text-5xl mb-4">🫒</p>
      <h1 className="font-serif text-3xl text-olive-900 mb-2">Order Confirmed!</h1>
      <p className="text-olive-500 mb-8">
        Thank you! Your order #{order.id} was placed on {formatDate(order.created_at)}.
      </p>

      <div className="card p-6 text-left mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-olive-800">Order #{order.id}</h2>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-olive-600">{item.product_name} — {item.variant_label} × {item.quantity}</span>
              <span className="text-olive-800">{formatCurrency(item.line_total)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-200 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-olive-500">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-olive-500">
            <span>Tax</span><span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-olive-900 pt-2">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-cream-200 pt-4 mt-4 text-sm text-olive-500">
          <p className="font-medium text-olive-700 mb-1">Shipping to</p>
          <p>{order.shipping_name}</p>
          <p>{order.shipping_street}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/profile"><Button variant="outline">View All Orders</Button></Link>
        <Link to="/products"><Button>Keep Shopping</Button></Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
