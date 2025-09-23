import React from "react";
import { Heart, Shield, Clock, Users, Award, Globe } from "lucide-react";
import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Lipamdogomdogo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing how Kenyans access premium smartphones through
            flexible, affordable installment plans.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To make premium smartphones accessible to every Kenyan through
                flexible payment plans. We believe that everyone deserves access
                to the latest technology, regardless of their financial
                situation.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2024, Lipamdogomdogo has been at the forefront of
                democratizing smartphone ownership in Kenya, helping thousands
                of customers get their dream phones.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">Phones Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer First
              </h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for our
                customers. Their success is our success.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Trust & Security
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards of security and transparency
                in all our transactions and customer data handling.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Reliability
              </h3>
              <p className="text-gray-600">
                We deliver on our promises. When we say your phone will arrive
                on time, we mean it.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                We're building a community of smartphone enthusiasts who support
                and learn from each other.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality
              </h3>
              <p className="text-gray-600">
                We only work with genuine, high-quality products from trusted
                manufacturers and suppliers.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Innovation
              </h3>
              <p className="text-gray-600">
                We continuously innovate to provide better payment solutions and
                customer experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full bg-gray-100 shadow-lg">
                <Image
                  src="/ceo.jpg"
                  alt="Samson Maingi Karau - CEO & Founder"
                  fill
                  sizes="(max-width: 768px) 128px, 128px"
                  className="object-cover object-center"
                  priority
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Samson Maingi Karau
              </h3>
              <p className="text-blue-600 mb-2">CEO & Founder</p>
              <p className="text-gray-600">
                Passionate about making technology accessible to everyone.
                Former mobile industry executive with 10+ years experience.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full bg-gray-100 shadow-lg">
                <Image
                  src="/cto.jpg"
                  alt="Bonface Muthuri Mbabu - CTO"
                  fill
                  sizes="(max-width: 768px) 128px, 128px"
                  className="object-cover object-center"
                  priority
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bonface Muthuri Mbabu
              </h3>
              <p className="text-blue-600 mb-2">CTO</p>
              <p className="text-gray-600">
                Tech enthusiast and full-stack developer. Leads our platform
                development and ensures seamless user experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Users className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Grace Wanjiku
              </h3>
              <p className="text-blue-600 mb-2">Head of Customer Success</p>
              <p className="text-gray-600">
                Customer advocate with a passion for helping people find the
                perfect phone for their needs and budget.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-orange-400 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Your Dream Phone?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of satisfied customers who got their phones through
            Lipamdogomdogo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
