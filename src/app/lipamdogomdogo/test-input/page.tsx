"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@lipam/components/ui/Input";

export default function TestInputPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Input Test Page
          </h1>

          <div className="space-y-4">
            <Input
              label="Test Text Input"
              type="text"
              placeholder="Type something here..."
              autoComplete="off"
            />

            <Input
              label="Test Email Input"
              type="email"
              placeholder="test@example.com"
              autoComplete="off"
            />

            <Input
              label="Test Password Input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              autoComplete="off"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            <Input
              label="Test Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="off"
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            <Input
              label="Test Phone Input"
              type="tel"
              placeholder="+254XXXXXXXXX"
              autoComplete="off"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Expected Styling:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• White background</li>
              <li>• Dark gray text (#1f2937)</li>
              <li>• Light gray border (#e5e7eb)</li>
              <li>• Orange focus ring and border</li>
              <li>• Working eye icons for passwords</li>
              <li>• No autofill styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
