import api from "./api";

export const paymentApi = {
  createRazorpayOrder: (orderId) =>
    api.post("/payments/razorpay/create-order", { orderId }).then((r) => r.data.data),
  verifyRazorpayPayment: (payload) =>
    api.post("/payments/razorpay/verify", payload).then((r) => r.data.data),
};
