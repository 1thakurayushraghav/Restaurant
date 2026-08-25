import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { OrderStatusBadge } from "../../components/orders/OrderTimeline";
import { Price } from "../../components/ui/Misc";
import { Skeleton } from "../../components/ui/FormElements";
import { formatDateTime } from "../../utils/format";

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, loading } = useFetch(() => adminApi.getOrder(id), [id]);

  if (loading) return <Skeleton className="h-96 rounded-xl2" />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{order.orderNumber}</h1>
          <p className="text-sm text-brown/50">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="card p-5 mb-4">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p className="text-sm">{order.customer.name} · {order.customer.phone}</p>
        {order.deliveryAddress && (
          <p className="text-sm text-brown/60 mt-1">
            {[order.deliveryAddress.addressLine, order.deliveryAddress.area, order.deliveryAddress.landmark, order.deliveryAddress.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </div>

      <div className="card p-5 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1">
            <span>{item.name} ({item.variantLabel}) × {item.quantity}</span>
            <Price amount={item.lineTotal} size="sm" />
          </div>
        ))}
        <div className="border-t border-brown/10 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><Price amount={order.subtotal} size="sm" /></div>
          {order.discount > 0 && <div className="flex justify-between text-veg"><span>Discount</span><span>-{order.discount}</span></div>}
          <div className="flex justify-between"><span>Delivery</span><Price amount={order.deliveryFee} size="sm" /></div>
          <div className="flex justify-between font-semibold text-base"><span>Total</span><Price amount={order.total} /></div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-2">Payment</h2>
        <p className="text-sm">{order.paymentMethod} · {order.paymentStatus}</p>
        {order.notes && <p className="text-sm text-brown/60 mt-2">Notes: {order.notes}</p>}
      </div>
    </div>
  );
}
