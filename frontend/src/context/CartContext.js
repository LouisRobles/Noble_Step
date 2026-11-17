import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { apiFetch } from "../utils/api";

const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from backend when user logs in
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      try {
        const data = await apiFetch(`/api/cart`);
        const cart = data.cart || data;
        if (!mounted) return;
        // normalize items to match frontend shape
        const items = (cart.items || []).map((it) => ({
          id: it._id || it.product._id || it.product,
          productId: it.product._id || it.product,
          name: it.product.name,
          price: it.product.price,
          image: Array.isArray(it.product.images)
            ? it.product.images[0]
            : it.product.image || "",
          quantity: it.quantity,
          size: it.size || null,
        }));
        setCartItems(items);
      } catch (err) {
        setCartItems([]);
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cartItems]);

  const addToCart = async (product, quantity = 1, size = null) => {
    if (!user) throw new Error("Login required");
    const payload = {
      productId: product._id || product.id || product.productId,
      quantity,
      size,
    };
    const data = await apiFetch(`/api/cart`, { method: "POST", body: payload });
    const cart = data.cart || data;
    const items = (cart.items || []).map((it) => ({
      id: it._id || it.product._id || it.product,
      productId: it.product._id || it.product,
      name: it.product.name,
      price: it.product.price,
      image: Array.isArray(it.product.images)
        ? it.product.images[0]
        : it.product.image || "",
      quantity: it.quantity,
      size: it.size || null,
    }));
    setCartItems(items);
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    await apiFetch(`/api/cart/${itemId}`, { method: "DELETE" });
    setCartItems((prev) => prev.filter((i) => String(i.id) !== String(itemId)));
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const data = await apiFetch(`/api/cart/${itemId}`, {
      method: "PUT",
      body: { quantity },
    });
    const cart = data.cart || data;
    const items = (cart.items || []).map((it) => ({
      id: it._id || it.product._id || it.product,
      productId: it.product._id || it.product,
      name: it.product.name,
      price: it.product.price,
      image: Array.isArray(it.product.images)
        ? it.product.images[0]
        : it.product.image || "",
      quantity: it.quantity,
      size: it.size || null,
    }));
    setCartItems(items);
  };

  const clearCart = async () => {
    if (user) {
      await apiFetch(`/api/cart`, { method: "DELETE" });
    }
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Cart Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
