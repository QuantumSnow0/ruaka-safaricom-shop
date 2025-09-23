// Category utility functions for filtering and display

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "smartphones",
    name: "Smartphones",
    icon: "📱",
    description: "Mobile phones and smartphones",
  },
  {
    id: "tablets",
    name: "Tablets",
    icon: "📱",
    description: "Tablets and iPads",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "🎧",
    description: "Phone and device accessories",
  },
  {
    id: "cases",
    name: "Cases & Covers",
    icon: "🛡️",
    description: "Phone cases and protective covers",
  },
  {
    id: "chargers",
    name: "Chargers",
    icon: "🔌",
    description: "Charging cables and adapters",
  },
  {
    id: "earphones",
    name: "Earphones",
    icon: "🎧",
    description: "Headphones and earbuds",
  },
  {
    id: "powerbanks",
    name: "Power Banks",
    icon: "🔋",
    description: "Portable power banks",
  },
  {
    id: "cables",
    name: "Cables",
    icon: "🔌",
    description: "Data and charging cables",
  },
  {
    id: "screen-protectors",
    name: "Screen Protectors",
    icon: "🛡️",
    description: "Screen protectors and films",
  },
  {
    id: "gaming",
    name: "Gaming Accessories",
    icon: "🎮",
    description: "Gaming controllers, headsets, and accessories",
  },
  {
    id: "smart-watches",
    name: "Smart Watches",
    icon: "⌚",
    description: "Smart watches and fitness trackers",
  },
  {
    id: "laptops",
    name: "Laptops",
    icon: "💻",
    description: "Laptops and notebooks",
  },
  {
    id: "cameras",
    name: "Cameras",
    icon: "📷",
    description: "Digital cameras and photography equipment",
  },
];

export const SUBCATEGORIES: Record<string, string[]> = {
  smartphones: ["Android", "iOS", "5G", "Budget", "Flagship"],
  tablets: ["Android", "iOS", "Budget", "Premium"],
  accessories: ["Wireless", "Wired", "Bluetooth", "USB-C", "Lightning"],
  cases: ["Silicone", "Leather", "Clear", "Rugged", "Wallet"],
  chargers: ["Fast Charging", "Wireless", "USB-C", "Lightning", "Micro-USB"],
  earphones: ["Wireless", "Wired", "Bluetooth", "Noise Cancelling", "Sports"],
  powerbanks: ["Wireless", "Fast Charging", "High Capacity", "Compact"],
  cables: ["USB-C", "Lightning", "Micro-USB", "Fast Charging", "Data Transfer"],
  "screen-protectors": ["Tempered Glass", "Film", "Privacy", "Anti-Glare"],
  gaming: ["Controllers", "Headsets", "Keyboards", "Mice", "Gaming Chairs"],
  "smart-watches": ["Fitness", "Luxury", "Sports", "Kids", "Health Monitoring"],
  laptops: ["Gaming", "Business", "Student", "Ultrabook", "Workstation"],
  cameras: ["DSLR", "Mirrorless", "Point & Shoot", "Action", "Professional"],
  "home-appliances": [
    "Kitchen",
    "Cleaning",
    "Climate",
    "Security",
    "Smart Home",
  ],
  furniture: ["Living Room", "Bedroom", "Office", "Outdoor", "Storage"],
  clothing: ["Men", "Women", "Kids", "Sports", "Formal"],
  books: ["Fiction", "Non-Fiction", "Educational", "Children", "Reference"],
};

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function getSubcategoriesByCategory(categoryId: string): string[] {
  return SUBCATEGORIES[categoryId] || [];
}

export function filterProductsByCategory(
  products: any[],
  categoryId: string
): any[] {
  if (categoryId === "all") {
    return products;
  }

  return products.filter(
    (product) =>
      product.category === categoryId || product.subcategory === categoryId
  );
}

export function getCategoryBreadcrumb(categoryId: string): Category[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];

  return [{ id: "all", name: "All Products", icon: "📱" }, category];
}

export function generateCategorySlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCategoryName(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category ? category.name : categoryId;
}
