import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-xl border border-[#E4E7E5] bg-white px-3.5 py-2 text-sm text-[#111917] placeholder:text-[#94A39A] transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-[#1B5E39]/25 focus:border-[#1B5E39]",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F0F2F1]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
