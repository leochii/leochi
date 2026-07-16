"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type CartItem = {
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (index: number) => void;

  increaseQuantity: (index: number) => void;

  decreaseQuantity: (index: number) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cart: [],

  addToCart: () => {},

  removeFromCart: () => {},

  increaseQuantity: () => {},

  decreaseQuantity: () => {},

  clearCart: () => {},
});

const CART_STORAGE_KEY = "cart";
const EMPTY_CART: CartItem[] = [];

let cachedRawCart = "";
let cachedCartSnapshot: CartItem[] = EMPTY_CART;

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  const savedCart = window.localStorage.getItem(CART_STORAGE_KEY) || "";

  if (savedCart === cachedRawCart) {
    return cachedCartSnapshot;
  }

  if (!savedCart) {
    cachedRawCart = "";
    cachedCartSnapshot = EMPTY_CART;
    return cachedCartSnapshot;
  }

  try {
    const parsed = JSON.parse(savedCart) as CartItem[];
    cachedRawCart = savedCart;
    cachedCartSnapshot = Array.isArray(parsed) ? parsed : EMPTY_CART;

    return cachedCartSnapshot;
  } catch {
    cachedRawCart = "";
    cachedCartSnapshot = EMPTY_CART;
    return cachedCartSnapshot;
  }
}

function writeStoredCart(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(cart);
  cachedRawCart = serialized;
  cachedCartSnapshot = cart;
  window.localStorage.setItem(CART_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event("cart-updated"));
}

function subscribeToCartStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener("cart-updated", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("cart-updated", handleChange);
  };
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = useSyncExternalStore(subscribeToCartStore, readStoredCart, () => EMPTY_CART);

  function addToCart(item: CartItem) {
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.name === item.name &&
        cartItem.size === item.size
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];

      updatedCart[existingIndex].quantity += 1;

      writeStoredCart(updatedCart);

      return;
    }

    writeStoredCart([
      ...cart,
      {
        ...item,
        quantity: 1,
      },
    ]);
  }

  function removeFromCart(index: number) {
    writeStoredCart(cart.filter((_, i) => i !== index));
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cart];

    updatedCart[index].quantity += 1;

    writeStoredCart(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;

      writeStoredCart(updatedCart);
    } else {
      removeFromCart(index);
    }
  }

  function clearCart() {
    writeStoredCart([]);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event("cart-updated"));
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}