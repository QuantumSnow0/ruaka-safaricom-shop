"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import Button from "./Button";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  min = 1,
  max = 99,
  className = "",
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (quantity < max) {
      onIncrement();
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onDecrement();
    } else if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={handleDecrement}
        variant="outline"
        size="sm"
        className="w-7 h-7 p-0 flex items-center justify-center rounded-full border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
      >
        <Minus size={14} className="text-orange-600" />
      </Button>

      <span className="text-lg font-semibold text-orange-700 min-w-[2rem] text-center">
        {quantity}
      </span>

      <Button
        onClick={handleIncrement}
        variant="outline"
        size="sm"
        className="w-7 h-7 p-0 flex items-center justify-center rounded-full border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
        disabled={quantity >= max}
      >
        <Plus size={14} className="text-orange-600" />
      </Button>
    </div>
  );
}
