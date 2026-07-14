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
const CART_STORAGE_EVENT = "leochi-cart-updated";

function readCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedCart) as CartItem[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribeToCartStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStoreChange = () => onStoreChange();

  window.addEventListener("storage", handleStoreChange);
  window.addEventListener(CART_STORAGE_EVENT, handleStoreChange);

  return () => {
    window.removeEventListener("storage", handleStoreChange);
    window.removeEventListener(CART_STORAGE_EVENT, handleStoreChange);
  };
}

function updateCartStorage(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_STORAGE_EVENT));
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = useSyncExternalStore(subscribeToCartStore, readCartSnapshot, () => []);

  function addToCart(item: CartItem) {
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.name === item.name &&
        cartItem.size === item.size
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];

      updatedCart[existingIndex].quantity += 1;

      updateCartStorage(updatedCart);

      return;
    }

    updateCartStorage([
      ...cart,
      {
        ...item,
        quantity: 1,
      },
    ]);
  }

  function removeFromCart(index: number) {
    updateCartStorage(cart.filter((_, i) => i !== index));
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cart];

    updatedCart[index].quantity += 1;

    updateCartStorage(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;

      updateCartStorage(updatedCart);
    } else {
      removeFromCart(index);
    }
  }

  function clearCart() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(CART_STORAGE_KEY);
    window.sessionStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event(CART_STORAGE_EVENT));
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