import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[#EAF4EE] text-[#1B5E39]",
        success: "bg-[#EAF4EE] text-[#16a34a]",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-600",
        secondary: "bg-[#F0F2F1] text-[#5A6A62]",
        outline: "border border-[#E4E7E5] text-[#5A6A62] bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
