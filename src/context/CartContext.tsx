"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { CartItem, CartState } from "@/types";

type Action =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string } }
  | {
      type: "SET_QUANTITY";
      payload: { productId: string; size: string; qty: number };
    }
  | { type: "APPLY_PROMO"; payload: { code: string; discount: number } }
  | { type: "REMOVE_PROMO" }
  | { type: "CLEAR_CART" };

const INITIAL: CartState = { items: [], promoDiscount: 0 };
const STORAGE_KEY = "niche_cart_v1";

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const key = (i: CartItem) => `${i.productId}::${i.size}`;
      const exists = state.items.find((i) => key(i) === key(action.payload));
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            key(i) === key(action.payload)
              ? {
                  ...i,
                  quantity: Math.min(
                    i.quantity + action.payload.quantity,
                    i.maxStock,
                  ),
                }
              : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.payload.productId &&
              i.size === action.payload.size
            ),
        ),
      };

    case "SET_QUANTITY": {
      const { productId, size, qty } = action.payload;
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: Math.min(qty, i.maxStock) }
            : i,
        ),
      };
    }

    case "APPLY_PROMO":
      return {
        ...state,
        promoCode: action.payload.code,
        promoDiscount: action.payload.discount,
      };

    case "REMOVE_PROMO":
      return { ...state, promoCode: undefined, promoDiscount: 0 };

    case "CLEAR_CART":
      return INITIAL;

    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, qty: number) => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0,
  );
  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const shipping = subtotal >= 300 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax - state.promoDiscount;

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
    [],
  );
  const removeItem = useCallback(
    (productId: string, size: string) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, size } }),
    [],
  );
  const setQuantity = useCallback(
    (productId: string, size: string, qty: number) =>
      dispatch({ type: "SET_QUANTITY", payload: { productId, size, qty } }),
    [],
  );
  const applyPromo = useCallback(
    (code: string, discount: number) =>
      dispatch({ type: "APPLY_PROMO", payload: { code, discount } }),
    [],
  );
  const removePromo = useCallback(() => dispatch({ type: "REMOVE_PROMO" }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        itemCount,
        subtotal,
        shipping,
        tax,
        finalTotal,
        addItem,
        removeItem,
        setQuantity,
        applyPromo,
        removePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
