"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "@lipam/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface WishlistState {
  items: Product[];
  itemCount: number;
  loading: boolean;
}

type WishlistAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_WISHLIST"; payload: Product[] }
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" };

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
  loading: false,
};

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOAD_WISHLIST": {
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.length,
        loading: false,
      };
    }

    case "ADD_ITEM": {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return state;
      }

      const newItems = [...state.items, product];
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "REMOVE_ITEM": {
      const productId = action.payload;
      const newItems = state.items.filter((item) => item.id !== productId);
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "CLEAR_WISHLIST":
      return { ...initialState, loading: false };

    default:
      return state;
  }
}

interface WishlistContextType extends WishlistState {
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Load wishlist from database when user changes
  useEffect(() => {
    if (user) {
      loadWishlistFromDatabase();
    } else {
      // Clear wishlist when user logs out
      dispatch({ type: "CLEAR_WISHLIST" });
    }
  }, [user]);

  const loadWishlistFromDatabase = async () => {
    if (!user) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { data: wishlistData, error } = await supabase
        .from("wishlist")
        .select(
          `
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            brand,
            model,
            price,
            image_urls,
            discount_percentage,
            storage,
            ram,
            color,
            category,
            subcategory,
            tags,
            in_stock,
            stock_quantity,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading wishlist:", error);
        toast.error("Failed to load wishlist");
        return;
      }

      const products = wishlistData?.map((item) => item.products).flat() || [];
      dispatch({ type: "LOAD_WISHLIST", payload: products });
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addItem = async (product: Product) => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      if (existingItem) {
        toast("Item already in your wishlist");
        return;
      }

      // Add to database
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: product.id,
      });

      if (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add item to wishlist");
        return;
      }

      // Update local state
      dispatch({ type: "ADD_ITEM", payload: product });
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove item from wishlist");
        return;
      }

      const product = state.items.find((item) => item.id === productId);
      dispatch({ type: "REMOVE_ITEM", payload: productId });

      if (product) {
        toast.success(`${product.name} removed from wishlist`);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing wishlist:", error);
        toast.error("Failed to clear wishlist");
        return;
      }

      dispatch({ type: "CLEAR_WISHLIST" });
      toast.success("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.id === productId);
  };

  const refreshWishlist = async () => {
    await loadWishlistFromDatabase();
  };

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
