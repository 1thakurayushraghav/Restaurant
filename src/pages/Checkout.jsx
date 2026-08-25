import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Truck, Store } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { orderApi } from "../services/orderApi";
import { paymentApi } from "../services/paymentApi";
import { couponApi } from "../services/couponApi";
import { deliveryApi } from "../services/deliveryApi";
import CheckoutForm from "../components/checkout/CheckoutForm";
import PaymentOptions from "../components/checkout/PaymentOptions";
import { CartSummary } from "../components/cart/CartItem";
import { Input } from "../components/ui/FormElements";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [orderType, setOrderType] = useState("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState(null);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const discount = couponResult?.discount || 0;
  const effectiveDeliveryFee = couponResult?.freeDelivery ? 0 : deliveryFee;
  const total = Math.max(0, subtotal - discount + (orderType === "DELIVERY" ? effectiveDeliveryFee : 0));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await couponApi.validate({ code: couponCode, cartTotal: subtotal });
      setCouponResult(result);
      showToast(`Coupon applied: ${result.code}`, "success");
    } catch (err) {
      showToast(err.message, "error");
      setCouponResult(null);
    }
  };

  const handleFormSubmit = async (values) => {
    setFormValues(values);
    if (orderType === "DELIVERY") {
      try {
        const check = await deliveryApi.check({ area: values.area, pincode: values.pincode, subtotal });
        if (!check.deliverable) {
          showToast(check.message || "We don't deliver to this area yet", "error");
          return;
        }
        if (check.error) {
          showToast(check.error, "error");
          return;
        }
        setDeliveryFee(check.deliveryFee || 0);
      } catch (err) {
        showToast(err.message, "error");
        return;
      }
    }
    await placeOrder(values);
  };

  const placeOrder = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        customer: { name: values.name, phone: values.phone },
        items: items.map((i) => ({ product: i.productId, variantId: i.variantId, quantity: i.quantity })),
        orderType,
        paymentMethod,
        deliveryAddress:
          orderType === "DELIVERY"
            ? { addressLine: values.addressLine, area: values.area, landmark: values.landmark, pincode: values.pincode }
            : undefined,
        couponCode: couponResult?.code,
        notes: values.notes,
        source: "WEBSITE",
      };

      const order = await orderApi.create(payload);

      if (paymentMethod === "RAZORPAY") {
        const { razorpayOrderId, amount, currency, keyId } = await paymentApi.createRazorpayOrder(order._id);
        openRazorpayCheckout({ razorpayOrderId, amount, currency, keyId, order, values, clearCart, navigate, showToast });
      } else {
        clearCart();
        navigate(`/order/${order.orderNumber}`);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 grid lg:grid-cols-3 gap-8 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-3xl">Checkout</h1>

          <div>
            <p className="text-sm font-medium mb-2">Order Type</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOrderType("DELIVERY")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl2 border font-medium text-sm ${
                  orderType === "DELIVERY" ? "border-maroon bg-maroon text-white" : "border-brown/15 bg-white"
                }`}
              >
                <Truck className="w-4 h-4" /> Delivery
              </button>
              <button
                onClick={() => setOrderType("PICKUP")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl2 border font-medium text-sm ${
                  orderType === "PICKUP" ? "border-maroon bg-maroon text-white" : "border-brown/15 bg-white"
                }`}
              >
                <Store className="w-4 h-4" /> Pickup
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold mb-4">Your Details</h2>
            <CheckoutForm onSubmit={handleFormSubmit} orderType={orderType} defaultValues={formValues} />
          </div>

          <div className="card p-5">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleApplyCoupon} className="!px-4 !py-2 text-sm">
                Apply
              </Button>
            </div>
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              deliveryFee={orderType === "DELIVERY" ? effectiveDeliveryFee : 0}
              total={total}
            />
          </div>

          <Button type="submit" form="checkout-form" loading={submitting} className="w-full">
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
}

function openRazorpayCheckout({ razorpayOrderId, amount, currency, keyId, order, values, clearCart, navigate, showToast }) {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      order_id: razorpayOrderId,
      name: "Shree Munnalal Halwai Sweets & Restaurant",
      prefill: { name: values.name, contact: values.phone },
      handler: async (response) => {
        try {
          await paymentApi.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          clearCart();
          navigate(`/order/${order.orderNumber}`);
        } catch (err) {
          showToast("Payment verification failed. Please contact us.", "error");
        }
      },
      theme: { color: "#7A1F2B" },
    });
    rzp.open();
  };
  document.body.appendChild(script);
}
