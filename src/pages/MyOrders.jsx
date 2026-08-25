import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Package } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { orderApi } from "../services/orderApi";
import { OrderCard } from "../components/orders/OrderTimeline";
import { Skeleton, EmptyState } from "../components/ui/FormElements";
import Button from "../components/ui/Button";

export default function MyOrders() {
  const {
    data: orders,
    loading,
    error,
  } = useFetch(() => orderApi.getMyOrders(), []);

  if (loading) {
    return (
      <div className="container-app py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 rounded-xl2" />
        <Skeleton className="h-28 rounded-xl2" />
        <Skeleton className="h-28 rounded-xl2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-10 max-w-2xl">
        <EmptyState
          icon={Package}
          title="Unable to load orders"
          description="Please login again and try once more."
          action={
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          }
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Orders — Shree Munnalal</title>
        </Helmet>

        <div className="container-app py-12 max-w-2xl">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Your orders will appear here after you place your first order."
            action={
              <Button as={Link} to="/menu">
                Browse Menu
              </Button>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders — Shree Munnalal</title>
      </Helmet>

      <div className="container-app py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            My Orders
          </h1>

          <p className="text-sm text-brown/50 mt-1">
            View and track your previous orders
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
      </div>
    </>
  );
}