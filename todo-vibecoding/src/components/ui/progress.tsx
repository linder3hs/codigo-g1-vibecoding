/**
 * Progress Component
 * Displays the completion progress of a task or process
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Progress component props
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Color variant for the progress bar
   */
  variant?: "default" | "success" | "warning" | "destructive";
}

/**
 * Progress component
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    // Calculate percentage
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    // Variant styles for the indicator
    const getIndicatorColor = () => {
      switch (variant) {
        case "success":
          return "bg-green-500";
        case "warning":
          return "bg-yellow-500";
        case "destructive":
          return "bg-red-500";
        default:
          return "bg-primary";
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            getIndicatorColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
export default Progress;