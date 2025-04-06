import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const requiredSignalVariants = cva(" text-red-500", {
  variants: {
    weigth: {
      default: "font-normal",
      light: "font-light",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      black: "font-black",
    },
    size: {
      default: " text-base",
      sm: "text-sm",
      lg: "text-lg",
      xs: "text-xs",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof requiredSignalVariants> {}

const RequiredSignal = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, weigth, ...props }, ref) => {
    return (
      <span
        className={cn(requiredSignalVariants({ size, weigth, className }))}
        ref={ref}
        {...props}
      >
        *
      </span>
    );
  }
);
RequiredSignal.displayName = "RequiredSignal";

export { RequiredSignal, requiredSignalVariants };
