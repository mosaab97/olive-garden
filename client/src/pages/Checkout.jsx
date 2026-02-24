import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkoutSchema } from '../utils/validators';
import { createOrder, selectOrdersLoading, selectOrdersError } from '../features/orders/ordersSlice';
import useCart from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const US_STATES = ['IL','IN','WI','IA','MO','MI','KY','OH','MN'];

const Checkout = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, subtotal, clear } = useCart();
  const loading   = useSelector(selectOrdersLoading);
  const error     = useSelector(selectOrdersError);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
  });

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
        cost:   0, // placeholder until shipping integration
      },
    };

    const result = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(result)) {
      clear();
      navigate(`/order-confirmation/${result.payload.id}`);
    }
  };

  const tax      = subtotal * 0.1;
  const total    = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl text-olive-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-4">
          <div className="card p-6">
            <h2 className="font-medium text-olive-800 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <Input label="Full name" placeholder="Jane Doe" error={errors.shipping_name?.message} {...register('shipping_name')} />
              <Input label="Street address" placeholder="123 Main St" error={errors.shipping_street?.message} {...register('shipping_street')} />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Input label="State" placeholder="IL" maxLength={2}
                    error={errors.shipping_state?.message} {...register('shipping_state')} />
                  <p className="text-xs text-olive-400 mt-1">We ship to: {US_STATES.join(', ')}</p>
                </div>
                <div className="col-span-1">
                  <Input label="City" placeholder="Chicago" error={errors.shipping_city?.message} {...register('shipping_city')} />
                </div>
                <div className="col-span-1">
                  <Input label="ZIP" placeholder="60601" error={errors.shipping_zip?.message} {...register('shipping_zip')} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Place Order
          </Button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-medium text-olive-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-olive-600">{item.productName} × {item.quantity}</span>
                  <span className="text-olive-800">{formatCurrency(item.price * item.quantity)}</span>
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
              <div className="flex justify-between font-semibold text-olive-900 pt-2 border-t border-cream-200">
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
