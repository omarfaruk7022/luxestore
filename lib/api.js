import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("luxe_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("luxe_token");
      localStorage.removeItem("luxe_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// API helpers
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  addAddress: (data) => api.post("/auth/address", data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
};

export const productApi = {
  getAll: (params) => api.get("/products", { params }),
  getOne: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get("/products/featured"),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/id/${id}`, data),
  delete: (id) => api.delete(`/products/id/${id}`),
};

export const categoryApi = {
  getAll: () => api.get("/categories"),
  getOne: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartApi = {
  get: () => api.get("/cart"),
  add: (data) => api.post("/cart", data),
  update: (itemId, data) => api.put(`/cart/${itemId}`, data),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete("/cart"),
};

export const orderApi = {
  create: (data) => api.post("/orders", data),
  getAll: (params) => api.get("/orders", { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getUsers: (params) => api.get("/admin/users", { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
};

export const userApi = {
  getWishlist: () => api.get("/users/wishlist"),
  toggleWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
};

export const reviewApi = {
  add: (productId, data) => api.post(`/reviews/${productId}`, data),
  delete: (productId, reviewId) =>
    api.delete(`/reviews/${productId}/${reviewId}`),
};
