import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@lipam/lib/types";
import { formatPrice } from "@lipam/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

interface SearchDropdownProps {
  searchQuery: string;
  isOpen: boolean;
  onClose: () => void;
  onProductClick: () => void;
  isMobile?: boolean;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchQuery,
  isOpen,
  onClose,
  onProductClick,
  isMobile = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setProducts([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        console.log("Searching for:", searchQuery);

        // Try with the auth client first - get ALL products to search through
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          console.error("Error with auth client:", error);
          console.error("Error message:", error.message);
          console.error("Error code:", error.code);
          console.error("Error details:", error.details);
          console.error("Error hint:", error.hint);
          console.error("Full error object:", JSON.stringify(error, null, 2));

          // Try with direct client as fallback
          try {
            console.log("Environment variables:");
            console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
            console.log(
              "SUPABASE_ANON_KEY:",
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing"
            );

            const directClient = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            console.log("Attempting fallback search with direct client...");
            const { data: fallbackData, error: fallbackError } =
              await directClient.from("products").select("*");

            if (fallbackError) {
              console.error("Fallback client also failed:", fallbackError);
              console.error("Fallback error message:", fallbackError.message);
              console.error("Fallback error code:", fallbackError.code);
              setProducts([]);
            } else {
              console.log(
                "Fallback search successful, found products:",
                fallbackData?.length || 0
              );
              // Filter products client-side and limit to 6
              const filteredProducts = (fallbackData || [])
                .filter(
                  (product) =>
                    product.name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    product.brand
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    product.model
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .slice(0, 6);
              console.log(
                "Fallback filtered products:",
                filteredProducts.length
              );
              setProducts(filteredProducts);
            }
          } catch (fallbackError) {
            console.error("Fallback client error:", fallbackError);
            setProducts([]);
          }
        } else {
          console.log("Search successful, found products:", data?.length || 0);
          // Filter products client-side since database query might be the issue
          const filteredProducts = (data || [])
            .filter(
              (product) =>
                product.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                product.brand
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                product.model?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 6); // Limit to 6 results after filtering
          console.log("Filtered products:", filteredProducts.length);
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !isButtonClicked
      ) {
        onClose();
      }
      // Reset button clicked flag
      setIsButtonClicked(false);
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose, isButtonClicked]);

  if (!isOpen || !searchQuery.trim()) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`${
          isMobile
            ? "fixed left-4 right-4 top-20 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-96 overflow-hidden"
            : "absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-96 overflow-y-auto"
        }`}
      >
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer"
                    onClick={onProductClick}
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="bg-gray-50 rounded-lg p-2 hover:bg-orange-50 transition-colors duration-200 h-full">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative w-10 h-10 mb-2">
                            <Image
                              src={
                                product.image_urls?.[0] ||
                                "/placeholder-phone.jpg"
                              }
                              alt={product.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                          <h4
                            className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-1 ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {product.name.split("(")[0]}
                          </h4>
                          <p
                            className={`text-gray-600 line-clamp-1 mb-1 ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {product.brand}
                          </p>
                          <p
                            className={`font-bold text-orange-600 ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Results Button */}
              <div className="border-t border-gray-200 pt-2">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsButtonClicked(true);
                    console.log(
                      "View All Results mousedown, searchQuery:",
                      searchQuery
                    );
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsButtonClicked(true);
                    console.log(
                      "View All Results clicked, searchQuery:",
                      searchQuery
                    );
                    const searchUrl = `/products?search=${encodeURIComponent(
                      searchQuery
                    )}`;
                    console.log("Navigating to:", searchUrl);

                    // Try router.push first, fallback to window.location
                    try {
                      router.push(searchUrl);
                    } catch (error) {
                      console.error("Router push failed:", error);
                      window.location.href = searchUrl;
                    }

                    onProductClick();
                  }}
                  className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold cursor-pointer ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                  style={{ pointerEvents: "auto" }}
                >
                  View All Results ({products.length}+)
                </button>
              </div>
            </>
          ) : hasSearched ? (
            <div className="text-center py-8">
              <div
                className={`text-gray-400 mb-2 ${
                  isMobile ? "text-2xl" : "text-4xl"
                }`}
              >
                🔍
              </div>
              <p
                className={`text-gray-600 font-medium ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                No products found
              </p>
              <p
                className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                Try searching for a different term
              </p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDropdown;
