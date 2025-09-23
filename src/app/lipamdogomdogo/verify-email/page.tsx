"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import Button from "@lipam/components/ui/Button";
import { supabase } from "@lipam/lib/supabase";
import dynamic from "next/dynamic";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [message, setMessage] = useState("");

  const email = searchParams.get("email") || "";

  useEffect(() => {
    // Check if user is already verified
    const checkVerification = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setVerificationStatus("success");
        setMessage("Your email has been verified successfully!");
      }
    };

    checkVerification();
  }, []);

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: searchParams.get("token") || "",
        type: "email",
      });

      if (error) throw error;

      setVerificationStatus("success");
      setMessage("Your email has been verified successfully!");

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setVerificationStatus("error");
      setMessage(error.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      setMessage("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      setMessage(error.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
              {verificationStatus === "success" ? (
                <CheckCircle className="h-8 w-8 text-orange-600" />
              ) : (
                <Mail className="h-8 w-8 text-orange-600" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {verificationStatus === "success"
                ? "Email Verified!"
                : "Verify Your Email"}
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              {verificationStatus === "success"
                ? "Your account is now active. You can start shopping!"
                : `We've sent a verification link to ${email}. Please check your email and click the link to verify your account.`}
            </p>

            {/* Status Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  verificationStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : verificationStatus === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {verificationStatus === "pending" && (
                <>
                  <Button
                    onClick={handleVerifyEmail}
                    loading={isVerifying}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </Button>

                  <Button
                    onClick={handleResendEmail}
                    loading={isResending}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isResending ? "Sending..." : "Resend Email"}
                  </Button>
                </>
              )}

              {verificationStatus === "success" && (
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Continue to Homepage
                </Button>
              )}

              {verificationStatus === "error" && (
                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    loading={isResending}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isResending ? "Sending..." : "Resend Email"}
                  </Button>

                  <Button
                    onClick={() => router.push("/signup")}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                resend verification email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DynamicVerifyEmailContent = dynamic(
  () => Promise.resolve(VerifyEmailContent),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicVerifyEmailContent />
    </Suspense>
  );
}
