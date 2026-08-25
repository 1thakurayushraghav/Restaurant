import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { ADMIN_BOARD_COLUMNS, ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import { Price } from "../../components/ui/Misc";
import { Skeleton } from "../../components/ui/FormElements";
import { formatDateTime } from "../../utils/format";
import { useToast } from "../../components/ui/Toast";

const NEXT_STATUS = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

export default function Orders() {
  const { data, loading, refetch } = useFetch(() => adminApi.getOrders({ limit: 100 }), []);
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(null);

  const orders = data?.data?.orders || [];

  const handleAdvance = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdating(order._id);
    try {
      await adminApi.updateOrderStatus(order._id, next);
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl2" />)}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-6">Order Board</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ADMIN_BOARD_COLUMNS.map((status) => {
          const columnOrders = orders.filter((o) => o.status === status);
          return (
            <div key={status} className="w-72 shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-semibold text-brown/70">{ORDER_STATUS_LABELS[status]}</h2>
                <span className="text-xs bg-brown/10 rounded-full px-2 py-0.5">{columnOrders.length}</span>
              </div>
              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <div key={order._id} className="card p-3">
                    <Link to={`/admin/orders/${order._id}`} className="block">
                      <p className="text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-brown/50">{order.customer.name} · {order.customer.phone}</p>
                      <p className="text-xs text-brown/40 mt-1">{formatDateTime(order.createdAt)}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <Price amount={order.total} size="sm" />
                      <span className="text-xs bg-brown/5 px-2 py-0.5 rounded">{order.orderType}</span>
                    </div>
                    {NEXT_STATUS[status] && (
                      <button
                        onClick={() => handleAdvance(order)}
                        disabled={updating === order._id}
                        className="w-full mt-2 text-xs font-medium bg-maroon text-white rounded-lg py-1.5 disabled:opacity-50"
                      >
                        Mark as {ORDER_STATUS_LABELS[NEXT_STATUS[status]]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
