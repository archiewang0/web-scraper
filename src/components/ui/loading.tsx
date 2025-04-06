import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex justify-center items-center min-h-screen",
          className
        )}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
);

Loading.displayName = "Loading";

export default Loading;
