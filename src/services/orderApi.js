import api from "./api";

export const orderApi = {
  create: (data) => api.post("/orders", data).then((r) => r.data.data.order),
  getById: (orderId) => api.get(`/orders/${orderId}`).then((r) => r.data.data.order),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`).then((r) => r.data.data.order),
};
