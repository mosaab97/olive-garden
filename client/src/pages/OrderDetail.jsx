import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrderById, cancelOrder,
  selectCurrentOrder, selectOrdersLoading, selectOrdersError,
} from '../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

// Timeline of statuses in order
const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const StatusTimeline = ({ current }) => {
  const isCancelled = ['cancelled', 'refunded'].includes(current);
  const currentIdx  = STATUS_STEPS.indexOf(current);

  if (isCancelled) return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <span>✕</span>
      <span className="font-medium capitalize">{current}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done    = i <= currentIdx;
        const active  = i === currentIdx;
        const isLast  = i === STATUS_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                ${done
                  ? 'bg-olive-600 border-olive-600 text-white'
                  : 'bg-white border-cream-300 text-olive-300'
                }`}>
                {done && !active ? '✓' : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap capitalize
                ${active ? 'text-olive-700 font-medium' : done ? 'text-olive-500' : 'text-olive-300'}`}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mb-4 mx-1 transition-colors
                ${i < currentIdx ? 'bg-olive-600' : 'bg-cream-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderDetail = () => {
  const { id }      = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const order       = useSelector(selectCurrentOrder);
  const loading     = useSelector(selectOrdersLoading);
  const error       = useSelector(selectOrdersError);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setCancelError(null);
    const result = await dispatch(cancelOrder(id));
    if (cancelOrder.rejected.match(result)) {
      setCancelError(result.payload);
    }
    setCancelling(false);
  };

  if (loading && !order) return <Spinner className="py-32" />;

  if (error) return (
    <div className="max-w-2xl mx-auto py-24 text-center">
      <p className="text-olive-400 mb-4">{error}</p>
      <Link to="/profile"><Button variant="outline">Back to Orders</Button></Link>
    </div>
  );

  if (!order) return null;

  const canCancel = order.status === 'pending';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="text-olive-400 hover:text-olive-700 transition-colors"
        >
          ← Back
        </button>
        <h1 className="font-serif text-2xl text-olive-900">Order #{order.id}</h1>
        <Badge className={statusColor(order.status)}>{order.status}</Badge>
      </div>

      {/* Status timeline */}
      <div className="card p-6 mb-4">
        <p className="text-sm font-medium text-olive-700 mb-5">Order Progress</p>
        <StatusTimeline current={order.status} />

        {/* Tracking number */}
        {order.tracking_number && (
          <div className="mt-5 pt-4 border-t border-cream-200">
            <p className="text-sm text-olive-600">
              <span className="font-medium">Tracking number: </span>
              <span className="font-mono text-olive-800">{order.tracking_number}</span>
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card p-6 mb-4">
        <h2 className="font-medium text-olive-800 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-cream-100 last:border-0">
              <div>
                <p className="font-medium text-olive-800">{item.product_name}</p>
                <p className="text-olive-400">{item.variant_label} × {item.quantity}</p>
              </div>
              <span className="font-medium text-olive-700">{formatCurrency(item.line_total)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-cream-200 space-y-1.5 text-sm">
          <div className="flex justify-between text-olive-500">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.shipping_cost > 0 && (
            <div className="flex justify-between text-olive-500">
              <span>Shipping</span><span>{formatCurrency(order.shipping_cost)}</span>
            </div>
          )}
          <div className="flex justify-between text-olive-500">
            <span>Tax</span><span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-olive-900 text-base pt-2 border-t border-cream-200">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="card p-6 mb-4">
        <h2 className="font-medium text-olive-800 mb-3">Shipping To</h2>
        <div className="text-sm text-olive-600 space-y-0.5">
          <p className="font-medium text-olive-800">{order.shipping_name}</p>
          <p>{order.shipping_street}</p>
          <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
        </div>
      </div>

      {/* Order meta */}
      <div className="card p-6 mb-6">
        <h2 className="font-medium text-olive-800 mb-3">Order Info</h2>
        <div className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-olive-500">Order placed</span>
            <span className="text-olive-700">{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-olive-500">Last updated</span>
            <span className="text-olive-700">{formatDate(order.updated_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-olive-500">Order #</span>
            <span className="text-olive-700 font-mono">{order.id}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/profile">
          <Button variant="outline">All Orders</Button>
        </Link>
        {canCancel && (
          <Button
            variant="danger"
            loading={cancelling}
            onClick={handleCancel}
          >
            Cancel Order
          </Button>
        )}
        {cancelError && (
          <p className="text-sm text-red-500 self-center">{cancelError}</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
