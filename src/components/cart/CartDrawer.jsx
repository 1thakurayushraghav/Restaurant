import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import { CartItem, CartSummary } from "./CartItem";
import { EmptyState } from "../ui/FormElements";
import { useCartStore } from "../../store/cartStore";

export default function CartDrawer({ isOpen, onClose }) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const navigate = useNavigate();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Your Cart">
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some delicious food or sweets to get started."
          action={
            <Button
              onClick={() => {
                onClose();
                navigate("/menu");
              }}
            >
              Browse Menu
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-5">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>
          <div className="border-t border-brown/10 bg-white p-5 space-y-4">
            <CartSummary subtotal={subtotal} total={subtotal} />
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
