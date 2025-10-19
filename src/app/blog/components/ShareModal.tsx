"use client";

import React from "react";
import { motion } from "framer-motion";
import { Share, MessageSquare, Copy, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  copied: boolean;
}

export default function ShareModal({
  isOpen,
  onClose,
  onShare,
  copied,
}: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
      >
        <h3 className="text-lg font-bold mb-4">Share this article</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onShare("facebook")}
            className="flex items-center gap-2 p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Share size={20} />
            Facebook
          </button>
          <button
            onClick={() => onShare("twitter")}
            className="flex items-center gap-2 p-3 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
          >
            <Share size={20} />
            Twitter
          </button>
          <button
            onClick={() => onShare("whatsapp")}
            className="flex items-center gap-2 p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
          >
            <MessageSquare size={20} />
            WhatsApp
          </button>
          <button
            onClick={() => onShare("linkedin")}
            className="flex items-center gap-2 p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Share size={20} />
            LinkedIn
          </button>
          <button
            onClick={() => onShare("copy")}
            className="flex items-center gap-2 p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors col-span-2"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

