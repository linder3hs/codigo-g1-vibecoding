/**
 * Notification Utilities
 * Utility functions for common toast notifications
 * Import and use these functions throughout the application
 * 
 * @example
 * import { notifications } from "@/utils/notifications";
 * 
 * notifications.success("Tarea creada exitosamente!");
 * notifications.error("Error al crear la tarea");
 */
export const notifications = {
  /**
   * Show success notification
   */
  success: async (message: string, description?: string) => {
    const { toast } = await import("sonner");
    toast.success(message, { description });
  },

  /**
   * Show error notification
   */
  error: async (message: string, description?: string) => {
    const { toast } = await import("sonner");
    toast.error(message, { description });
  },

  /**
   * Show info notification
   */
  info: async (message: string, description?: string) => {
    const { toast } = await import("sonner");
    toast.info(message, { description });
  },

  /**
   * Show warning notification
   */
  warning: async (message: string, description?: string) => {
    const { toast } = await import("sonner");
    toast.warning(message, { description });
  },

  /**
   * Show loading notification
   */
  loading: async (message: string) => {
    const { toast } = await import("sonner");
    return toast.loading(message);
  },

  /**
   * Dismiss notification
   */
  dismiss: async (toastId?: string | number) => {
    const { toast } = await import("sonner");
    toast.dismiss(toastId);
  },
};

export default notifications;