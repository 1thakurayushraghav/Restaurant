import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { TRACKING_STEPS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../constants/orderStatus";
import { Price } from "../ui/Misc";
import { formatDateTime } from "../../utils/format";

export function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function OrderTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="text-center py-6">
        <p className="text-nonveg font-semibold">This order was cancelled.</p>
      </div>
    );
  }

  const currentIndex = TRACKING_STEPS.indexOf(status);

  return (
    <div className="py-4">
      {TRACKING_STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isDone ? "bg-veg text-white" : "bg-brown/10 text-brown/40"
                } ${isCurrent ? "ring-4 ring-veg/20" : ""}`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
              </div>
              {idx < TRACKING_STEPS.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[28px] ${isDone ? "bg-veg" : "bg-brown/10"}`} />
              )}
            </div>
            <div className="pb-7">
              <p className={`font-medium text-sm ${isDone ? "text-brown" : "text-brown/40"}`}>
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderCard({ order }) {
  return (
    <Link
      to={`/order/${order.orderNumber}`}
      className="card block p-4 hover:shadow-cardHover transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-brown text-sm">{order.orderNumber}</p>
          <p className="text-xs text-brown/50 mt-0.5">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-brown/10">
        <span className="text-xs text-brown/60">{order.items.length} item(s)</span>
        <Price amount={order.total} size="sm" />
      </div>
    </Link>
  );
}
