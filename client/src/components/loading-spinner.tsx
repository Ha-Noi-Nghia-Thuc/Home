import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      aria-busy="true"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      <span className="ml-3 text-muted-foreground">Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
