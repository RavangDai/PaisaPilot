"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#1B5E39] text-white hover:bg-[#154d2f] focus-visible:ring-[#1B5E39] shadow-sm",
        secondary:
          "bg-[#EAF4EE] text-[#1B5E39] hover:bg-[#D1E8DA] focus-visible:ring-[#1B5E39]",
        outline:
          "border border-[#E4E7E5] bg-white text-[#111917] hover:bg-[#F0F2F1] focus-visible:ring-[#1B5E39]",
        ghost:
          "text-[#5A6A62] hover:bg-[#F0F2F1] hover:text-[#111917] focus-visible:ring-[#1B5E39]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-11 px-5 text-sm gap-2",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
