import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IitemCarrinho } from '@/interfaces/IitemCarrinho';

interface CartState {
  items: IitemCarrinho[];
}

const loadCartFromLocalStorage = (): IitemCarrinho[] => {
  if (typeof window !== "undefined") { 
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return []; 
};

const saveCartToLocalStorage = (items: IitemCarrinho[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: 'carrinhoDeCompras',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IitemCarrinho>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantidade += 1;
      } else {
        state.items.push({ ...newItem, quantidade: 1 });
      }

      saveCartToLocalStorage(state.items);
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      saveCartToLocalStorage(state.items);
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const item = state.items.find(i => i.id === itemId);

      if (item) {
        item.quantidade += 1;
      }

      saveCartToLocalStorage(state.items);
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const item = state.items.find(i => i.id === itemId);

      if (item && item.quantidade > 1) {
        item.quantidade -= 1;
      }

      saveCartToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
  },
});

export const { addItem, removeItem, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
