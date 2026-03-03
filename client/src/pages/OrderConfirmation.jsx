import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, selectCurrentOrder, selectOrdersLoading } from '../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const OrderConfirmation = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const order    = useSelector(selectCurrentOrder);
  const loading  = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id]);

  if (loading && !order) return <Spinner className="py-32" />;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <p className="text-5xl mb-4">🫒</p>
      <h1 className="font-serif text-3xl text-olive-900 mb-2">Order Confirmed!</h1>
      <p className="text-olive-500 mb-8">
        Thank you! Your order #{order.id} was placed on {formatDate(order.created_at)}.
        We'll get it ready for you soon.
      </p>

      <div className="card p-6 text-left mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-olive-800">Order #{order.id}</h2>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-olive-600">{item.product_name} — {item.variant_label} × {item.quantity}</span>
              <span className="text-olive-800">{formatCurrency(item.line_total)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-200 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-olive-500">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-olive-500">
            <span>Tax</span><span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-olive-900 text-base pt-2 border-t border-cream-200">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-cream-200 pt-4 mt-4 text-sm text-olive-600">
          <p className="font-medium text-olive-700 mb-1">Shipping to</p>
          <p>{order.shipping_name}</p>
          <p>{order.shipping_street}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/profile"><Button variant="outline">My Orders</Button></Link>
        <Link to={`/orders/${order.id}`}><Button variant="secondary">Track Order</Button></Link>
        <Link to="/products"><Button>Keep Shopping</Button></Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
