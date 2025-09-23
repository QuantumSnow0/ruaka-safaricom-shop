import React, { useId } from "react";
import { cn } from "@lipam/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      icon,
      iconPosition = "right",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            className={cn(
              "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg text-gray-900 placeholder-gray-500",
              icon && iconPosition === "right" && "pr-12",
              icon && iconPosition === "left" && "pl-12",
              error &&
                "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              className
            )}
            ref={ref}
            autoComplete="off"
            style={{
              backgroundColor: "white",
              color: "#1f2937",
              borderColor: "#e5e7eb",
            }}
            {...props}
          />
          {icon && (
            <div
              className={cn(
                "absolute inset-y-0 flex items-center",
                iconPosition === "right" ? "right-0 pr-3" : "left-0 pl-3"
              )}
            >
              {icon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
