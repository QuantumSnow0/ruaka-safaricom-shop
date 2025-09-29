"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@lipam/lib/types";
import {
  getStorageOptions,
  getRamOptionsForStorage,
  getNetworkOptionsForStorageAndRam,
  getPriceForVariant,
  getInstallmentForVariant,
  requiresVariantSelection,
} from "@lipam/lib/priceUtils";
import { formatPrice } from "@lipam/lib/utils";
import Button from "./ui/Button";
import QuantitySelector from "./ui/QuantitySelector";
import { ShoppingCart } from "lucide-react";

interface VariantSelectorProps {
  product: Product;
  onVariantSelect: (
    storage: string,
    ram: string,
    network: string,
    price: number
  ) => void;
  onWhatsAppOrder: (
    storage: string,
    ram: string,
    network: string,
    price: number
  ) => void;
  onAddToCart: (
    storage: string,
    ram: string,
    network: string,
    price: number
  ) => void;
  onProceedToCheckout: (
    storage: string,
    ram: string,
    network: string,
    price: number
  ) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveFromCart?: (productId: string) => void;
  cartQuantity?: number;
}

export default function VariantSelector({
  product,
  onVariantSelect,
  onWhatsAppOrder,
  onAddToCart,
  onProceedToCheckout,
  onUpdateQuantity,
  onRemoveFromCart,
  cartQuantity = 0,
}: VariantSelectorProps) {
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedRam, setSelectedRam] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [installmentDetails, setInstallmentDetails] = useState<{
    deposit: number | null;
    daily_installment: number | null;
  }>({ deposit: null, daily_installment: null });

  const storageOptions = getStorageOptions(product);
  const ramOptions = selectedStorage
    ? getRamOptionsForStorage(product, selectedStorage)
    : [];
  const networkOptions =
    selectedStorage && selectedRam
      ? getNetworkOptionsForStorageAndRam(product, selectedStorage, selectedRam)
      : [];

  // Check if all storage options are the same
  const allStorageSame =
    storageOptions.length > 1 &&
    storageOptions.every((option) => option === storageOptions[0]);

  // Check if all RAM options are the same
  const allRamSame =
    ramOptions.length > 1 &&
    ramOptions.every((option) => option === ramOptions[0]);

  // Check if all network options are the same
  const allNetworkSame =
    networkOptions.length > 1 &&
    networkOptions.every((option) => option === networkOptions[0]);

  // Initialize with first available options
  useEffect(() => {
    if (storageOptions.length > 0 && !selectedStorage) {
      setSelectedStorage(storageOptions[0]);
    }
  }, [storageOptions, selectedStorage]);

  useEffect(() => {
    if (selectedStorage && ramOptions.length > 0 && !selectedRam) {
      setSelectedRam(ramOptions[0]);
    }
  }, [selectedStorage, ramOptions, selectedRam]);

  useEffect(() => {
    if (
      selectedStorage &&
      selectedRam &&
      networkOptions.length > 0 &&
      !selectedNetwork
    ) {
      setSelectedNetwork(networkOptions[0]);
    }
  }, [selectedStorage, selectedRam, selectedNetwork]);

  // Update price and installment details when variants change
  useEffect(() => {
    if (
      selectedStorage &&
      selectedRam &&
      (networkOptions.length === 0 || selectedNetwork)
    ) {
      const price = getPriceForVariant(
        product,
        selectedStorage,
        selectedRam,
        selectedNetwork || ""
      );
      const installment = getInstallmentForVariant(
        product,
        selectedStorage,
        selectedRam,
        selectedNetwork || ""
      );

      if (price !== null) {
        setSelectedPrice(price);
        setInstallmentDetails(installment);
        onVariantSelect(
          selectedStorage,
          selectedRam,
          selectedNetwork || "",
          price
        );
      }
    }
  }, [
    selectedStorage,
    selectedRam,
    selectedNetwork,
    product,
    onVariantSelect,
    networkOptions.length,
  ]);

  // Don't show variant selector if there are no meaningful choices
  if (
    !requiresVariantSelection(product) ||
    (storageOptions.length === 1 &&
      ramOptions.length === 1 &&
      (networkOptions.length === 0 || networkOptions.length === 1))
  ) {
    return null;
  }

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    setSelectedRam(""); // Reset RAM when storage changes
    setSelectedNetwork(""); // Reset network when storage changes
  };

  const handleRamChange = (ram: string) => {
    setSelectedRam(ram);
    setSelectedNetwork(""); // Reset network when RAM changes
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
  };

  const handleWhatsAppOrder = () => {
    if (
      selectedStorage &&
      selectedRam &&
      (networkOptions.length === 0 || selectedNetwork)
    ) {
      onWhatsAppOrder(
        selectedStorage,
        selectedRam,
        selectedNetwork || "",
        selectedPrice
      );
    }
  };

  const handleAddToCart = () => {
    if (
      selectedStorage &&
      selectedRam &&
      (networkOptions.length === 0 || selectedNetwork)
    ) {
      onAddToCart(
        selectedStorage,
        selectedRam,
        selectedNetwork || "",
        selectedPrice
      );
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Select Your Configuration
      </h3>

      {/* Storage Selection */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Storage
        </label>
        {allStorageSame ? (
          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
            {storageOptions[0]}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {storageOptions.map((storage) => (
              <button
                key={storage}
                onClick={() => handleStorageChange(storage)}
                className={`px-3 py-1.5 rounded-md border-2 transition-all duration-200 text-sm ${
                  selectedStorage === storage
                    ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-25"
                }`}
              >
                {storage}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RAM Selection */}
      {selectedStorage && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            RAM
          </label>
          {allRamSame ? (
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
              {ramOptions[0]}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  onClick={() => handleRamChange(ram)}
                  className={`px-3 py-1.5 rounded-md border-2 transition-all duration-200 text-sm ${
                    selectedRam === ram
                      ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-25"
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Network Selection - Only show if there are network options */}
      {selectedStorage && selectedRam && networkOptions.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Network
          </label>
          {allNetworkSame ? (
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
              {networkOptions[0]}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {networkOptions.map((network) => (
                <button
                  key={network}
                  onClick={() => handleNetworkChange(network)}
                  className={`px-3 py-1.5 rounded-md border-2 transition-all duration-200 text-sm ${
                    selectedNetwork === network
                      ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-25"
                  }`}
                >
                  {network}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Configuration Summary */}
      {selectedStorage &&
        selectedRam &&
        (networkOptions.length === 0 || selectedNetwork) && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">
                Selected Configuration:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {selectedStorage} / {selectedRam}
                {selectedNetwork ? ` / ${selectedNetwork}` : ""}
              </span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {formatPrice(selectedPrice)}
            </div>

            {/* Installment Details */}
            {/* {installmentDetails.deposit &&
              installmentDetails.daily_installment && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-700 mb-1 font-medium">
                    Payment Plan:
                  </div>
                  <div className="flex justify-between text-xs text-gray-800">
                    <span>
                      Deposit: {formatPrice(installmentDetails.deposit)}
                    </span>
                    <span>
                      Daily: {formatPrice(installmentDetails.daily_installment)}
                    </span>
                  </div>
                </div>
              )} */}
          </div>
        )}

      {/* Action Buttons */}
      {selectedStorage &&
        selectedRam &&
        (networkOptions.length === 0 || selectedNetwork) && (
          <div className="space-y-4">
            {/* Cart Actions */}
            {cartQuantity > 0 ? (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-orange-800">
                      Added to Cart
                    </span>
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {cartQuantity} item{cartQuantity !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  <QuantitySelector
                    quantity={cartQuantity}
                    onIncrement={() =>
                      onUpdateQuantity?.(product.id, cartQuantity + 1)
                    }
                    onDecrement={() =>
                      onUpdateQuantity?.(product.id, cartQuantity - 1)
                    }
                    onRemove={() => onRemoveFromCart?.(product.id)}
                    className="justify-center"
                  />

                  <Button
                    onClick={() => (window.location.href = "/cart")}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 text-sm"
                    size="sm"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Proceed to Checkout Button - First Option */}
                <Button
                  onClick={() => {
                    onProceedToCheckout(
                      selectedStorage,
                      selectedRam,
                      selectedNetwork,
                      selectedPrice
                    );
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Add to Cart Button - Second Option */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg text-sm"
                >
                  Add to Cart
                </Button>
              </>
            )}

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm"
            >
              Order via WhatsApp
            </Button>
          </div>
        )}

      {/* Selection Required Message */}
      {(!selectedStorage ||
        !selectedRam ||
        (networkOptions.length > 0 && !selectedNetwork)) && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-xs">
            Please select storage, RAM
            {networkOptions.length > 0 ? ", and network" : ""} to proceed with
            your order
          </p>
        </div>
      )}
    </div>
  );
}
