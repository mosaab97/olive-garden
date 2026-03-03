import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

import Home             from '../pages/Home';
import Products         from '../pages/Products';
import ProductDetail    from '../pages/ProductDetail';
import Cart             from '../pages/Cart';
import Login            from '../pages/Login';
import Register         from '../pages/Register';
import Checkout         from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import OrderDetail      from '../pages/OrderDetail';
import Profile          from '../pages/Profile';
import AdminDashboard   from '../pages/admin/Dashboard';
import AdminProducts    from '../pages/admin/AdminProducts';
import AdminOrders      from '../pages/admin/AdminOrders';

const AppRoutes = () => (
  <Routes>
    <Route path="/"               element={<Layout><Home /></Layout>} />
    <Route path="/products"       element={<Layout><Products /></Layout>} />
    <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
    <Route path="/cart"           element={<Layout><Cart /></Layout>} />
    <Route path="/login"          element={<Layout><Login /></Layout>} />
    <Route path="/register"       element={<Layout><Register /></Layout>} />

    <Route path="/checkout" element={
      <ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>
    } />
    <Route path="/order-confirmation/:id" element={
      <ProtectedRoute><Layout><OrderConfirmation /></Layout></ProtectedRoute>
    } />
    <Route path="/orders/:id" element={
      <ProtectedRoute><Layout><OrderDetail /></Layout></ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
    } />

    <Route path="/admin" element={
      <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
    } />
    <Route path="/admin/products" element={
      <AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>
    } />
    <Route path="/admin/orders" element={
      <AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>
    } />

    <Route path="*" element={
      <Layout>
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🫒</p>
          <h1 className="font-serif text-3xl text-olive-800 mb-2">Page not found</h1>
          <p className="text-olive-500">The page you're looking for doesn't exist.</p>
        </div>
      </Layout>
    } />
  </Routes>
);

export default AppRoutes;
