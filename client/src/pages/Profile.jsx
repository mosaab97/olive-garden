import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { fetchMyOrders, selectAllOrders, selectOrdersLoading } from '../features/orders/ordersSlice';
import { updateProfile, selectAuthLoading, selectAuthError, selectAuthSuccess, clearMessages } from '../features/auth/authSlice';
import { updateProfileSchema, changePasswordSchema, addressSchema } from '../utils/validators';
import { formatCurrency, formatDate, statusColor } from '../utils/helpers';
import {
  getAddresses, createAddress, updateAddress,
  setDefaultAddress, deleteAddress, changePassword,
} from '../services/authService';

import useAuth from '../hooks/useAuth';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';

// ─── Sidebar Tab Nav ─────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'orders',    label: 'Orders',       icon: '📦' },
  { id: 'profile',   label: 'Personal Info', icon: '👤' },
  { id: 'addresses', label: 'Addresses',    icon: '📍' },
  { id: 'security',  label: 'Security',     icon: '🔒' },
];

// ─── Reusable alert ──────────────────────────────────────────────────────────
const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error:   'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

// ─── Orders Tab ──────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const dispatch = useDispatch();
  const orders   = useSelector(selectAllOrders);
  const loading  = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchMyOrders()); }, []);

  if (loading) return <Spinner className="py-16" />;

  if (orders.length === 0) return (
    <div className="card p-12 text-center text-olive-400">
      <p className="text-4xl mb-3">📦</p>
      <p className="mb-4">No orders yet.</p>
      <Link to="/products" className="text-olive-700 font-medium hover:underline">Start shopping →</Link>
    </div>
  );

  return (
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
          <div className="text-sm text-olive-500 space-y-0.5">
            {order.items?.map((item, i) => (
              <p key={i}>{item.product_name} — {item.variant_label} × {item.quantity}</p>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-cream-200">
            <span className="font-semibold text-olive-800">{formatCurrency(order.total)}</span>
            <Link to={`/order-confirmation/${order.id}`} className="text-sm text-olive-600 hover:underline">
              View details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Personal Info Tab ───────────────────────────────────────────────────────
const PersonalInfoTab = () => {
  const dispatch   = useDispatch();
  const { user }   = useAuth();
  const loading    = useSelector(selectAuthLoading);
  const error      = useSelector(selectAuthError);
  const successMsg = useSelector(selectAuthSuccess);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      phone:      user?.phone      || '',
    },
  });

  useEffect(() => () => { dispatch(clearMessages()); }, []);

  const onSubmit = (data) => dispatch(updateProfile(data));

  return (
    <div className="card p-6 max-w-md">
      <h2 className="font-medium text-olive-800 mb-5">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.first_name?.message} {...register('first_name')} />
          <Input label="Last name"  error={errors.last_name?.message}  {...register('last_name')} />
        </div>
        <Input
          label="Phone"
          type="tel"
          placeholder="6301234567"
          error={errors.phone?.message}
          {...register('phone')}
        />
        {/* Email is read-only — changing email requires re-verification, out of scope for now */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-olive-700">Email</label>
          <input
            className="input-base bg-cream-50 cursor-not-allowed"
            value={user?.email || ''}
            disabled
          />
          <p className="text-xs text-olive-400">Contact support to change your email.</p>
        </div>
        <Alert type="error"   message={error} />
        <Alert type="success" message={successMsg} />
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </div>
  );
};

// ─── Address Form (used in modal) ────────────────────────────────────────────
const AddressForm = ({ address, onSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: address || {},
  });

  useEffect(() => { reset(address || {}); }, [address]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Label"
        placeholder="Home, Work, etc."
        error={errors.label?.message}
        {...register('label')}
      />
      <Input
        label="Street address"
        placeholder="123 Main St"
        error={errors.street?.message}
        required
        {...register('street')}
      />
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="City"
          placeholder="Chicago"
          error={errors.city?.message}
          required
          {...register('city')}
        />
        <Input
          label="State"
          placeholder="IL"
          maxLength={2}
          error={errors.state?.message}
          required
          {...register('state')}
        />
        <Input
          label="ZIP"
          placeholder="60601"
          error={errors.zip?.message}
          required
          {...register('zip')}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {address ? 'Save Address' : 'Add Address'}
      </Button>
    </form>
  );
};

// ─── Addresses Tab ───────────────────────────────────────────────────────────
const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [modal, setModal]         = useState(null); // null | { mode: 'add'|'edit', address? }

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch { setError('Failed to load addresses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (data) => {
    setSaving(true);
    setError(null);
    try {
      if (modal.mode === 'add') {
        await createAddress(data);
      } else {
        await updateAddress(modal.address.id, data);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      load();
    } catch { setError('Failed to update default address'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      await deleteAddress(id);
      load();
    } catch { setError('Failed to delete address'); }
  };

  if (loading) return <Spinner className="py-16" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-medium text-olive-800">Saved Addresses</h2>
        <Button size="sm" onClick={() => setModal({ mode: 'add' })}>+ Add Address</Button>
      </div>

      <Alert type="error" message={error} />

      {addresses.length === 0 ? (
        <div className="card p-10 text-center text-olive-400">
          <p className="text-3xl mb-3">📍</p>
          <p>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`card p-4 relative ${addr.is_default ? 'ring-2 ring-olive-400' : ''}`}
            >
              {addr.is_default && (
                <span className="absolute top-3 right-3 text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
              )}
              {addr.label && (
                <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide mb-1">
                  {addr.label}
                </p>
              )}
              <p className="text-sm text-olive-800">{addr.street}</p>
              <p className="text-sm text-olive-600">{addr.city}, {addr.state} {addr.zip}</p>

              <div className="flex gap-3 mt-4 pt-3 border-t border-cream-200">
                <button
                  onClick={() => setModal({ mode: 'edit', address: addr })}
                  className="text-xs text-olive-600 hover:text-olive-900 font-medium"
                >
                  Edit
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-olive-600 hover:text-olive-900 font-medium"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add Address' : 'Edit Address'}
      >
        {modal && (
          <AddressForm
            address={modal.address}
            onSubmit={handleSubmit}
            loading={saving}
          />
        )}
      </Modal>
    </div>
  );
};

// ─── Security Tab ─────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await changePassword(data);
      setSuccess('Password changed successfully.');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 max-w-md">
      <h2 className="font-medium text-olive-800 mb-5">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current password"
          type="password"
          placeholder="••••••••"
          error={errors.current_password?.message}
          required
          {...register('current_password')}
        />
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          error={errors.new_password?.message}
          required
          {...register('new_password')}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          required
          {...register('confirm_password')}
        />
        <Alert type="error"   message={error} />
        <Alert type="success" message={success} />
        <Button type="submit" loading={loading}>Update Password</Button>
      </form>
    </div>
  );
};

// ─── Main Profile Page ───────────────────────────────────────────────────────
const Profile = () => {
  const { user }              = useAuth();
  const [activeTab, setTab]   = useState('orders');

  const tabContent = {
    orders:    <OrdersTab />,
    profile:   <PersonalInfoTab />,
    addresses: <AddressesTab />,
    security:  <SecurityTab />,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-olive-900">My Account</h1>
        <p className="text-olive-400 mt-1">{user?.email}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar nav */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'bg-olive-100 text-olive-800 font-medium'
                    : 'text-olive-500 hover:bg-cream-100 hover:text-olive-700'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default Profile;
