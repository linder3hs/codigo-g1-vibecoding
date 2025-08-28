/**
 * Mock for validation schemas
 * Provides simplified Zod schemas for testing
 */

import { z } from "zod";

// Mock taskFormSchema
export const taskFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().default(""),
  status: z
    .enum(["pendiente", "en_progreso", "completada"])
    .default("pendiente"),
});

// Mock other commonly used schemas
export const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().default(""),
  status: z.enum(["pendiente", "en_progreso", "completada"]).default("pendiente"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  completed: z.boolean().optional().default(false),
});

export const taskFiltersSchema = z.object({
  status: z.enum(["all", "completed", "pending"]).default("all"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "priority", "text"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Export types
export type TaskFormData = z.infer<typeof taskFormSchema>;
export type TaskData = z.infer<typeof taskSchema>;
export type TaskFiltersData = z.infer<typeof taskFiltersSchema>;

// Default export
export default {
  taskFormSchema,
  taskSchema,
  taskFiltersSchema,
};