import { ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductCard from "./ProductCard";

export default function OffersCategory() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Fetch offers and their products
  useEffect(() => {
    const fetchOffersAndProducts = async () => {
      try {
        setLoading(true);

        // First, get the active offer
        const { data: offersData, error: offersError } = await supabase
          .from("offers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(1);

        if (offersError) {
          console.error("Error fetching offers:", offersError);
          return;
        }

        if (offersData && offersData.length > 0) {
          setOffers(offersData);

          // Then get products for this offer
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("*")
            .eq("offer_id", offersData[0].id)
            .limit(6);

          if (productsError) {
            console.error("Error fetching offer products:", productsError);
            // Fallback to general products if offer products fail
            const { data: fallbackProducts } = await supabase
              .from("products")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(6);
            setProducts(fallbackProducts || []);
          } else {
            setProducts(productsData || []);
          }
        } else {
          // No active offers, show general products
          const { data: generalProducts } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6);
          setProducts(generalProducts || []);
        }
      } catch (err) {
        console.error("Error fetching offers and products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndProducts();
  }, [supabase]);

  // Don't render the section if there are no offer products and not loading
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-1 my-6">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <Image
            src={offers[0]?.side_image_url || "/oppo.webp"}
            alt={offers[0]?.title || "Offers"}
            width={300}
            height={500}
            className="rounded-lg w-full max-w-[300px] h-[500px] object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {offers[0]?.title || "Special Offers"}
              </h2>
              {offers[0]?.subtitle && (
                <p className="text-gray-600 text-sm md:text-base">
                  {offers[0].subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center bg-blue-600/10 rounded-xl p-2">
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span className="font-medium text-sm">More Options</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-gray-200 rounded-lg animate-pulse"
                  >
                    <div className="aspect-square bg-gray-300 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="h-full"
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
