import api from "./api";

export const categoryApi = {
  getAll: () => api.get("/categories").then((r) => r.data.data.categories),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data.data.category),
};
