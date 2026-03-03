import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders, updateOrderStatus, addTracking,
  selectAllOrders, selectOrdersLoading,
} from '../../features/orders/ordersSlice';
import { formatCurrency, formatDate, statusColor, ORDER_STATUSES } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

// ─── Status badge select ──────────────────────────────────────────────────────
const StatusSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-xs border border-cream-300 rounded-lg px-2 py-1.5 bg-white text-olive-700
               focus:outline-none focus:ring-2 focus:ring-olive-400 cursor-pointer"
  >
    {ORDER_STATUSES.map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
);

// ─── Order Detail Panel ───────────────────────────────────────────────────────
const OrderPanel = ({ order, onClose, onStatusChange, onAddTracking }) => {
  const [trackingInput, setTrackingInput] = useState(order.tracking_number || '');
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingError, setTrackingError]   = useState(null);
  const [trackingSaved, setTrackingSaved]   = useState(false);

  // Reset when order changes
  useEffect(() => {
    setTrackingInput(order.tracking_number || '');
    setTrackingSaved(false);
    setTrackingError(null);
  }, [order.id]);

  const handleSaveTracking = async () => {
    if (!trackingInput.trim()) {
      setTrackingError('Enter a tracking number');
      return;
    }
    setSavingTracking(true);
    setTrackingError(null);
    try {
      await onAddTracking(order.id, trackingInput.trim());
      setTrackingSaved(true);
    } catch (err) {
      setTrackingError(err.message || 'Failed to save');
    } finally {
      setSavingTracking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 shrink-0">
          <div>
            <p className="font-semibold text-olive-900">Order #{order.id}</p>
            <p className="text-xs text-olive-400 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={statusColor(order.status)}>{order.status}</Badge>
            <button onClick={onClose} className="text-olive-400 hover:text-olive-700 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">Status</p>
            <StatusSelect
              value={order.status}
              onChange={(status) => onStatusChange(order.id, status)}
            />
            <p className="text-xs text-olive-400 mt-1.5">
              Changing to "shipped" will notify the customer (when email is set up).
            </p>
          </div>

          {/* Tracking number */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">
              Tracking Number
              </p>
            <div className="flex gap-2">
              <input
                className="input-base flex-1"
                placeholder="e.g. 1Z999AA10123456784"
                value={trackingInput}
                onChange={(e) => { setTrackingInput(e.target.value); setTrackingSaved(false); setTrackingError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTracking(); }}
              />
              <Button
                size="sm"
                loading={savingTracking}
                onClick={handleSaveTracking}
              >
                {trackingSaved ? '✓ Saved' : 'Save'}
              </Button>
            </div>
            {trackingError && <p className="text-xs text-red-500 mt-1">{trackingError}</p>}
            <p className="text-xs text-olive-400 mt-1.5">
              Saving a tracking number automatically sets the status to "shipped".
            </p>
          </div>

          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">Customer</p>
            <div className="card p-4 text-sm space-y-0.5">
              <p className="font-medium text-olive-800">{order.first_name} {order.last_name}</p>
              <p className="text-olive-500">{order.customer_email}</p>
              {order.phone && <p className="text-olive-500">{order.phone}</p>}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">Ship To</p>
            <div className="card p-4 text-sm space-y-0.5">
              <p className="font-medium text-olive-800">{order.shipping_name}</p>
              <p className="text-olive-600">{order.shipping_street}</p>
              <p className="text-olive-600">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">Items</p>
            <div className="card overflow-hidden">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-3 text-sm border-b border-cream-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-olive-800">{item.product_name}</p>
                    <p className="text-olive-400">{item.variant_label} × {item.quantity}</p>
                  </div>
                  <span className="text-olive-700 font-medium">{formatCurrency(item.line_total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div>
            <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-2">Totals</p>
            <div className="card p-4 text-sm space-y-2">
              <div className="flex justify-between text-olive-500">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-olive-500">
                <span>Shipping</span>
                <span>{order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'Free'}</span>
              </div>
              <div className="flex justify-between text-olive-500">
                <span>Tax</span><span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-olive-900 text-base pt-2 border-t border-cream-200">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminOrders = () => {
  const dispatch      = useDispatch();
  const orders        = useSelector(selectAllOrders);
  const loading       = useSelector(selectOrdersLoading);
  const [selected, setSelected] = useState(null);        // order shown in panel
  const [statusFilter, setStatusFilter] = useState('');  // '' = all

  useEffect(() => { dispatch(fetchAllOrders({})); }, []);

  // Keep panel in sync when Redux updates the order
  useEffect(() => {
    if (selected) {
      const updated = orders.find((o) => o.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [orders]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const handleAddTracking = async (id, tracking_number) => {
    const result = await dispatch(addTracking({ id, tracking_number }));
    if (addTracking.rejected.match(result)) throw new Error(result.payload);
  };

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-olive-900">Orders</h1>
        <p className="text-sm text-olive-400">{orders.length} total</p>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
            ${!statusFilter
              ? 'bg-olive-600 text-white'
              : 'bg-cream-100 text-olive-600 hover:bg-cream-200'
            }`}
        >
          All ({orders.length})
        </button>
        {ORDER_STATUSES.map((s) => (
          counts[s] > 0 && (
            <button
              key={s}
              onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize
                ${statusFilter === s
                  ? 'bg-olive-600 text-white'
                  : 'bg-cream-100 text-olive-600 hover:bg-cream-200'
                }`}
            >
              {s} ({counts[s]})
            </button>
          )
        ))}
      </div>

      {loading && !orders.length ? (
        <Spinner className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-olive-400">
          No orders{statusFilter ? ` with status "${statusFilter}"` : ''}.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-olive-600">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className={`hover:bg-cream-50 cursor-pointer transition-colors
                    ${selected?.id === order.id ? 'bg-olive-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-800">#{order.id}</p>
                    {order.tracking_number && (
                      <p className="text-xs text-olive-400 font-mono mt-0.5 truncate max-w-[80px]">
                        {order.tracking_number}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-olive-700">{order.first_name} {order.last_name}</p>
                    <p className="text-xs text-olive-400">{order.shipping_city}, {order.shipping_state}</p>
                  </td>
                  <td className="px-4 py-3 text-olive-500 max-w-[180px]">
                    {order.items?.slice(0, 2).map((item, i) => (
                      <p key={i} className="text-xs truncate">
                        {item.product_name} × {item.quantity}
                      </p>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-xs text-olive-400">+{order.items.length - 2} more</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-olive-800">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      value={order.status}
                      onChange={(status) => handleStatusChange(order.id, status)}
                    />
                  </td>
                  <td className="px-4 py-3 text-olive-400 whitespace-nowrap text-xs">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <OrderPanel
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onAddTracking={handleAddTracking}
        />
      )}
    </div>
  );
};

export default AdminOrders;
