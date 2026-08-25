import api from "./api";

export const adminApi = {
  // Dashboard / analytics
  getDashboard: () => api.get("/admin/analytics/dashboard").then((r) => r.data.data),
  getRevenue: (days) => api.get("/admin/analytics/revenue", { params: { days } }).then((r) => r.data.data.series),
  getTopProducts: () => api.get("/admin/analytics/top-products").then((r) => r.data.data.topProducts),
  getOrderSources: () => api.get("/admin/analytics/order-sources").then((r) => r.data.data.sources),

  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }).then((r) => r.data),
  getOrder: (id) => api.get(`/admin/orders/${id}`).then((r) => r.data.data.order),
  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data.data.order),

  // Products
  getProducts: (params) => api.get("/admin/products", { params }).then((r) => r.data),
  createProduct: (data) => api.post("/admin/products", data).then((r) => r.data.data.product),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}`, data).then((r) => r.data.data.product),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Categories
  getCategories: () => api.get("/admin/categories").then((r) => r.data.data.categories),
  createCategory: (data) => api.post("/admin/categories", data).then((r) => r.data.data.category),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data).then((r) => r.data.data.category),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  reorderCategories: (order) => api.patch("/admin/categories/reorder", { order }).then((r) => r.data.data.categories),

  // Customers
  getCustomers: (params) => api.get("/admin/customers", { params }).then((r) => r.data),

  // Delivery zones
  getDeliveryZones: () => api.get("/admin/delivery-zones").then((r) => r.data.data.zones),
  createDeliveryZone: (data) => api.post("/admin/delivery-zones", data).then((r) => r.data.data.zone),
  updateDeliveryZone: (id, data) => api.patch(`/admin/delivery-zones/${id}`, data).then((r) => r.data.data.zone),
  deleteDeliveryZone: (id) => api.delete(`/admin/delivery-zones/${id}`),

  // Coupons
  getCoupons: () => api.get("/admin/coupons").then((r) => r.data.data.coupons),
  createCoupon: (data) => api.post("/admin/coupons", data).then((r) => r.data.data.coupon),
  updateCoupon: (id, data) => api.patch(`/admin/coupons/${id}`, data).then((r) => r.data.data.coupon),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  // Reviews
  getReviews: (params) => api.get("/admin/reviews", { params }).then((r) => r.data.data.reviews),
  updateReviewStatus: (id, status) =>
    api.patch(`/admin/reviews/${id}/status`, { status }).then((r) => r.data.data.review),

  // Bulk orders
  getBulkOrders: (params) => api.get("/admin/bulk-orders", { params }).then((r) => r.data.data.enquiries),
  updateBulkOrderStatus: (id, status) =>
    api.patch(`/admin/bulk-orders/${id}/status`, { status }).then((r) => r.data.data.enquiry),

  // Settings
  getSettings: () => api.get("/admin/settings").then((r) => r.data.data.restaurant),
  updateSettings: (data) => api.patch("/admin/settings", data).then((r) => r.data.data.restaurant),
};
