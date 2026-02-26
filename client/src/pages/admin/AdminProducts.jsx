import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema, variantSchema } from '../../utils/validators';
import useProducts from '../../hooks/useProducts';
import {
  getCategories,
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getProductImages,
  uploadProductImage,
  setPrimaryImage,
  deleteProductImage,
} from '../../services/productsService';
import { formatCurrency, slugify } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

// ─── Modal ────────────────────────────────────────────────────────────────────
// Wider modal specifically for product management
const ProductModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {children}
      </div>
    </div>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-cream-200">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => !tab.disabled && onChange(tab.id)}
        disabled={tab.disabled}
        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
          ${active === tab.id
            ? 'border-olive-600 text-olive-700'
            : tab.disabled
              ? 'border-transparent text-olive-300 cursor-not-allowed'
              : 'border-transparent text-olive-500 hover:text-olive-700'
          }`}
      >
        {tab.label}
        {tab.badge != null && (
          <span className="ml-2 bg-olive-100 text-olive-600 text-xs px-1.5 py-0.5 rounded-full">
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ─── Product Details Form ─────────────────────────────────────────────────────
const ProductDetailsForm = ({ product, categories, onSubmit, loading }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: product
      ? { ...product, category_id: product.category_id ?? '' }
      : {},
  });

  useEffect(() => {
    reset(product ? { ...product, category_id: product.category_id ?? '' } : {});
  }, [product]);

  // Auto-generate slug from name when creating
  const nameValue = watch('name');
  useEffect(() => {
    if (!product && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  }, [nameValue, product]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product Name"
          placeholder="Carrot Stuffed Olives"
          error={errors.name?.message}
          required
          {...register('name')}
        />
        <Input
          label="Slug"
          placeholder="carrot-stuffed-olives"
          error={errors.slug?.message}
          required
          {...register('slug')}
        />
      </div>

      <Select
        label="Category"
        placeholder="— Select a category —"
        options={categoryOptions}
        error={errors.category_id?.message}
        {...register('category_id')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-olive-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`input-base ${errors.description ? 'input-error' : ''}`}
          rows={3}
          placeholder="Crisp, briny olives stuffed with fresh carrot..."
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-olive-700">Ingredients</label>
        <textarea
          className="input-base"
          rows={2}
          placeholder="Green olives, fresh carrots, olive oil, sea salt..."
          {...register('ingredients')}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="is_active" className="rounded" {...register('is_active')} />
        <label htmlFor="is_active" className="text-sm text-olive-700">Active (visible to customers)</label>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {product ? 'Save Changes' : 'Create Product & Add Variants →'}
      </Button>
    </form>
  );
};

// ─── Variant Form (inline add/edit) ──────────────────────────────────────────
const VariantForm = ({ variant, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(variantSchema),
    defaultValues: variant || { stock_qty: 0 },
  });

  useEffect(() => { reset(variant || { stock_qty: 0 }); }, [variant]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-cream-50 border border-cream-200 rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-olive-800">{variant ? 'Edit Variant' : 'Add New Variant'}</p>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="SKU"
          placeholder="CAR-8OZ"
          error={errors.sku?.message}
          required
          {...register('sku')}
        />
        <Input
          label="Label"
          placeholder="8oz — Carrot"
          error={errors.label?.message}
          required
          {...register('label')}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Filling"
          placeholder="carrot"
          error={errors.filling?.message}
          required
          {...register('filling')}
        />
        <Input
          label="Size (oz)"
          type="number"
          step="0.5"
          placeholder="8"
          error={errors.size_oz?.message}
          required
          {...register('size_oz', { valueAsNumber: true })}
        />
        <Input
          label="Weight (lbs)"
          type="number"
          step="0.1"
          placeholder="0.6"
          error={errors.weight_lbs?.message}
          {...register('weight_lbs', { valueAsNumber: true })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          placeholder="9.99"
          error={errors.price?.message}
          required
          {...register('price', { valueAsNumber: true })}
        />
        <Input
          label="Stock Qty"
          type="number"
          placeholder="50"
          error={errors.stock_qty?.message}
          required
          {...register('stock_qty', { valueAsNumber: true })}
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={loading} size="sm">
          {variant ? 'Save Variant' : 'Add Variant'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ─── Images Tab ──────────────────────────────────────────────────────────────
const ImagesTab = ({ productId }) => {
  const [images, setImages]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState(null);
  const [dragOver, setDragOver]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProductImages(productId);
      setImages(data);
    } catch { setError('Failed to load images'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await uploadProductImage(productId, file);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setPrimaryImage(productId, imageId);
      load();
    } catch { setError('Failed to set primary image'); }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    try {
      await deleteProductImage(productId, imageId);
      load();
    } catch { setError('Failed to delete image'); }
  };

  if (loading) return <Spinner className="py-10" />;

  return (
    <div className="p-6 space-y-5 overflow-y-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragOver ? 'border-olive-500 bg-olive-50' : 'border-cream-300 hover:border-olive-400'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <p className="text-sm text-olive-500">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <>
            <p className="text-3xl mb-2">🖼️</p>
            <p className="text-sm font-medium text-olive-700 mb-1">
              Drag & drop an image here
            </p>
            <p className="text-xs text-olive-400 mb-4">PNG, JPG, WEBP — max 5MB</p>
            <label className="btn-outline cursor-pointer text-sm px-4 py-2">
              Browse files
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          </>
        )}
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <p className="text-sm text-olive-400 text-center py-4">
          No images yet — upload one above.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition-colors
                ${img.is_primary ? 'border-olive-500' : 'border-cream-200'}`}
            >
              <img
                src={img.url}
                alt={img.alt_text}
                className="w-full aspect-square object-cover"
              />

              {/* Primary badge */}
              {img.is_primary && (
                <span className="absolute top-2 left-2 bg-olive-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity flex flex-col items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(img.id)}
                    className="bg-white text-olive-800 text-xs font-medium px-3 py-1.5 rounded-lg
                               hover:bg-olive-50 transition-colors"
                  >
                    Set as primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg
                             hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-olive-400">
        The primary image is shown on product cards and at the top of the product page.
        Hover over any image to change it.
      </p>
    </div>
  );
};

// ─── Variants Tab ─────────────────────────────────────────────────────────────
const VariantsTab = ({ productId }) => {
  const [variants, setVariants]       = useState([]);
  const [loadingV, setLoadingV]       = useState(false);
  const [editingV, setEditingV]       = useState(null);   // variant being edited
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingV, setSavingV]         = useState(false);

  const load = async () => {
    setLoadingV(true);
    try {
      const data = await getVariants(productId);
      setVariants(data);
    } finally {
      setLoadingV(false);
    }
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const handleAdd = async (data) => {
    setSavingV(true);
    try {
      await createVariant({ ...data, product_id: productId });
      setShowAddForm(false);
      load();
    } finally {
      setSavingV(false);
    }
  };

  const handleEdit = async (data) => {
    setSavingV(true);
    try {
      await updateVariant(editingV.id, data);
      setEditingV(null);
      load();
    } finally {
      setSavingV(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this variant?')) return;
    await deleteVariant(id);
    load();
  };

  if (loadingV) return <Spinner className="py-10" />;

  return (
    <div className="p-6 space-y-4 overflow-y-auto">

      {/* Variant list */}
      {variants.length === 0 ? (
        <p className="text-sm text-olive-400 text-center py-6">
          No variants yet — add one below.
        </p>
      ) : (
        <div className="divide-y divide-cream-100 border border-cream-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-cream-100 text-xs font-medium text-olive-600 uppercase tracking-wide">
            <span className="col-span-2">Label / SKU</span>
            <span>Size</span>
            <span>Price</span>
            <span>Stock</span>
          </div>
          {variants.map((v) => (
            <div key={v.id}>
              {editingV?.id === v.id ? (
                <div className="p-3">
                  <VariantForm
                    variant={editingV}
                    onSubmit={handleEdit}
                    onCancel={() => setEditingV(null)}
                    loading={savingV}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 px-4 py-3 text-sm items-center hover:bg-cream-50">
                  <div className="col-span-2">
                    <p className="font-medium text-olive-800">{v.label}</p>
                    <p className="text-xs text-olive-400">{v.sku}</p>
                  </div>
                  <span className="text-olive-600">{v.size_oz}oz</span>
                  <span className="text-olive-700 font-medium">{formatCurrency(v.price)}</span>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${v.stock_qty === 0 ? 'text-red-500' : 'text-olive-700'}`}>
                      {v.stock_qty}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingV(v); setShowAddForm(false); }}
                        className="text-olive-500 hover:text-olive-800 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add variant form */}
      {showAddForm ? (
        <VariantForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
          loading={savingV}
        />
      ) : (
        !editingV && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            + Add Variant
          </Button>
        )
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const { products, loading, fetchAll, create, update, remove } = useProducts();
  const [categories, setCategories] = useState([]);
  const [modal, setModal]           = useState(null);
  // modal shape: { product: null|{...}, tab: 'details'|'variants' }
  const [activeTab, setActiveTab]   = useState('details');
  const [savedProduct, setSavedProduct] = useState(null);
  // savedProduct: after create, holds the new product so variants tab can use its id

  useEffect(() => {
    fetchAll({});
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const openCreate = () => {
    setSavedProduct(null);
    setActiveTab('details');
    setModal({ product: null });
  };

  const openEdit = (product) => {
    setSavedProduct(null);
    setActiveTab('details');
    setModal({ product });
  };

  const closeModal = () => {
    setModal(null);
    setSavedProduct(null);
    fetchAll({});
  };

  const handleProductSubmit = async (data) => {
    if (modal.product) {
      // Editing existing product
      await update(modal.product.id, data);
      setModal((m) => ({ ...m, product: { ...m.product, ...data } }));
    } else {
      // Creating new product — switch to variants tab after
      const result = await create(data);
      if (result?.payload) {
        setSavedProduct(result.payload);
        setActiveTab('variants');
      }
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    await remove(id);
    fetchAll({});
  };

  // The product ID to use for variants tab
  const variantProductId = modal?.product?.id || savedProduct?.id;

  const tabs = [
    { id: 'details',  label: 'Details' },
    {
      id: 'images',
      label: 'Images',
      badge: modal?.product?.images?.length ?? (savedProduct ? 0 : null),
      disabled: !modal?.product && !savedProduct,
    },
    {
      id: 'variants',
      label: 'Variants',
      badge: modal?.product?.variants?.length ?? (savedProduct ? 0 : null),
      disabled: !modal?.product && !savedProduct,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-olive-900">Products</h1>
        <Button onClick={openCreate}>+ New Product</Button>
      </div>

      {loading && !products.length ? (
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-olive-400">
                    No products yet — create your first one.
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-800">{p.name}</p>
                    <p className="text-xs text-olive-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-olive-600">{p.category_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${!p.variants?.length ? 'text-red-400' : 'text-olive-600'}`}>
                      {p.variants?.length || 0}
                    </span>
                    {!p.variants?.length && (
                      <span className="text-xs text-red-400 ml-1">(none)</span>
                    )}
                  </td>
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
                        onClick={() => openEdit(p)}
                        className="text-olive-600 hover:text-olive-900 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(p.id)}
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

      {/* Product Modal */}
      <ProductModal isOpen={!!modal} onClose={closeModal}>
        {modal && (
          <>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
              <h3 className="font-semibold text-olive-900">
                {modal.product ? modal.product.name : 'New Product'}
              </h3>
              <button
                onClick={closeModal}
                className="text-olive-400 hover:text-olive-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 mt-3 shrink-0">
              <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            </div>

            {/* Tab content — scrollable */}
            <div className="overflow-y-auto flex-1">
              {activeTab === 'details' && (
                <ProductDetailsForm
                  product={modal.product}
                  categories={categories}
                  onSubmit={handleProductSubmit}
                  loading={loading}
                />
              )}
              {activeTab === 'images' && variantProductId && (
                <ImagesTab productId={variantProductId} />
              )}
              {activeTab === 'variants' && variantProductId && (
                <VariantsTab productId={variantProductId} />
              )}
            </div>
          </>
        )}
      </ProductModal>
    </div>
  );
};

export default AdminProducts;
