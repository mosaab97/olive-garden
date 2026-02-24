import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllProducts,
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
  fetchProducts,
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  clearSelectedProduct,
} from '../features/products/productsSlice';

const useProducts = (autoFetch = false, params = {}) => {
  const dispatch  = useDispatch();
  const products  = useSelector(selectAllProducts);
  const selected  = useSelector(selectSelectedProduct);
  const loading   = useSelector(selectProductsLoading);
  const error     = useSelector(selectProductsError);

  useEffect(() => {
    if (autoFetch) dispatch(fetchProducts(params));
  }, [autoFetch]); // eslint-disable-line

  return {
    products,
    selectedProduct: selected,
    loading,
    error,
    fetchAll:     (p)         => dispatch(fetchProducts(p)),
    fetchBySlug:  (slug)      => dispatch(fetchProductBySlug(slug)),
    create:       (data)      => dispatch(createProduct(data)),
    update:       (id, data)  => dispatch(updateProduct({ id, data })),
    remove:       (id)        => dispatch(deleteProduct(id)),
    clearSelected:()          => dispatch(clearSelectedProduct()),
  };
};

export default useProducts;
