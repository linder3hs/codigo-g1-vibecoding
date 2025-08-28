/**
 * NotificationSystem Component
 * Global notification system using Sonner toast library
 */

import { Toaster } from "@/components/ui/sonner";

/**
 * NotificationSystem component
 * Provides global toast notifications throughout the application
 * 
 * @example
 * // Usage in Layout component
 * <NotificationSystem />
 * 
 * // Usage in components
 * import { toast } from "sonner";
 * 
 * const handleSuccess = () => {
 *   toast.success("Tarea creada exitosamente!");
 * };
 * 
 * const handleError = () => {
 *   toast.error("Error al crear la tarea");
 * };
 */
export const NotificationSystem = () => {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
};



export default NotificationSystem;