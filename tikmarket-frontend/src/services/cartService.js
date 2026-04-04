import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/api/cart");
    return response.data;
  },

  addItem: async (productId, quantity = 1) => {
    const response = await api.post("/api/cart/items", { productId, quantity });
    return response.data;
  },

  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/api/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return response.data;
  },
};