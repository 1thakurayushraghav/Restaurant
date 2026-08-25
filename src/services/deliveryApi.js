import api from "./api";

export const deliveryApi = {
  getZones: () => api.get("/delivery/zones").then((r) => r.data.data.zones),
  check: (payload) => api.post("/delivery/check", payload).then((r) => r.data.data),
};
