import api from "./api";

export const productApi = {
  getAll: (params = {}) => api.get("/products", { params }).then((r) => r.data),
  search: (q) => api.get("/products/search", { params: { q } }).then((r) => r.data.data.products),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data.data.product),
};
