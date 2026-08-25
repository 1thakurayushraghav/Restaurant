import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { Price } from "../ui/Misc";

export function CartItem({ item }) {
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4 border-b border-brown/10">
      <div className="w-16 h-16 rounded-xl bg-brown/5 shrink-0 overflow-hidden">
        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-brown text-sm line-clamp-1">{item.name}</p>
            <p className="text-xs text-brown/50">{item.variantLabel}</p>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            aria-label={`Remove ${item.name}`}
            className="text-brown/40 hover:text-nonveg transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-maroon/5 rounded-lg px-1 py-1">
            <button
              onClick={() => decreaseQty(item.productId, item.variantId)}
              className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-card"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => increaseQty(item.productId, item.variantId)}
              className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-card"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <Price amount={item.price * item.quantity} size="sm" />
        </div>
      </div>
    </div>
  );
}

export function CartSummary({ subtotal, discount = 0, deliveryFee = 0, total }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-brown/70">
        <span>Subtotal</span>
        <Price amount={subtotal} size="sm" />
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-veg">
          <span>Discount</span>
          <span>-<Price amount={discount} size="sm" /></span>
        </div>
      )}
      <div className="flex justify-between text-brown/70">
        <span>Delivery Fee</span>
        <span>{deliveryFee === 0 ? "Free" : <Price amount={deliveryFee} size="sm" />}</span>
      </div>
      <div className="flex justify-between font-semibold text-base pt-2 border-t border-brown/10">
        <span>Total</span>
        <Price amount={total} size="md" />
      </div>
    </div>
  );
}
