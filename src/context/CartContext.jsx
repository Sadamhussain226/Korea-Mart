import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const FREE_SHIPPING_THRESHOLD = 150; // AED 150 for free Abu Dhabi delivery
const BASE_DELIVERY_FEE = 20; // AED 20 base delivery fee

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('korea_mart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('korea_mart_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Cart saving error', e);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : BASE_DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      grandTotal,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      remainingForFreeShipping,
      freeShippingProgress,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      lastOrderDetails,
      setLastOrderDetails
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      grandTotal,
      remainingForFreeShipping,
      freeShippingProgress,
      isCartOpen,
      isCheckoutOpen,
      lastOrderDetails
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
