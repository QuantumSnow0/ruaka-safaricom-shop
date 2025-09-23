import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { Product } from "@lipam/lib/types";
import { formatPrice } from "@lipam/lib/utils";
import {
  getBestPriceDisplay,
  requiresVariantSelection,
  getPriceDisplayWithOriginal,
} from "@lipam/lib/priceUtils";
import Button from "./Button";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@lipam/contexts/CartContext";
import { useWishlist } from "@lipam/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
  viewMode?: "grid" | "list";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  className = "",
  viewMode = "grid",
}) => {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  // Get current cart quantity for this product
  const getCartQuantity = () => {
    const cartItem = items.find((item) => item.product_id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartQuantity = getCartQuantity();

  const handleSelectOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }

    onAddToWishlist?.(product);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = "254711271206";
    const message =
      "Hi! I'm interested in ordering this product:\n\n" +
      "📱 *" +
      product.name +
      "*\n" +
      "💰 Price: " +
      (product.pricerange || formatPrice(product.price)) +
      "\n" +
      (product.brand ? "🏷️ Brand: " + product.brand + "\n" : "") +
      (product.model ? "📋 Model: " + product.model + "\n" : "") +
      "\nPlease let me know about availability and delivery options.";

    const whatsappUrl =
      "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
    window.open(whatsappUrl, "_blank");
  };

  if (viewMode === "list") {
    return (
      <div
        className={
          "group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 " +
          className
        }
      >
        <div className="flex">
          <Link
            href={"/lipamdogomdogo/products/" + product.id}
            className="flex-shrink-0"
          >
            <div className="relative w-32 h-32 overflow-hidden bg-gray-50">
              {/* Discount Badge */}
              {product.discount_percentage &&
                product.discount_percentage > 0 && (
                  <div className="absolute top-1 left-1 z-10">
                    <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      -{product.discount_percentage}%
                    </div>
                  </div>
                )}

              <Image
                src={
                  product.image_urls?.[product.image_urls.length - 1] ||
                  "/placeholder-phone.jpg"
                }
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500 p-2"
              />
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs bg-red-500 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <Link
              href={"/lipamdogomdogo/products/" + product.id}
              className="cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    {product.brand}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 leading-tight hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {(() => {
                    const priceDisplay = getPriceDisplayWithOriginal(product);
                    return (
                      <div className="mb-1">
                        {priceDisplay.hasDiscount &&
                          priceDisplay.originalPrice && (
                            <div className="text-sm text-gray-500 line-through mb-1">
                              {priceDisplay.originalPrice}
                            </div>
                          )}
                        <div className="text-xl font-bold text-orange-500">
                          {priceDisplay.currentPrice}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {product.storage}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {product.ram}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={handleAddToWishlist}
                className={
                  "p-2 rounded-full bg-gray-100 transition-all duration-200 " +
                  (isInWishlist(product.id)
                    ? "text-red-500 bg-red-50"
                    : "text-gray-600 hover:text-red-500 hover:bg-red-50")
                }
              >
                <Heart
                  size={16}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
              </button>
              {cartQuantity > 0 ? (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-2">
                  <QuantitySelector
                    quantity={cartQuantity}
                    onIncrement={() =>
                      updateQuantity(product.id, cartQuantity + 1)
                    }
                    onDecrement={() => {
                      if (cartQuantity <= 1) {
                        removeItem(product.id);
                      } else {
                        updateQuantity(product.id, cartQuantity - 1);
                      }
                    }}
                    onRemove={() => removeItem(product.id)}
                    className="justify-center"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = "/cart";
                    }}
                    className="w-full mt-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-200 text-xs"
                    size="sm"
                  >
                    <span className="hidden sm:inline">View Cart</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSelectOptions}
                  disabled={!product.in_stock}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Select Options
                </Button>
              )}
              <Button
                onClick={handleWhatsAppOrder}
                className="hidden bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <MessageCircle size={16} className="mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-300 hover:border-orange-200 flex flex-col h-full " +
        className
      }
    >
      <Link href={"/lipamdogomdogo/products/" + product.id}>
        <div className="relative h-48 overflow-hidden bg-white">
          {/* Discount Badge */}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.discount_percentage}%
              </div>
            </div>
          )}

          <Image
            src={
              product.image_urls?.[product.image_urls.length - 1] ||
              "/placeholder-phone.jpg"
            }
            alt={product.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500 p-2"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleAddToWishlist}
              className={
                "flex items-center justify-center p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 " +
                (isInWishlist(product.id)
                  ? "text-red-500 bg-red-50"
                  : "text-gray-600 hover:text-red-500 hover:bg-red-50")
              }
            >
              <Heart
                size={16}
                fill={isInWishlist(product.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </Link>

      <Link
        href={"/lipamdogomdogo/products/" + product.id}
        className="p-1 px-4 flex flex-col cursor-pointer"
      >
        <div className="mb-[0px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {product.brand}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight hover:text-orange-600 transition-colors min-h-[2rem]">
            {product.name.split("(")[0]}
          </h3>
        </div>

        <div className="mb-[0px]">
          {(() => {
            // Check if there are multiple installment plans with different deposits (price range)
            const hasMultipleDeposits =
              product.installment_plans &&
              product.installment_plans.length > 1 &&
              product.installment_plans.some((plan: any) => plan.deposit) &&
              new Set(
                product.installment_plans.map((plan: any) => plan.deposit)
              ).size > 1;

            // If there's a price range from installment plans, show it without strikethrough
            if (hasMultipleDeposits) {
              const deposits = product
                .installment_plans!.filter((plan: any) => plan.deposit)
                .map((plan: any) => plan.deposit)
                .sort((a: number, b: number) => a - b);

              const minDeposit = Math.min(...deposits);
              const maxDeposit = Math.max(...deposits);

              const priceRange =
                minDeposit === maxDeposit
                  ? `KSh ${minDeposit.toLocaleString()}`
                  : `KSh ${minDeposit.toLocaleString()} - KSh ${maxDeposit.toLocaleString()}`;

              return (
                <div className="text-xs font-bold text-orange-500">
                  {priceRange}
                </div>
              );
            }

            // For regular prices, show discount if available
            const priceDisplay = getPriceDisplayWithOriginal(product);
            return (
              <div className="flex items-center gap-2">
                {priceDisplay.hasDiscount && priceDisplay.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {priceDisplay.originalPrice}
                  </div>
                )}
                <div className="text-xs font-bold text-orange-500">
                  {priceDisplay.currentPrice}
                </div>
              </div>
            );
          })()}
        </div>
      </Link>

      <div className="mt-auto p-2 pt-0">
        {cartQuantity > 0 ? (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-1.5">
            <QuantitySelector
              quantity={cartQuantity}
              onIncrement={() => updateQuantity(product.id, cartQuantity + 1)}
              onDecrement={() => {
                if (cartQuantity <= 1) {
                  removeItem(product.id);
                } else {
                  updateQuantity(product.id, cartQuantity - 1);
                }
              }}
              onRemove={() => removeItem(product.id)}
              className="justify-center"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/cart";
              }}
              className="w-full mt-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-200 text-xs"
              size="sm"
            >
              <span className="hidden sm:inline">View Cart</span>
              <span className="sm:hidden">View</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSelectOptions}
            disabled={!product.in_stock}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            size="sm"
          >
            <ShoppingCart size={12} className="mr-1" />
            <span className="hidden sm:inline">Select Options</span>
            <span className="sm:hidden">Options</span>
          </Button>
        )}
        <Button
          onClick={handleWhatsAppOrder}
          className="hidden w-full mt-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-105"
          size="sm"
        >
          <MessageCircle size={14} className="mr-1" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
