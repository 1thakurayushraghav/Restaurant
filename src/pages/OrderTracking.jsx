import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PackageX } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { orderApi } from "../services/orderApi";
import { OrderTimeline, OrderStatusBadge } from "../components/orders/OrderTimeline";
import { Skeleton, EmptyState } from "../components/ui/FormElements";
import { Price } from "../components/ui/Misc";
import { formatDateTime } from "../utils/format";
import Button from "../components/ui/Button";

export default function OrderTracking() {
  const { orderId } = useParams();
  const { data: order, loading, error } = useFetch(() => orderApi.track(orderId), [orderId]);

  if (loading) {
    return (
      <div className="container-app py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 rounded-xl2" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description="Please check your order number and try again."
        action={<Link to="/" className="btn-primary">Back to Home</Link>}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Track Order {order.orderNumber} — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl">{order.orderNumber}</h1>
            <p className="text-sm text-brown/50">{formatDateTime(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="card p-5 mb-6">
          <OrderTimeline status={order.status} />
        </div>

        <div className="card p-5 mb-6">
          <h2 className="font-semibold mb-3">Order Items</h2>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} ({item.variantLabel}) × {item.quantity}
                </span>
                <Price amount={item.lineTotal} size="sm" />
              </div>
            ))}
          </div>
          <div className="border-t border-brown/10 mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <Price amount={order.total} />
          </div>
        </div>

        {order.status === "DELIVERED" && (
          <div className="flex gap-3">
            <Button as={Link} to="/menu" variant="outline" className="flex-1">
              Order Again
            </Button>
            <Button as={Link} to="/reviews" className="flex-1">
              Leave a Review
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
