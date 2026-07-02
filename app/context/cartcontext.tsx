"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: CartItem) {
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.name === item.name &&
        cartItem.size === item.size
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];

      updatedCart[existingIndex].quantity += 1;

      setCart(updatedCart);

      return;
    }

    setCart([
      ...cart,
      {
        ...item,
        quantity: 1,
      },
    ]);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cart];

    updatedCart[index].quantity += 1;

    setCart(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;

      setCart(updatedCart);
    } else {
      removeFromCart(index);
    }
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
    sessionStorage.removeItem("cart");
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