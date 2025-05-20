import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullHeight?: boolean;
}

const LoadingSpinner = ({
  size = "md",
  text = "Đang tải...",
  fullHeight = true,
}: LoadingSpinnerProps) => {
  // Xác định kích thước spinner
  const spinnerSize = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }[size];

  // Xác định kích thước chữ
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullHeight && "min-h-screen"
      )}
      aria-busy="true"
    >
      <div
        className={cn(
          "animate-spin rounded-full border-t-primary border-b-primary",
          spinnerSize
        )}
      />
      {text && (
        <span className={cn("ml-3 text-muted-foreground", textSize)}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
