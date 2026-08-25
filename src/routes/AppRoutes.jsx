import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoute";
import { Skeleton } from "../components/ui/FormElements";

const Home = lazy(() => import("../pages/Home"));
const Menu = lazy(() => import("../pages/Menu"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const OrderTracking = lazy(() => import("../pages/OrderTracking"));
const About = lazy(() => import("../pages/About"));
const Gallery = lazy(() => import("../pages/Gallery"));
const Reviews = lazy(() => import("../pages/Reviews"));
const Contact = lazy(() => import("../pages/Contact"));
const Delivery = lazy(() => import("../pages/Delivery"));
const BulkOrders = lazy(() => import("../pages/BulkOrders"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminOrderDetail = lazy(() => import("../pages/admin/OrderDetail"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const AdminCategories = lazy(() => import("../pages/admin/Categories"));
const AdminCustomers = lazy(() => import("../pages/admin/Customers"));
const AdminDeliveryZones = lazy(() => import("../pages/admin/DeliveryZones"));
const AdminCoupons = lazy(() => import("../pages/admin/Coupons"));
const AdminReviews = lazy(() => import("../pages/admin/Reviews"));
const AdminBulkOrders = lazy(() => import("../pages/admin/BulkOrders"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));

function PageFallback() {
  return (
    <div className="container-app py-10">
      <Skeleton className="h-64 w-full rounded-xl2" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/product/:slug" element={<ProductDetails />} />

        <Route path="/order" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />

        {/* Checkout now requires login — user must be authenticated to place an order */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/order/:orderId" element={<OrderTracking />} />
        <Route path="/orders" element={<OrderTracking />} />

        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/bulk-orders" element={<BulkOrders />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="delivery-zones" element={<AdminDeliveryZones />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="bulk-orders" element={<AdminBulkOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}