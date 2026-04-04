import api from "./api";

export const userService = {
  addAddress: async (addressData) => {
    const response = await api.post("/api/users/addresses", addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/users/addresses/${addressId}`);
    return response.data;
  },
};