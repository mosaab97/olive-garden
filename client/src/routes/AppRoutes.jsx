import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

// Public pages
import Home             from '../pages/Home';
import Products         from '../pages/Products';
import ProductDetail    from '../pages/ProductDetail';
import Cart             from '../pages/Cart';
import Login            from '../pages/Login';
import Register         from '../pages/Register';

// Protected pages
import Checkout         from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import Profile          from '../pages/Profile';

// Admin pages
import AdminDashboard   from '../pages/admin/Dashboard';
import AdminProducts    from '../pages/admin/AdminProducts';
import AdminOrders      from '../pages/admin/AdminOrders';

const AppRoutes = () => (
  <Routes>
    {/* Public routes — with main layout */}
    <Route path="/" element={<Layout><Home /></Layout>} />
    <Route path="/products"      element={<Layout><Products /></Layout>} />
    <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
    <Route path="/cart"          element={<Layout><Cart /></Layout>} />
    <Route path="/login"         element={<Layout><Login /></Layout>} />
    <Route path="/register"      element={<Layout><Register /></Layout>} />

    {/* Protected routes */}
    <Route path="/checkout" element={
      <ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>
    } />
    <Route path="/order-confirmation/:id" element={
      <ProtectedRoute><Layout><OrderConfirmation /></Layout></ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
    } />

    {/* Admin routes — with admin layout, no main nav */}
    <Route path="/admin" element={
      <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
    } />
    <Route path="/admin/products" element={
      <AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>
    } />
    <Route path="/admin/orders" element={
      <AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>
    } />

    {/* 404 */}
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
