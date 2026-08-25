import api from "./api";

export const reviewApi = {
  getApproved: () => api.get("/reviews/approved").then((r) => r.data.data.reviews),
  create: (payload) => api.post("/reviews", payload).then((r) => r.data.data),
};

export const bulkOrderApi = {
  create: (payload) => api.post("/bulk-orders", payload).then((r) => r.data.data),
};

export const whatsappApi = {
  generateOrderMessage: (payload) =>
    api.post("/whatsapp/generate-order-message", payload).then((r) => r.data.data),
};

export const restaurantApi = {
  getInfo: () => api.get("/restaurant").then((r) => r.data.data.restaurant),
};
