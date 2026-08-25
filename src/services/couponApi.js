import api from "./api";

export const couponApi = {
  validate: (payload) => api.post("/coupons/validate", payload).then((r) => r.data.data),
};
