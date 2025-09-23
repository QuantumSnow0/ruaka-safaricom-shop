"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Button from "@lipam/components/ui/Button";
import Input from "@lipam/components/ui/Input";
import { useCart } from "@lipam/contexts/CartContext";
import { useAuth } from "@lipam/contexts/AuthContext";
import { formatPrice } from "@lipam/lib/utils";
import toast from "react-hot-toast";
import WhatsAppOrder from "@lipam/components/ui/whatsappOrder";

// Kenyan Counties (47 counties)
const kenyanCounties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita Taveta",
  "Tana River",
  "Tharaka Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  terms: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {},
  });

  const finalTotal = total;

  // Handle loading state and redirect if cart is empty
  useEffect(() => {
    console.log("Checkout page - Cart items:", items);
    console.log("Checkout page - Cart total:", total);

    // Give a small delay to allow cart state to update
    const timer = setTimeout(() => {
      setIsLoading(false);

      // If cart is empty after delay, redirect to products
      if (items.length === 0) {
        console.log("Cart is empty, redirecting to products");
        router.push("/products");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [items.length, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      if (!user) {
        toast.error("Please sign in to place an order");
        return;
      }

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: items,
        totalAmount: finalTotal,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          county: data.county,
        },
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      };

      console.log("Sending order data:", orderData);

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Invalid response from server");
      }

      console.log("Order API response:", result);

      if (!response.ok || !result.success) {
        console.error("Order creation failed:", result);
        throw new Error(result.message || "Failed to place order");
      }

      // Set order success
      setOrderId(result.order.orderNumber);
      setOrderSuccess(true);
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Your order has been confirmed and will be processed shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-lg font-bold text-gray-900">
                {orderId}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/orders")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                View Order Details
              </Button>
              <Button
                onClick={() => router.push("/products")}
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Loading state while cart is being updated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Preparing Your Order
            </h1>
            <p className="text-gray-600">
              Please wait while we prepare your checkout...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WhatsAppOrder />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-orange-600 hover:text-orange-700 mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    error={errors.lastName?.message}
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(\+254|0)[0-9]{9}$/,
                        message: "Please enter a valid Kenyan phone number",
                      },
                    })}
                    error={errors.phone?.message}
                    helperText="Format: +254XXXXXXXXX or 0XXXXXXXXX"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County
                  </label>
                  <select
                    {...register("county", { required: "County is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select your county</option>
                    {kenyanCounties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                  {errors.county && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.county.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("terms", {
                      required: "You must accept the terms and conditions",
                    })}
                    className="mr-3 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                loading={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order - ${formatPrice(finalTotal)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 relative overflow-hidden rounded-lg">
                      <img
                        src={
                          item.product.image_urls?.[0] ||
                          "/placeholder-phone.jpg"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
