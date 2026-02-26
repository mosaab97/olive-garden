import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkoutSchema } from '../utils/validators';
import { createOrder, selectOrdersLoading, selectOrdersError } from '../features/orders/ordersSlice';
import { getAddresses } from '../services/authService';
import useCart from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const US_STATES = ['IL', 'IN', 'WI', 'IA', 'MO', 'MI', 'KY', 'OH', 'MN'];

const Checkout = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, subtotal, clear } = useCart();
  const loading   = useSelector(selectOrdersLoading);
  const error     = useSelector(selectOrdersError);

  const [addresses, setAddresses]           = useState([]);
  const [selectedAddressId, setSelectedId]  = useState(null); // null = manual entry
  const [loadingAddr, setLoadingAddr]       = useState(true);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
  });

  // Load saved addresses on mount
  useEffect(() => {
    getAddresses()
      .then((data) => {
        setAddresses(data);
        // Pre-select default address if one exists
        const def = data.find((a) => a.is_default) || data[0];
        if (def) {
          setSelectedId(def.id);
          prefillForm(def);
        }
      })
      .catch(() => {}) // guest or no addresses — fall through to manual
      .finally(() => setLoadingAddr(false));
  }, []);

  const prefillForm = (addr) => {
    setValue('shipping_name',   `${addr.label || ''}`.trim() || '');
    setValue('shipping_street', addr.street);
    setValue('shipping_city',   addr.city);
    setValue('shipping_state',  addr.state);
    setValue('shipping_zip',    addr.zip);
  };

  const handleAddressSelect = (addr) => {
    setSelectedId(addr.id);
    prefillForm(addr);
  };

  const handleManualEntry = () => {
    setSelectedId(null);
    reset();
  };

  const onSubmit = async (values) => {
    const payload = {
      items: items.map((i) => ({
        variant_id:    i.variantId,
        product_name:  i.productName,
        variant_label: i.variantLabel,
        unit_price:    i.price,
        quantity:      i.quantity,
      })),
      shipping: {
        name:   values.shipping_name,
        street: values.shipping_street,
        city:   values.shipping_city,
        state:  values.shipping_state,
        zip:    values.shipping_zip,
        cost:   0,
      },
    };

    const result = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(result)) {
      clear();
      navigate(`/order-confirmation/${result.payload.id}`);
    }
  };

  const tax   = subtotal * 0.1;
  const total = subtotal + tax;

  if (loadingAddr) return <Spinner className="py-32" />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl text-olive-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">

          {/* ── Saved addresses ── */}
          {addresses.length > 0 && (
            <div className="card p-5">
              <h2 className="font-medium text-olive-800 mb-4">Ship to a saved address</h2>
              <div className="space-y-2 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${selectedAddressId === addr.id
                        ? 'border-olive-500 bg-olive-50'
                        : 'border-cream-200 hover:border-olive-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="saved_address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => handleAddressSelect(addr)}
                      className="mt-0.5 accent-olive-600"
                    />
                    <div>
                      {addr.label && (
                        <p className="text-xs font-semibold text-olive-500 uppercase tracking-wide">
                          {addr.label}
                        </p>
                      )}
                      <p className="text-sm text-olive-800">{addr.street}</p>
                      <p className="text-sm text-olive-500">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                    {addr.is_default && (
                      <span className="ml-auto text-xs bg-olive-100 text-olive-600 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </label>
                ))}

                {/* Manual entry option */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedAddressId === null
                      ? 'border-olive-500 bg-olive-50'
                      : 'border-cream-200 hover:border-olive-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="saved_address"
                    checked={selectedAddressId === null}
                    onChange={handleManualEntry}
                    className="accent-olive-600"
                  />
                  <span className="text-sm text-olive-700 font-medium">Enter a different address</span>
                </label>
              </div>
            </div>
          )}

          {/* ── Shipping form ── */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`card p-5 space-y-4 ${selectedAddressId !== null && addresses.length > 0 ? 'opacity-60 pointer-events-none' : ''}`}>
              <h2 className="font-medium text-olive-800">
                {addresses.length > 0 ? 'Or enter address manually' : 'Shipping Address'}
              </h2>

              <Input
                label="Full name"
                placeholder="Jane Doe"
                error={errors.shipping_name?.message}
                required
                {...register('shipping_name')}
              />
              <Input
                label="Street address"
                placeholder="123 Main St"
                error={errors.shipping_street?.message}
                required
                {...register('shipping_street')}
              />
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="City"
                  placeholder="Chicago"
                  error={errors.shipping_city?.message}
                  required
                  {...register('shipping_city')}
                />
                <Input
                  label="State"
                  placeholder="IL"
                  maxLength={2}
                  error={errors.shipping_state?.message}
                  required
                  {...register('shipping_state')}
                />
                <Input
                  label="ZIP"
                  placeholder="60601"
                  error={errors.shipping_zip?.message}
                  required
                  {...register('shipping_zip')}
                />
              </div>
              <p className="text-xs text-olive-400">
                We ship to: {US_STATES.join(', ')}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mt-4">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full mt-4"
            >
              Place Order
            </Button>
          </form>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-medium text-olive-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-olive-600 truncate mr-2">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="text-olive-800 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-olive-500">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-olive-500">
                <span>Tax (10%)</span><span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-olive-400">
                <span>Shipping</span><span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-olive-900 text-lg pt-2 border-t border-cream-200">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
