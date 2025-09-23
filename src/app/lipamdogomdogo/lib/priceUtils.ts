// Smart price range utilities for dynamic pricing based on variants

export interface PriceVariant {
  storage: string;
  ram: string;
  network: string;
  price: number;
  deposit?: number;
  daily_installment?: number;
}

export interface SmartPriceRange {
  minPrice: number;
  maxPrice: number;
  priceRange: string;
  hasVariants: boolean;
  variants: PriceVariant[];
}

/**
 * Generate smart price range based on product variants
 */
export function generateSmartPriceRange(product: any): SmartPriceRange {
  const variants: PriceVariant[] = [];

  // Add installment plan variants (these have the actual prices for different storage/RAM combinations)
  if (product.installment_plans && Array.isArray(product.installment_plans)) {
    product.installment_plans.forEach((plan: any) => {
      // For Lipa Pole Pole sites, the deposit IS the price
      // Use deposit as the price, fallback to plan.price, then base price
      const variantPrice = plan.deposit || plan.price || product.price;

      variants.push({
        storage: plan.storage,
        ram: plan.ram,
        network: plan.network || "",
        price: variantPrice,
        deposit: plan.deposit,
        daily_installment: plan.daily_installment,
      });
    });
  }

  // If no installment plans, try to create variants from storage/ram options with base price
  if (variants.length === 0) {
    // Base variant from main product
    variants.push({
      storage: product.storage || "Unknown",
      ram: product.ram || "Unknown",
      network: product.network || "",
      price: product.price,
      deposit: product.deposit_64gb || product.deposit_128gb,
      daily_installment:
        product.daily_installment_64gb || product.daily_installment_128gb,
    });

    // Add storage/ram option variants if they exist
    if (
      product.storage_options &&
      product.storage_options.length > 0 &&
      product.ram_options &&
      product.ram_options.length > 0
    ) {
      product.storage_options.forEach((storage: string) => {
        product.ram_options.forEach((ram: string) => {
          // Skip if this combination already exists
          const exists = variants.some(
            (v) => v.storage === storage && v.ram === ram
          );
          if (!exists) {
            variants.push({
              storage,
              ram,
              network: product.network || "",
              price: product.price, // Use base price for now
              deposit: product.deposit_64gb || product.deposit_128gb,
              daily_installment:
                product.daily_installment_64gb ||
                product.daily_installment_128gb,
            });
          }
        });
      });
    }
  }

  // Remove duplicate variants (same storage, RAM, and network combination)
  const uniqueVariants = variants.filter(
    (variant, index, self) =>
      index ===
      self.findIndex(
        (v) =>
          v.storage === variant.storage &&
          v.ram === variant.ram &&
          v.network === variant.network
      )
  );

  // Calculate price range
  const prices = uniqueVariants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const hasVariants = uniqueVariants.length > 1;

  let priceRange: string;
  if (hasVariants) {
    if (minPrice === maxPrice) {
      priceRange = `KSh ${minPrice.toLocaleString()}`;
    } else {
      priceRange = `KSh ${minPrice.toLocaleString()} - KSh ${maxPrice.toLocaleString()}`;
    }
  } else {
    priceRange = `KSh ${minPrice.toLocaleString()}`;
  }

  return {
    minPrice,
    maxPrice,
    priceRange,
    hasVariants,
    variants: uniqueVariants.sort((a, b) => a.price - b.price),
  };
}

/**
 * Get the best price display for a product
 */
export function getBestPriceDisplay(product: any): string {
  const priceRange = generateSmartPriceRange(product);
  return priceRange.priceRange;
}

/**
 * Check if product has multiple variants that require selection
 */
export function requiresVariantSelection(product: any): boolean {
  const priceRange = generateSmartPriceRange(product);

  // Don't require selection if there's only one unique variant
  if (priceRange.variants.length <= 1) {
    return false;
  }

  // Check if there are actually different storage, RAM, or network options
  const storageOptions = [
    ...new Set(priceRange.variants.map((v) => v.storage)),
  ];
  const ramOptions = [...new Set(priceRange.variants.map((v) => v.ram))];
  const networkOptions = [
    ...new Set(priceRange.variants.map((v) => v.network)),
  ];

  // Only require selection if there are multiple unique storage, RAM, or network options
  return (
    storageOptions.length > 1 ||
    ramOptions.length > 1 ||
    networkOptions.length > 1
  );
}

/**
 * Get available storage options
 */
export function getStorageOptions(product: any): string[] {
  const priceRange = generateSmartPriceRange(product);
  const storageOptions = [
    ...new Set(priceRange.variants.map((v) => v.storage)),
  ];
  return storageOptions.sort();
}

/**
 * Get available RAM options for a specific storage
 */
export function getRamOptionsForStorage(
  product: any,
  selectedStorage: string
): string[] {
  const priceRange = generateSmartPriceRange(product);
  const ramOptions = priceRange.variants
    .filter((v) => v.storage === selectedStorage)
    .map((v) => v.ram);
  return [...new Set(ramOptions)].sort();
}

/**
 * Get available network options for a specific storage and RAM combination
 */
export function getNetworkOptionsForStorageAndRam(
  product: any,
  selectedStorage: string,
  selectedRam: string
): string[] {
  const priceRange = generateSmartPriceRange(product);
  const networkOptions = priceRange.variants
    .filter((v) => v.storage === selectedStorage && v.ram === selectedRam)
    .map((v) => v.network)
    .filter((network) => network && network.trim() !== ""); // Filter out empty or undefined network values
  return [...new Set(networkOptions)].sort();
}

/**
 * Get price for specific storage, RAM, and network combination
 */
export function getPriceForVariant(
  product: any,
  storage: string,
  ram: string,
  network: string
): number | null {
  const priceRange = generateSmartPriceRange(product);
  const variant = priceRange.variants.find(
    (v) => v.storage === storage && v.ram === ram && v.network === network
  );

  return variant ? variant.price : null;
}

/**
 * Get installment details for specific storage, RAM, and network combination
 */
export function getInstallmentForVariant(
  product: any,
  storage: string,
  ram: string,
  network: string
): {
  deposit: number | null;
  daily_installment: number | null;
} {
  const priceRange = generateSmartPriceRange(product);
  const variant = priceRange.variants.find(
    (v) => v.storage === storage && v.ram === ram && v.network === network
  );
  return {
    deposit: variant?.deposit || null,
    daily_installment: variant?.daily_installment || null,
  };
}

/**
 * Calculate original price from current price and discount percentage
 */
export function calculateOriginalPrice(
  currentPrice: number,
  discountPercentage: number
): number {
  if (!discountPercentage || discountPercentage <= 0) {
    return currentPrice;
  }

  // Formula: originalPrice = currentPrice / (1 - discountPercentage/100)
  const originalPrice = currentPrice / (1 - discountPercentage / 100);
  return Math.round(originalPrice);
}

/**
 * Get price display with original price strikethrough if there's a discount
 */
export function getPriceDisplayWithOriginal(product: any): {
  currentPrice: string;
  originalPrice?: string;
  hasDiscount: boolean;
} {
  const priceRange = generateSmartPriceRange(product);
  const hasDiscount =
    product.discount_percentage && product.discount_percentage > 0;

  if (!hasDiscount) {
    return {
      currentPrice: priceRange.priceRange,
      hasDiscount: false,
    };
  }

  // Calculate original prices for the range
  const originalMinPrice = calculateOriginalPrice(
    priceRange.minPrice,
    product.discount_percentage
  );
  const originalMaxPrice = calculateOriginalPrice(
    priceRange.maxPrice,
    product.discount_percentage
  );

  let originalPriceRange: string;
  if (priceRange.hasVariants) {
    if (priceRange.minPrice === priceRange.maxPrice) {
      originalPriceRange = `KSh ${originalMinPrice.toLocaleString()}`;
    } else {
      originalPriceRange = `KSh ${originalMinPrice.toLocaleString()} - KSh ${originalMaxPrice.toLocaleString()}`;
    }
  } else {
    originalPriceRange = `KSh ${originalMinPrice.toLocaleString()}`;
  }

  return {
    currentPrice: priceRange.priceRange,
    originalPrice: originalPriceRange,
    hasDiscount: true,
  };
}
