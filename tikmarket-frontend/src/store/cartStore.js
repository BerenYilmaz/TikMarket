import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items:       [],
  totalAmount: 0,
  itemCount:   0,

  // Set full cart data from API response
  setCart: (cartData) => {
    const items = cartData?.items || [];
    set({
      items,
      totalAmount: cartData?.totalAmount || 0,
      itemCount:   items.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  // Clear cart (on logout)
  clearCart: () => set({ items: [], totalAmount: 0, itemCount: 0 }),
}));

export default useCartStore;