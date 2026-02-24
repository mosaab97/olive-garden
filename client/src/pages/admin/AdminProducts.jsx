import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../utils/validators';
import useProducts from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const ProductForm = ({ product, onSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: product || {},
  });

  useEffect(() => { reset(product || {}); }, [product]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name"        error={errors.name?.message}        {...register('name')} />
      <Input label="Slug"        error={errors.slug?.message}        {...register('slug')} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-olive-700">Description</label>
        <textarea
          className="input-base"
          rows={3}
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <Input label="Ingredients" error={errors.ingredients?.message} {...register('ingredients')} />
      <Button type="submit" loading={loading} className="w-full">
        {product ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

const AdminProducts = () => {
  const { products, loading, fetchAll, create, update, remove } = useProducts();
  const [modal, setModal]     = useState(null); // null | { mode: 'create'|'edit', product? }

  useEffect(() => { fetchAll({}); }, []);

  const handleSubmit = async (data) => {
    if (modal.mode === 'create') await create(data);
    else await update(modal.product.id, data);
    setModal(null);
    fetchAll({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    await remove(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-olive-900">Products</h1>
        <Button onClick={() => setModal({ mode: 'create' })}>+ New Product</Button>
      </div>

      {loading ? (
        <Spinner className="py-16" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-olive-600">
              <tr>
                {['Name', 'Category', 'Variants', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-800">{p.name}</p>
                    <p className="text-xs text-olive-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-olive-600">{p.category_name || '—'}</td>
                  <td className="px-4 py-3 text-olive-600">{p.variants?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setModal({ mode: 'edit', product: p })}
                        className="text-olive-600 hover:text-olive-900 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'New Product' : 'Edit Product'}
      >
        {modal && (
          <ProductForm
            product={modal.product}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminProducts;
