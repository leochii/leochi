"use client";

import { useEffect, useEffectEvent } from "react";
import { useCart } from "../context/cartcontext";

export default function SuccessCartReset() {
  const { clearCart } = useCart();

  const clearCartOnMount = useEffectEvent(() => {
    clearCart();
  });

  useEffect(() => {
    clearCartOnMount();
  }, []);

  return null;
}