import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import cartReducer from './cartSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string) {
      return Promise.resolve();
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const webStorage = 
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: webStorage, 
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    carrinhoDeCompras: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export const useStore = () => store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
