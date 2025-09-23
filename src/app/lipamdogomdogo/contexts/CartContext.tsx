"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@lipam/lib/types";
import toast from "react-hot-toast";
import { calculateOriginalPrice } from "@lipam/lib/priceUtils";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  originalTotal: number;
  totalDiscount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  originalTotal: 0,
  totalDiscount: 0,
};

// Helper function to calculate totals with discounts
function calculateTotals(items: CartItem[]) {
  let total = 0;
  let originalTotal = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // Calculate original price if there's a discount
    if (
      item.product.discount_percentage &&
      item.product.discount_percentage > 0
    ) {
      const originalPrice = calculateOriginalPrice(
        item.price,
        item.product.discount_percentage
      );
      originalTotal += originalPrice * item.quantity;
    } else {
      originalTotal += itemTotal;
    }
  });

  const totalDiscount = originalTotal - total;

  return { total, originalTotal, totalDiscount };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        const totals = calculateTotals(updatedItems);
        return {
          ...state,
          items: updatedItems,
          ...totals,
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product_id: product.id,
          quantity,
          price: product.price,
          product,
        };
        const updatedItems = [...state.items, newItem];
        const totals = calculateTotals(updatedItems);
        return {
          ...state,
          items: updatedItems,
          ...totals,
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.product_id !== action.payload.productId
      );
      const totals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { productId },
        });
      }

      const updatedItems = state.items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      const totals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return initialState;

    case "LOAD_CART": {
      const totals = calculateTotals(action.payload);
      return {
        items: action.payload,
        ...totals,
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    toast.success(`${product.name} added to cart!`);
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
