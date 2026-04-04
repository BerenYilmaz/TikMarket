import api from "./api";

export const productService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.search)   params.append("search",   filters.search);
    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  getById: async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post("/api/products", productData);
    return response.data;
  },

  update: async (productId, productData) => {
    const response = await api.put(`/api/products/${productId}`, productData);
    return response.data;
  },

  delete: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  },
};