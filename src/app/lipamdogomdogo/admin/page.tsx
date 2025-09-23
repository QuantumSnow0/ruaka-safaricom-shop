"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import Button from "@lipam/components/ui/Button";
import Modal from "@lipam/components/ui/Modal";
import AdminAuth from "@lipam/components/admin/AdminAuth";
import { formatPrice, formatDate } from "@lipam/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import {
  getContactMessages,
  updateContactMessageStatus,
} from "@lipam/lib/contactUtils";
import { ContactMessage } from "@lipam/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  color: string;
  image_urls?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  in_stock: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  // New fields for products page display
  is_curved_display?: boolean;
  is_special_offer?: boolean;
  discount_percentage?: number;
  special_badges?: string[];
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_flash_sale?: boolean;
  is_limited?: boolean;
  is_hot_deal?: boolean;
  offer_id?: string;
  // Price range and variant options
  priceRange?: string;
  storage_options?: string[];
  network_options?: string[];
  ram_options?: string[];
  installment_plans?: Array<{
    storage: string;
    ram: string;
    network: string;
    price: number;
    deposit: number;
    daily_installment: number;
  }>;
  // Technical specifications
  display?: string;
  processor?: string;
  camera?: string;
  battery?: string;
  software?: string;
  // Category and tagging
  category?: string;
  subcategory?: string;
  tags?: string[];
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_county: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeUsers: number;
}

interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  side_image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [showMessageDetails, setShowMessageDetails] = useState(false);

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [showEditOffer, setShowEditOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedOfferImage, setSelectedOfferImage] = useState<File | null>(
    null
  );
  const [offerImagePreview, setOfferImagePreview] = useState<string>("");

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    title: "",
    subtitle: "",
  });
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [messageFilterStatus, setMessageFilterStatus] = useState("all");

  // New product form state - simplified to match live site
  const [newProduct, setNewProduct] = useState({
    // Basic Info
    name: "",
    brand: "",
    model: "",
    color: "",
    description: "",

    // Pricing
    price: "",
    original_price: "",
    discount_percentage: "",
    // Note: Price range is automatically calculated from variants

    // Storage & Memory
    storage: "",
    ram: "",

    // Variant Options
    storage_options: [] as string[],
    network_options: [] as string[],
    ram_options: [] as string[],

    // Technical Specs
    display: "",
    processor: "",
    camera: "",
    battery: "",
    software: "",

    // Dynamic Installment Plans
    installment_plans: [
      {
        storage: "",
        ram: "",
        network: "",
        price: 0,
        deposit: 0,
        daily_installment: 0,
      },
    ],

    // Stock & Status
    stock_quantity: "",
    in_stock: true,

    // Display Options
    is_curved_display: false,
    is_special_offer: false,
    is_featured: false,
    is_bestseller: false,
    is_flash_sale: false,
    is_limited: false,
    is_hot_deal: false,

    // Category and Tagging
    category: "",
    subcategory: "",
    tags: [] as string[],
  });

  // Image upload state
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Installment plan management functions
  const addInstallmentPlan = () => {
    setNewProduct({
      ...newProduct,
      installment_plans: [
        ...newProduct.installment_plans,
        {
          storage: "",
          ram: "",
          network: "",
          price: 0,
          deposit: 0,
          daily_installment: 0,
        },
      ],
    });
  };

  const removeInstallmentPlan = (index: number) => {
    if (newProduct.installment_plans.length > 1) {
      setNewProduct({
        ...newProduct,
        installment_plans: newProduct.installment_plans.filter(
          (_, i) => i !== index
        ),
      });
    }
  };

  const updateInstallmentPlan = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedPlans = [...newProduct.installment_plans];
    // Convert numeric fields to numbers
    const numericFields = ["price", "deposit", "daily_installment"];
    const processedValue = numericFields.includes(field)
      ? parseFloat(value) || 0
      : value;

    updatedPlans[index] = { ...updatedPlans[index], [field]: processedValue };
    setNewProduct({
      ...newProduct,
      installment_plans: updatedPlans,
    });
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      if (offerImagePreview) {
        URL.revokeObjectURL(offerImagePreview);
      }
    };
  }, [imagePreviewUrls, offerImagePreview]);

  const loadOffers = async () => {
    try {
      const response = await fetch("/api/offers");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch offers");
      }

      setOffers(data.offers || []);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Failed to load offers");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadOrders(),
        loadUsers(),
        loadStats(),
        loadContactMessages(),
        loadOffers(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Image upload functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add new files to existing ones (allow multiple selections)
      setSelectedImages((prev) => [...prev, ...files]);

      // Create preview URLs for new files
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }

    // Reset the input to allow selecting the same files again
    e.target.value = "";
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    console.log("Starting image upload for add product...");
    console.log("Files to upload:", files.length);

    const uploadPromises = files.map(async (file, index) => {
      console.log(`Uploading image ${index + 1}:`, file.name);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log("Upload path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error for", file.name, ":", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      console.log("Upload successful for", file.name, ":", data.publicUrl);
      return data.publicUrl;
    });

    const result = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully:", result);
    return result;
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);

    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviews);
  };

  // Offer image upload functions
  const handleOfferImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedOfferImage(file);
      const previewUrl = URL.createObjectURL(file);
      setOfferImagePreview(previewUrl);
    }
    e.target.value = "";
  };

  const uploadOfferImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `offer-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `offers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/orders/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const loadUsers = async () => {
    try {
      // First try to get users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.log("Profiles table not found, falling back to orders table");

        // Fallback: Get users from orders table
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            user_id,
            customer_name,
            customer_phone,
            created_at
          `
          )
          .not("user_id", "is", null)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // Get unique users and their order counts
        const userMap: { [key: string]: any } = {};

        if (ordersData && ordersData.length > 0) {
          ordersData.forEach((order: any) => {
            const userId = order.user_id;
            if (!userMap[userId]) {
              userMap[userId] = {
                id: userId,
                email: `user-${userId.substring(0, 8)}@example.com`,
                full_name:
                  order.customer_name || `User ${userId.substring(0, 8)}`,
                phone: order.customer_phone || null,
                created_at: order.created_at,
                order_count: 0,
                is_admin: false,
              };
            }
            userMap[userId].order_count += 1;
          });
        }

        // If no orders found, create a sample user for demonstration
        if (Object.keys(userMap).length === 0) {
          userMap["demo-user"] = {
            id: "demo-user",
            email: "demo@example.com",
            full_name: "Demo User",
            phone: "+254700000000",
            created_at: new Date().toISOString(),
            order_count: 0,
            is_admin: false,
          };
        }

        const usersData = Object.values(userMap).sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setUsers(usersData);
        console.log("Loaded users from orders:", usersData);
        return;
      }

      // If profiles table exists, use it
      if (profilesData && profilesData.length > 0) {
        // Get order counts for each user
        const { data: orderCounts } = await supabase
          .from("orders")
          .select("user_id")
          .not("user_id", "is", null);

        const orderCountMap: { [key: string]: number } = {};
        if (orderCounts) {
          orderCounts.forEach((order: any) => {
            orderCountMap[order.user_id] =
              (orderCountMap[order.user_id] || 0) + 1;
          });
        }

        const usersData = profilesData.map((profile: any) => ({
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`,
          full_name: profile.full_name || `User ${profile.id.substring(0, 8)}`,
          phone: profile.phone || null,
          created_at: profile.created_at,
          order_count: orderCountMap[profile.id] || 0,
          is_admin: false,
        }));

        setUsers(usersData);
        console.log("Loaded users from profiles:", usersData);
      } else {
        // No profiles found, show empty state
        setUsers([]);
        console.log("No users found in profiles table");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      // If there's an error, show a message but don't break the page
      setUsers([]);
    }
  };

  const loadStats = async () => {
    try {
      // Get total revenue from all orders (since we don't have payment status)
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total_amount");

      const totalRevenue =
        revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Get total orders
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get total products
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Get active users (users with orders)
      const { data: usersData } = await supabase
        .from("orders")
        .select("user_id")
        .not("user_id", "is", null);

      const uniqueUsers = new Set(
        usersData?.map((order) => order.user_id) || []
      );
      const activeUsers = uniqueUsers.size;

      setStats({
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        activeUsers,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadContactMessages = async () => {
    try {
      const messages = await getContactMessages();
      setContactMessages(messages);
    } catch (error) {
      console.error("Error loading contact messages:", error);
      setContactMessages([]);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload images if any are selected
    let imageUrls: string[] = ["/placeholder-phone.jpg"]; // Default placeholder
    if (selectedImages.length > 0) {
      imageUrls = await uploadImages(selectedImages);
    }

    // Simplified product data - start with only essential fields
    const productData = {
      // Required fields only
      name: newProduct.name,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),

      // Optional fields - only include if they have values
      ...(newProduct.model && { model: newProduct.model }),
      ...(newProduct.color && { color: newProduct.color }),
      ...(newProduct.description && { description: newProduct.description }),
      ...(newProduct.storage && { storage: newProduct.storage }),
      ...(newProduct.ram && { ram: newProduct.ram }),
      ...(newProduct.display && { display: newProduct.display }),
      ...(newProduct.processor && { processor: newProduct.processor }),
      ...(newProduct.camera && { camera: newProduct.camera }),
      ...(newProduct.battery && { battery: newProduct.battery }),
      ...(newProduct.software && { software: newProduct.software }),

      // Pricing fields - only include if they exist in database
      ...(newProduct.original_price && {
        original_price: parseFloat(newProduct.original_price),
      }),
      ...(newProduct.discount_percentage && {
        discount_percentage: parseFloat(newProduct.discount_percentage),
      }),

      // Stock fields
      ...(newProduct.stock_quantity && {
        stock_quantity: parseInt(newProduct.stock_quantity),
      }),
      in_stock: newProduct.in_stock,

      // Images
      image_urls: imageUrls,

      // Variant Options
      ...(newProduct.storage_options.length > 0 && {
        storage_options: newProduct.storage_options,
      }),
      ...(newProduct.network_options.length > 0 && {
        network_options: newProduct.network_options,
      }),
      ...(newProduct.ram_options.length > 0 && {
        ram_options: newProduct.ram_options,
      }),

      // Dynamic Installment Plans - include all plans with at least storage, ram, and deposit
      installment_plans: newProduct.installment_plans
        .filter((plan) => plan.storage && plan.ram && plan.deposit > 0)
        .map((plan) => ({
          storage: plan.storage,
          ram: plan.ram,
          network: plan.network || "",
          price: plan.price || 0,
          deposit: plan.deposit,
          daily_installment: plan.daily_installment || 0,
        })),

      // Display Options
      is_curved_display: newProduct.is_curved_display,
      is_special_offer: newProduct.is_special_offer,
      is_featured: newProduct.is_featured,
      is_bestseller: newProduct.is_bestseller,
      is_flash_sale: newProduct.is_flash_sale,
      is_limited: newProduct.is_limited,
      is_hot_deal: newProduct.is_hot_deal,

      // Category and Tagging
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      tags: newProduct.tags,
    };

    try {
      setUploadingImages(true);

      console.log("Attempting to insert product with data:", productData);
      console.log(
        "Installment plans being sent:",
        productData.installment_plans
      );

      const { data, error } = await supabase
        .from("products")
        .insert([productData]);

      console.log("Supabase response - data:", data);
      console.log("Supabase response - error:", error);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        // Try to get more details about the error
        console.error("Error object keys:", Object.keys(error));
        console.error("Error object values:", Object.values(error));

        // Try to stringify the entire error object
        try {
          console.error("Full error object:", JSON.stringify(error, null, 2));
        } catch (e) {
          console.error("Could not stringify error:", e);
        }

        // Check if it's a network error
        if (
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("NetworkError")
        ) {
          console.error("This appears to be a network error");
        }

        // Check if it's a permission error
        if (
          error.message?.includes("403") ||
          error.message?.includes("permission") ||
          error.message?.includes("forbidden")
        ) {
        }

        throw error;
      }

      toast.success("Product added successfully!");
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        brand: "",
        model: "",
        color: "",
        description: "",
        storage_options: [],
        network_options: [],
        ram_options: [],
        price: "",
        original_price: "",
        discount_percentage: "",
        storage: "",
        ram: "",
        display: "",
        processor: "",
        camera: "",
        battery: "",
        software: "",
        installment_plans: [
          {
            storage: "",
            ram: "",
            network: "",
            price: 0,
            deposit: 0,
            daily_installment: 0,
          },
        ],
        stock_quantity: "",
        in_stock: true,
        is_curved_display: false,
        is_special_offer: false,
        is_featured: false,
        is_bestseller: false,
        is_flash_sale: false,
        is_limited: false,
        is_hot_deal: false,
        category: "",
        subcategory: "",
        tags: [],
      });
      setSelectedImages([]);
      setImagePreviewUrls([]);
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error("Error adding product:", error);

      toast.error(
        `Failed to add product: ${error?.message || "Unknown error"}`
      );
    } finally {
      setUploadingImages(false);
    }
  };

  // Edit product function
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Handle images: combine existing images with new ones
    let imageUrls: string[] =
      existingImages.length > 0 ? existingImages : ["/placeholder-phone.jpg"];

    // If new images are selected, upload them and add to existing images
    if (selectedImages.length > 0) {
      try {
        console.log("Starting image upload for edit product...");
        console.log("Selected images:", selectedImages.length);

        const uploadPromises = selectedImages.map(async (file, index) => {
          console.log(`Uploading image ${index + 1}:`, file.name);
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          console.log("Upload path:", filePath);

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error for", file.name, ":", uploadError);
            throw uploadError;
          }

          const { data } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

          console.log("Upload successful for", file.name, ":", data.publicUrl);
          return data.publicUrl;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        console.log("All images uploaded successfully:", newImageUrls);

        // Combine existing images with new ones
        imageUrls = [...existingImages, ...newImageUrls];
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error(
          `Failed to upload images: ${
            (error as any)?.message ||
            (error as any)?.details ||
            "Unknown error"
          }`
        );
        return;
      }
    }

    // Prepare product data for update
    const productData = {
      name: newProduct.name,
      brand: newProduct.brand,
      model: newProduct.model,
      color: newProduct.color,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      original_price: newProduct.original_price
        ? parseFloat(newProduct.original_price)
        : null,
      discount_percentage: newProduct.discount_percentage
        ? parseFloat(newProduct.discount_percentage)
        : null,
      storage: newProduct.storage,
      ram: newProduct.ram,
      display: newProduct.display,
      processor: newProduct.processor,
      camera: newProduct.camera,
      battery: newProduct.battery,
      software: newProduct.software,
      image_urls: imageUrls,
      in_stock: newProduct.in_stock,
      stock_quantity: parseInt(newProduct.stock_quantity) || 0,

      // Variant options
      ...(newProduct.storage_options.length > 0 && {
        storage_options: newProduct.storage_options,
      }),
      ...(newProduct.network_options.length > 0 && {
        network_options: newProduct.network_options,
      }),
      ...(newProduct.ram_options.length > 0 && {
        ram_options: newProduct.ram_options,
      }),

      // Dynamic Installment Plans - include all plans with at least storage, ram, and deposit
      installment_plans: newProduct.installment_plans
        .filter((plan) => plan.storage && plan.ram && plan.deposit > 0)
        .map((plan) => ({
          storage: plan.storage,
          ram: plan.ram,
          network: plan.network || "",
          price: plan.price || 0,
          deposit: plan.deposit,
          daily_installment: plan.daily_installment || 0,
        })),

      // Display Options
      is_curved_display: newProduct.is_curved_display,
      is_special_offer: newProduct.is_special_offer,
      is_featured: newProduct.is_featured,
      is_bestseller: newProduct.is_bestseller,
      is_flash_sale: newProduct.is_flash_sale,
      is_limited: newProduct.is_limited,
      is_hot_deal: newProduct.is_hot_deal,

      // Category and Tagging
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      tags: newProduct.tags,
    };

    try {
      setUploadingImages(true);

      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        throw error;
      }

      toast.success("Product updated successfully!");
      setShowEditProduct(false);
      setEditingProduct(null);
      setNewProduct({
        name: "",
        brand: "",
        model: "",
        color: "",
        description: "",
        storage_options: [],
        network_options: [],
        ram_options: [],
        price: "",
        original_price: "",
        discount_percentage: "",
        storage: "",
        ram: "",
        display: "",
        processor: "",
        camera: "",
        battery: "",
        software: "",
        installment_plans: [
          {
            storage: "",
            ram: "",
            network: "",
            price: 0,
            deposit: 0,
            daily_installment: 0,
          },
        ],
        stock_quantity: "",
        in_stock: true,
        is_curved_display: false,
        is_special_offer: false,
        is_featured: false,
        is_bestseller: false,
        is_flash_sale: false,
        is_limited: false,
        is_hot_deal: false,
        category: "",
        subcategory: "",
        tags: [],
      });
      setSelectedImages([]);
      setImagePreviewUrls([]);
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Unknown error occurred";
      toast.error(`Failed to update product: ${errorMessage}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Function to start editing a product
  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      description: product.description || "",
      storage_options: product.storage_options || [],
      network_options: product.network_options || [],
      ram_options: product.ram_options || [],
      price: product.price?.toString() || "",
      original_price: product.original_price?.toString() || "",
      discount_percentage: product.discount_percentage?.toString() || "",
      storage: product.storage || "",
      ram: product.ram || "",
      display: product.display || "",
      processor: product.processor || "",
      camera: product.camera || "",
      battery: product.battery || "",
      software: product.software || "",
      installment_plans: (() => {
        const mappedPlans =
          product.installment_plans && product.installment_plans.length > 0
            ? product.installment_plans.map((plan) => ({
                storage: plan.storage?.toString() || "",
                ram: plan.ram?.toString() || "",
                network: plan.network?.toString() || "",
                price: plan.price || 0,
                deposit: plan.deposit || 0,
                daily_installment: plan.daily_installment || 0,
              }))
            : [
                {
                  storage: "",
                  ram: "",
                  network: "",
                  price: 0,
                  deposit: 0,
                  daily_installment: 0,
                },
              ];

        return mappedPlans;
      })(),
      stock_quantity: product.stock_quantity?.toString() || "",
      in_stock: product.in_stock ?? true,
      is_curved_display: product.is_curved_display || false,
      is_special_offer: product.is_special_offer || false,
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      is_flash_sale: product.is_flash_sale || false,
      is_limited: product.is_limited || false,
      is_hot_deal: product.is_hot_deal || false,
      category: product.category || "",
      subcategory: product.subcategory || "",
      tags: product.tags || [],
    });
    setExistingImages(product.image_urls || []);
    setImagePreviewUrls([]); // Clear new image previews
    setSelectedImages([]); // Clear selected images when editing
    setShowEditProduct(true);
  };

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      let updateData: any = {};

      switch (action) {
        case "approve":
          updateData = { status: "approved" };
          break;
        case "reject":
          updateData = { status: "cancelled" };
          break;
        case "ship":
          updateData = { status: "shipped" };
          break;
        case "deliver":
          updateData = { status: "delivered" };
          break;
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order ${action}ed successfully!`);
      loadOrders();
      loadStats();
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast.success("Product deleted successfully!");
      loadProducts();
      loadStats();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateMessageStatus = async (
    messageId: string,
    status: ContactMessage["status"]
  ) => {
    try {
      const result = await updateContactMessageStatus(messageId, status);

      if (result.success) {
        toast.success(result.message);
        loadContactMessages(); // Reload messages to update the UI
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("Failed to update message status");
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_county.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(userSearchQuery.toLowerCase());

    return matchesSearch;
  });

  // Filter contact messages based on search and status
  const filteredMessages = contactMessages.filter((message) => {
    const matchesSearch =
      message.name?.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
      message.email?.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
      message.subject
        ?.toLowerCase()
        .includes(messageSearchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(messageSearchQuery.toLowerCase());

    const matchesStatus =
      messageFilterStatus === "all" || message.status === messageFilterStatus;

    return matchesSearch && matchesStatus;
  });

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.model?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.category
        ?.toLowerCase()
        .includes(productSearchQuery.toLowerCase()) ||
      product.subcategory
        ?.toLowerCase()
        .includes(productSearchQuery.toLowerCase()) ||
      product.tags?.some((tag) =>
        tag.toLowerCase().includes(productSearchQuery.toLowerCase())
      );

    return matchesSearch;
  });

  // Pagination for products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [productSearchQuery]);

  // Offers management functions
  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Upload image if selected
      if (selectedOfferImage) {
        imageUrl = await uploadOfferImage(selectedOfferImage);
      }

      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: offerForm.title,
          subtitle: offerForm.subtitle,
          side_image_url: imageUrl,
          is_active: true,
          display_order: offers.length + 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create offer");
      }

      toast.success("Offer created successfully!");
      setShowAddOffer(false);
      setOfferForm({
        title: "",
        subtitle: "",
      });
      setSelectedOfferImage(null);
      setOfferImagePreview("");
      loadOffers();
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to create offer");
    }
  };

  const handleEditOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingOffer) return;

    try {
      let imageUrl = editingOffer.side_image_url || "";

      // Upload new image if selected
      if (selectedOfferImage) {
        imageUrl = await uploadOfferImage(selectedOfferImage);
      }

      const response = await fetch(`/api/offers/${editingOffer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: offerForm.title,
          subtitle: offerForm.subtitle,
          side_image_url: imageUrl,
          is_active: editingOffer.is_active,
          display_order: editingOffer.display_order,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update offer");
      }

      toast.success("Offer updated successfully!");
      setShowEditOffer(false);
      setEditingOffer(null);
      setOfferForm({
        title: "",
        subtitle: "",
      });
      setSelectedOfferImage(null);
      setOfferImagePreview("");
      loadOffers();
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer");
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete offer");
      }

      toast.success("Offer deleted successfully!");
      loadOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const startEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      subtitle: offer.subtitle || "",
    });
    setOfferImagePreview(offer.side_image_url || "");
    setSelectedOfferImage(null);
    setShowEditOffer(true);
  };

  const assignProductToOffer = async (
    productId: string,
    offerId: string | null
  ) => {
    try {
      const response = await fetch(`/api/products/${productId}/offer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offer_id: offerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign product to offer");
      }

      toast.success(
        offerId ? "Product assigned to offer!" : "Product removed from offer!"
      );
      loadProducts(); // Refresh products to show updated offer status
    } catch (error) {
      console.error("Error assigning product to offer:", error);
      toast.error("Failed to assign product to offer");
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your e-commerce platform</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: Package },
                { id: "products", label: "Products", icon: Package },
                { id: "orders", label: "Orders", icon: ShoppingCart },
                { id: "users", label: "Users", icon: Users },
                { id: "offers", label: "Offers", icon: DollarSign },
                { id: "messages", label: "Messages", icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats.totalRevenue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Products
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalProducts}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Active Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.activeUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Orders
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "delivered"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.order_items?.length || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="text-orange-600 hover:text-orange-900 mr-2"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Search and Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search products by name, brand, model, category..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Showing {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                      {filteredProducts.length} products
                    </span>
                    {productSearchQuery && (
                      <button
                        onClick={() => setProductSearchQuery("")}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Display
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={
                                    product.image_urls?.[0] ||
                                    "/placeholder-phone.jpg"
                                  }
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div
                                  className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                                  title={product.name}
                                >
                                  {product.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                  {product.name.split(" ").length > 2 && "..."}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                  {product.model}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock_quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {product.is_curved_display && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Curved
                                </span>
                              )}
                              {product.is_special_offer && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Offer
                                </span>
                              )}
                              {product.is_featured && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Featured
                                </span>
                              )}
                              {product.discount_percentage && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  -{product.discount_percentage}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={product.offer_id || ""}
                              onChange={(e) =>
                                assignProductToOffer(
                                  product.id,
                                  e.target.value || null
                                )
                              }
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="">No Offer</option>
                              {offers.map((offer) => (
                                <option key={offer.id} value={offer.id}>
                                  {offer.title}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.in_stock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditProduct(product)}
                                className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                title="Edit Product"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page{" "}
                          <span className="font-medium">{currentPage}</span> of{" "}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          {/* Page numbers */}
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNum =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (pageNum > totalPages) return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === pageNum
                                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {order.customer_name}
                            </div>
                            <div className="text-gray-500">
                              {order.customer_phone}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {order.customer_county}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.order_items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="text-orange-600 hover:text-orange-900"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            {order.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleOrderAction(order.id, "approve")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleOrderAction(order.id, "reject")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            {order.status === "approved" && (
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "ship")
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Shipped"
                              >
                                <Package size={16} />
                              </button>
                            )}
                            {order.status === "shipped" && (
                              <button
                                onClick={() =>
                                  handleOrderAction(order.id, "deliver")
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Mark as Delivered"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Users ({filteredUsers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <span className="text-orange-600 font-medium text-sm">
                                    {user.full_name?.charAt(0)?.toUpperCase() ||
                                      user.email?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.full_name || "No Name"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone || "Not provided"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.order_count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                className="text-orange-600 hover:text-orange-900"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="View Orders"
                              >
                                <ShoppingCart size={16} />
                              </button>
                              {user.is_admin && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  Admin
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No users found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {userSearchQuery
                        ? "Try adjusting your search terms."
                        : "No users have registered yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Offers Management
                </h2>
                <Button
                  onClick={() => setShowAddOffer(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Offer
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Offers ({offers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtitle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {offer.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {offer.subtitle || "No subtitle"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {offer.side_image_url ? (
                              <img
                                src={offer.side_image_url}
                                alt={offer.title}
                                className="h-12 w-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                offer.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {offer.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {offer.display_order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditOffer(offer)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Edit Offer"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Offer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {offers.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No offers found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new offer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Messages
                </h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <select
                    value={messageFilterStatus}
                    onChange={(e) => setMessageFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Messages</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Messages ({filteredMessages.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMessages.map((message) => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Mail className="text-blue-600" size={16} />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {message.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {message.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {message.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {message.subject}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {message.message.substring(0, 100)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                message.priority === "urgent"
                                  ? "bg-red-100 text-red-800"
                                  : message.priority === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : message.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {message.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                message.status === "new"
                                  ? "bg-blue-100 text-blue-800"
                                  : message.status === "read"
                                  ? "bg-green-100 text-green-800"
                                  : message.status === "replied"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {message.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(message.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setShowMessageDetails(true);
                                }}
                                className="text-orange-600 hover:text-orange-900"
                                title="View Message"
                              >
                                <Eye size={16} />
                              </button>
                              {message.status === "new" && (
                                <button
                                  onClick={() =>
                                    handleUpdateMessageStatus(
                                      message.id,
                                      "read"
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as Read"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              {message.status === "read" && (
                                <button
                                  onClick={() =>
                                    handleUpdateMessageStatus(
                                      message.id,
                                      "replied"
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Mark as Replied"
                                >
                                  <MessageSquare size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredMessages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No messages found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {messageSearchQuery || messageFilterStatus !== "all"
                        ? "Try adjusting your search or filter terms."
                        : "No contact messages have been received yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          <Modal
            isOpen={showAddProduct}
            onClose={() => {
              setShowAddProduct(false);
              setNewProduct({
                name: "",
                brand: "",
                model: "",
                color: "",
                description: "",
                storage_options: [],
                network_options: [],
                ram_options: [],
                price: "",
                original_price: "",
                discount_percentage: "",
                storage: "",
                ram: "",
                display: "",
                processor: "",
                camera: "",
                battery: "",
                software: "",
                installment_plans: [
                  {
                    storage: "",
                    ram: "",
                    network: "",
                    price: 0,
                    deposit: 0,
                    daily_installment: 0,
                  },
                ],
                stock_quantity: "",
                in_stock: true,
                is_curved_display: false,
                is_special_offer: false,
                is_featured: false,
                is_bestseller: false,
                is_flash_sale: false,
                is_limited: false,
                is_hot_deal: false,
                category: "",
                subcategory: "",
                tags: [],
              });
              setSelectedImages([]);
              setImagePreviewUrls([]);
              setExistingImages([]);
            }}
            title="Add New Product"
            size="xl"
          >
            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Basic Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Oppo A3x (128GB/4GB; 8MP Dual Camera; 5100mAh)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Oppo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={newProduct.model}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, model: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., A3x"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={newProduct.color}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, color: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Mist White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock_quantity: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Product description..."
                  />
                </div>
              </div>

              {/* Category and Tagging */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Category & Tagging
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="smartphones">Smartphones</option>
                      <option value="tablets">Tablets</option>
                      <option value="accessories">Accessories</option>
                      <option value="cases">Cases & Covers</option>
                      <option value="chargers">Chargers</option>
                      <option value="earphones">Earphones</option>
                      <option value="powerbanks">Power Banks</option>
                      <option value="cables">Cables</option>
                      <option value="screen-protectors">
                        Screen Protectors
                      </option>
                      <option value="gaming">Gaming Accessories</option>
                      <option value="smart-watches">Smart Watches</option>
                      <option value="laptops">Laptops</option>
                      <option value="cameras">Cameras</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={newProduct.subcategory}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          subcategory: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Wireless, Wired, Fast Charging"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProduct.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., wireless, fast charging, bluetooth, premium"
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price (KES) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 3600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (for discounts)
                    </label>
                    <input
                      type="number"
                      value={newProduct.original_price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          original_price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 4200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      value={newProduct.discount_percentage}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discount_percentage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 15"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display
                    </label>
                    <input
                      type="text"
                      value={newProduct.display}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          display: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 6.67 Inches, 720 x 1604 Pixels"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Processor
                    </label>
                    <input
                      type="text"
                      value={newProduct.processor}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          processor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 2.4 GHz Octa-core"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camera
                    </label>
                    <input
                      type="text"
                      value={newProduct.camera}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, camera: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 8MP + Auxiliary Lens"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery
                    </label>
                    <input
                      type="text"
                      value={newProduct.battery}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          battery: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 5,100mAh, 45W Fast Charging"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Software
                    </label>
                    <input
                      type="text"
                      value={newProduct.software}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          software: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Android 14, ColorOS 14"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Storage & RAM (Optional)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newProduct.storage}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            storage: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 128GB (optional - use installment plans below)"
                      />
                      <input
                        type="text"
                        value={newProduct.ram}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, ram: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 4GB (optional - use installment plans below)"
                      />
                    </div>
                  </div>

                  {/* Variant Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Variant Options (Like Reference Site)
                    </h3>

                    {/* Storage Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProduct.storage_options.join(", ")}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            storage_options: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 64GB, 128GB, 256GB"
                      />
                    </div>

                    {/* Network Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Network Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProduct.network_options.join(", ")}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            network_options: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 4G, 5G"
                      />
                    </div>

                    {/* RAM Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RAM Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProduct.ram_options.join(", ")}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            ram_options: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 2GB, 4GB, 8GB"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Installment Plans */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Installment Plans
                  </h3>
                  <Button
                    type="button"
                    onClick={addInstallmentPlan}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Plan
                  </Button>
                </div>

                <div className="space-y-4">
                  {newProduct.installment_plans.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Combination {index + 1}
                        </h4>
                        {newProduct.installment_plans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInstallmentPlan(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Storage
                          </label>
                          <input
                            type="text"
                            value={plan.storage}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "storage",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 64GB, 128GB, 256GB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            RAM
                          </label>
                          <input
                            type="text"
                            value={plan.ram}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "ram",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 4GB, 6GB, 8GB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Network
                          </label>
                          <input
                            type="text"
                            value={plan.network}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "network",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 4G, 5G, WiFi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit (KES)
                          </label>
                          <input
                            type="number"
                            value={plan.deposit || ""}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "deposit",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 2900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Daily Installment (KES)
                          </label>
                          <input
                            type="number"
                            value={plan.daily_installment || ""}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "daily_installment",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 75"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Options - Organized by Product Page Sections */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Product Page Display Options
                </h3>

                {/* Main Sections */}
                <div className="space-y-6">
                  {/* Featured Products Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                      Featured Products Section
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Products that appear in the &quot;Featured Products&quot;
                      section on the products page
                    </p>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.is_featured}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            is_featured: e.target.checked,
                          })
                        }
                        className="mr-3 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Show in Featured Products
                      </span>
                    </label>
                  </div>

                  {/* Special Offers Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                      Special Offers Section
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Products that appear in the &quot;Special Offers&quot;
                      section with discount styling
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_special_offer}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_special_offer: e.target.checked,
                            })
                          }
                          className="mr-3 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Show in Special Offers
                        </span>
                      </label>
                      {newProduct.is_special_offer && (
                        <div className="ml-6 p-3 bg-orange-50 rounded-lg">
                          <p className="text-xs text-orange-700 mb-2">
                            Special offer products will display with discount
                            badges and special styling
                          </p>
                          <div className="flex items-center space-x-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Discount Percentage
                              </label>
                              <input
                                type="number"
                                value={newProduct.discount_percentage}
                                onChange={(e) =>
                                  setNewProduct({
                                    ...newProduct,
                                    discount_percentage: e.target.value,
                                  })
                                }
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                                placeholder="25"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Original Price
                              </label>
                              <input
                                type="number"
                                value={newProduct.original_price}
                                onChange={(e) =>
                                  setNewProduct({
                                    ...newProduct,
                                    original_price: e.target.value,
                                  })
                                }
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                                placeholder="5000"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Curved Display Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Curved Display Section
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Products that appear in the &quot;Immersive Curved
                      Display&quot; section
                    </p>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.is_curved_display}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            is_curved_display: e.target.checked,
                          })
                        }
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Show in Curved Display
                      </span>
                    </label>
                  </div>

                  {/* Additional Badges */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                      Additional Product Badges
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Additional badges that appear on product cards
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_bestseller}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_bestseller: e.target.checked,
                            })
                          }
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          Bestseller
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_flash_sale}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_flash_sale: e.target.checked,
                            })
                          }
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          Flash Sale
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_limited}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_limited: e.target.checked,
                            })
                          }
                          className="mr-2 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700">Limited</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_hot_deal}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_hot_deal: e.target.checked,
                            })
                          }
                          className="mr-2 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Hot Deal</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images
                </h3>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    style={{ color: "#111827" }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload multiple images (JPG, PNG, GIF) - You can select
                    multiple files at once or add more later
                  </p>
                </div>

                {/* Image Previews */}
                {(existingImages.length > 0 || imagePreviewUrls.length > 0) && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {showEditProduct ? "Product Images" : "Selected Images"}{" "}
                        ({existingImages.length + imagePreviewUrls.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImages([]);
                          setImagePreviewUrls([]);
                          // Clear existing images in edit mode
                          if (showEditProduct) {
                            setExistingImages([]);
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Existing
                          </div>
                        </div>
                      ))}
                      {/* New Image Previews */}
                      {imagePreviewUrls.map((url, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`New Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={uploadingImages}
                >
                  {uploadingImages ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading Images...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Edit Product Modal */}
          <Modal
            isOpen={showEditProduct}
            onClose={() => {
              setShowEditProduct(false);
              setEditingProduct(null);
              setNewProduct({
                name: "",
                brand: "",
                model: "",
                color: "",
                description: "",
                storage_options: [],
                network_options: [],
                ram_options: [],
                price: "",
                original_price: "",
                discount_percentage: "",
                storage: "",
                ram: "",
                display: "",
                processor: "",
                camera: "",
                battery: "",
                software: "",
                installment_plans: [
                  {
                    storage: "",
                    ram: "",
                    network: "",
                    price: 0,
                    deposit: 0,
                    daily_installment: 0,
                  },
                ],
                stock_quantity: "",
                in_stock: true,
                is_curved_display: false,
                is_special_offer: false,
                is_featured: false,
                is_bestseller: false,
                is_flash_sale: false,
                is_limited: false,
                is_hot_deal: false,
                category: "",
                subcategory: "",
                tags: [],
              });
              setSelectedImages([]);
              setImagePreviewUrls([]);
              setExistingImages([]);
            }}
            title="Edit Product"
            size="xl"
          >
            <form onSubmit={handleEditProduct} className="space-y-6">
              {/* Basic Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Oppo A3x (128GB/4GB; 8MP Dual Camera; 5100mAh)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Oppo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={newProduct.model}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, model: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., A3x"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={newProduct.color}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, color: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Mist White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock_quantity: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Product description..."
                  />
                </div>

                {/* Category and Tagging */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Category & Tagging
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="tablets">Tablets</option>
                        <option value="accessories">Accessories</option>
                        <option value="cases">Cases & Covers</option>
                        <option value="chargers">Chargers</option>
                        <option value="earphones">Earphones</option>
                        <option value="powerbanks">Power Banks</option>
                        <option value="cables">Cables</option>
                        <option value="screen-protectors">
                          Screen Protectors
                        </option>
                        <option value="gaming">Gaming Accessories</option>
                        <option value="smart-watches">Smart Watches</option>
                        <option value="laptops">Laptops</option>
                        <option value="cameras">Cameras</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={newProduct.subcategory}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            subcategory: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Wireless, Wired, Fast Charging"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newProduct.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., wireless, fast charging, bluetooth, premium"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas. These help with search and
                      filtering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 3600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (KES)
                    </label>
                    <input
                      type="number"
                      value={newProduct.original_price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          original_price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 4200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      value={newProduct.discount_percentage}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discount_percentage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage
                    </label>
                    <input
                      type="text"
                      value={newProduct.storage}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          storage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 128GB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RAM
                    </label>
                    <input
                      type="text"
                      value={newProduct.ram}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, ram: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 4GB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display
                    </label>
                    <input
                      type="text"
                      value={newProduct.display}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          display: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 6.1 inch HD+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Processor
                    </label>
                    <input
                      type="text"
                      value={newProduct.processor}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          processor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Snapdragon 680"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camera
                    </label>
                    <input
                      type="text"
                      value={newProduct.camera}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, camera: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 8MP Dual Camera"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery
                    </label>
                    <input
                      type="text"
                      value={newProduct.battery}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          battery: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 5100mAh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Software
                    </label>
                    <input
                      type="text"
                      value={newProduct.software}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          software: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Android 13"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Installment Plans */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Storage/RAM/Network Combinations & Pricing
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Set specific deposits and installment plans for different
                      storage, RAM, and network combinations
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={addInstallmentPlan}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Combination
                  </Button>
                </div>

                <div className="space-y-4">
                  {newProduct.installment_plans.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Combination {index + 1}
                        </h4>
                        {newProduct.installment_plans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInstallmentPlan(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Storage
                          </label>
                          <input
                            type="text"
                            value={plan.storage}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "storage",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 64GB, 128GB, 256GB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            RAM
                          </label>
                          <input
                            type="text"
                            value={plan.ram}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "ram",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 4GB, 6GB, 8GB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Network
                          </label>
                          <input
                            type="text"
                            value={plan.network}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "network",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 4G, 5G, WiFi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (KES) - Optional
                          </label>
                          <input
                            type="number"
                            value={plan.price || ""}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 2200 (optional)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit (KES) *
                          </label>
                          <input
                            type="number"
                            value={plan.deposit || ""}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "deposit",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 2900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Daily Installment (KES)
                          </label>
                          <input
                            type="number"
                            value={plan.daily_installment || ""}
                            onChange={(e) =>
                              updateInstallmentPlan(
                                index,
                                "daily_installment",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., 75"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Product Page Display Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">
                      Featured Section
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_featured}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_featured: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Show in Featured Section
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">
                      Special Offers Section
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_special_offer}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_special_offer: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Show in Special Offers
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">
                      Curved Display Section
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.is_curved_display}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              is_curved_display: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Show in Curved Display
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">
                      Stock Status
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.in_stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              in_stock: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          In Stock
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images
                </h3>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    style={{ color: "#111827" }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload multiple images (JPG, PNG, GIF) - You can select
                    multiple files at once or add more later
                  </p>
                </div>

                {/* Image Previews */}
                {(existingImages.length > 0 || imagePreviewUrls.length > 0) && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {showEditProduct ? "Product Images" : "Selected Images"}{" "}
                        ({existingImages.length + imagePreviewUrls.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImages([]);
                          setImagePreviewUrls([]);
                          // Clear existing images in edit mode
                          if (showEditProduct) {
                            setExistingImages([]);
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Existing
                          </div>
                        </div>
                      ))}
                      {/* New Image Previews */}
                      {imagePreviewUrls.map((url, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`New Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditProduct(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadingImages}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {uploadingImages ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Order Details Modal */}
          <Modal
            isOpen={showOrderDetails}
            onClose={() => setShowOrderDetails(false)}
            title="Order Details"
            size="xl"
          >
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Order Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      ID: {selectedOrder.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(selectedOrder.created_at)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {formatPrice(selectedOrder.total_amount)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Customer Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      Name: {selectedOrder.customer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {selectedOrder.customer_phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      County: {selectedOrder.customer_county}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Order Summary</h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Order Number: {selectedOrder.order_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Amount: {formatPrice(selectedOrder.total_amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {selectedOrder.status}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.order_items &&
                    selectedOrder.order_items.length > 0 ? (
                      selectedOrder.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.product?.name ||
                                "Product Name Not Available"}
                            </p>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>Quantity: {item.quantity}</p>
                              <p>Price per item: {formatPrice(item.price)}</p>
                              {item.product && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <p>Brand: {item.product.brand}</p>
                                  <p>Model: {item.product.model}</p>
                                  <p>
                                    Storage: {item.product.storage} | RAM:{" "}
                                    {item.product.ram}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        <p>No order items available</p>
                        <p className="text-xs mt-1">
                          This might be because the order_items table is not set
                          up or the relationship is broken.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    Customer Details
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.customer_name} -{" "}
                    {selectedOrder.customer_phone} -{" "}
                    {selectedOrder.customer_county}
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowOrderDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Message Details Modal */}
          <Modal
            isOpen={showMessageDetails}
            onClose={() => {
              setShowMessageDetails(false);
              setSelectedMessage(null);
            }}
            title="Message Details"
            size="xl"
          >
            {selectedMessage && (
              <div className="space-y-6">
                {/* Header with Status and Priority */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedMessage.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedMessage.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : selectedMessage.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : selectedMessage.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedMessage.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedMessage.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : selectedMessage.status === "read"
                          ? "bg-green-100 text-green-800"
                          : selectedMessage.status === "replied"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedMessage.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Phone className="text-gray-500 mr-2" size={16} />
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Name:
                        </span>
                        <p className="text-sm text-gray-900">
                          {selectedMessage.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Email:
                        </span>
                        <p className="text-sm text-gray-900">
                          {selectedMessage.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Phone:
                        </span>
                        <p className="text-sm text-gray-900">
                          {selectedMessage.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="text-gray-500 mr-2" size={16} />
                      Message Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Subject:
                        </span>
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedMessage.subject}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Received:
                        </span>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedMessage.created_at)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Last Updated:
                        </span>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedMessage.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="text-gray-500 mr-2" size={16} />
                    Message Content
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedMessage.admin_notes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Edit className="text-gray-500 mr-2" size={16} />
                      Admin Notes
                    </h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.admin_notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    {selectedMessage.status === "new" && (
                      <Button
                        onClick={() =>
                          handleUpdateMessageStatus(selectedMessage.id, "read")
                        }
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    {selectedMessage.status === "read" && (
                      <Button
                        onClick={() =>
                          handleUpdateMessageStatus(
                            selectedMessage.id,
                            "replied"
                          )
                        }
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Mark as Replied
                      </Button>
                    )}
                    {selectedMessage.status === "replied" && (
                      <Button
                        onClick={() =>
                          handleUpdateMessageStatus(
                            selectedMessage.id,
                            "closed"
                          )
                        }
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <XCircle size={16} className="mr-2" />
                        Close Message
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowMessageDetails(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Add Offer Modal */}
          <Modal
            isOpen={showAddOffer}
            onClose={() => setShowAddOffer(false)}
            title="Add New Offer"
            size="lg"
          >
            <form onSubmit={handleAddOffer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Oppo & Redmi Offers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={offerForm.subtitle}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Discover amazing deals on the latest Oppo and Redmi smartphones"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Side Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOfferImageSelect}
                  className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
                {offerImagePreview && (
                  <div className="mt-2">
                    <img
                      src={offerImagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddOffer(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Offer
                </Button>
              </div>
            </form>
          </Modal>

          {/* Edit Offer Modal */}
          <Modal
            isOpen={showEditOffer}
            onClose={() => setShowEditOffer(false)}
            title="Edit Offer"
            size="lg"
          >
            <form onSubmit={handleEditOffer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Oppo & Redmi Offers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={offerForm.subtitle}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Discover amazing deals on the latest Oppo and Redmi smartphones"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Side Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOfferImageSelect}
                  className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
                {offerImagePreview && (
                  <div className="mt-2">
                    <img
                      src={offerImagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditOffer(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Offer
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </AdminAuth>
  );
}
