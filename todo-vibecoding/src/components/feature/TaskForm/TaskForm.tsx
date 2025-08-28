/**
 * TaskForm Component
 * Reusable form component for creating and editing tasks
 * Adapted to work with existing Todo types and service
 */

import React, { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useTodo } from "../../../hooks/useTodo";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Alert, AlertDescription } from "../../ui/alert";
import type { Todo, TaskStatus } from "../../../types/todo";

// Task form schema with only title, description and status
const taskFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().default(""),
  status: z.enum(["pendiente", "en_progreso", "completada"]).default("pendiente"),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

/**
 * Props for TaskForm component
 */
export interface TaskFormProps {
  /** Existing todo for editing (optional) */
  todo?: Todo;
  /** Callback when form is submitted successfully */
  onSubmit?: (data: TaskFormData) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether the form is in loading state */
  isLoading?: boolean;
  /** Form mode - create or edit */
  mode?: "create" | "edit";
  /** Custom submit button text */
  submitText?: string;
  /** Whether to show cancel button */
  showCancel?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Status options for task status select
 */
const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  color: string;
}[] = [
  { value: "pendiente", label: "Pendiente", color: "bg-saffron-500" },
  { value: "en_progreso", label: "En Progreso", color: "bg-charcoal-500" },
  { value: "completada", label: "Completada", color: "bg-persian_green-500" },
];

/**
 * TaskForm - Form component for task creation and editing
 *
 * Features:
 * - Validation with Zod
 * - Basic task attributes (title, description, status, priority)
 * - Integration with Redux store
 * - Responsive design
 * - Accessibility support
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  todo,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  submitText,
  showCancel = true,
  className = "",
}) => {
  const { createNewTodo, updateExistingTodo, error, clearTodoError } =
    useTodo();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema) as Resolver<TaskFormData>,
    defaultValues: {
      title: todo?.title || todo?.text || "",
      description: todo?.description || "",
      status: todo?.status || "pendiente",
    },
    mode: "onChange",
  });

  // Clear errors when component mounts
  useEffect(() => {
    clearTodoError();
  }, [clearTodoError]);

  // Reset form when todo changes (for edit mode)
  useEffect(() => {
    if (todo && mode === "edit") {
      reset({
        title: todo.title || todo.text || "",
        description: todo.description || "",
        status: todo.status,
      });
    }
  }, [todo, mode, reset]);

  /**
   * Handle form submission
   */
  const onFormSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      clearTodoError();

      // Prepare data for API - using the existing CreateTodoInput structure
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
      };

      if (mode === "edit" && todo) {
        await updateExistingTodo(todo.id.toString(), taskData);
      } else {
        await createNewTodo(taskData);
      }

      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(data);
      }

      // Reset form after successful creation
      if (mode === "create") {
        reset();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {mode === "edit" ? "Editar Tarea" : "Crear Nueva Tarea"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message ||
                "Ha ocurrido un error. Por favor, inténtalo de nuevo."}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título *
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Ingresa el título de la tarea..."
                  className={errors.title ? "border-burnt_sienna-500" : ""}
                  autoFocus
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-burnt_sienna-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  placeholder="Ingresa la descripción de la tarea..."
                  className={errors.description ? "border-burnt_sienna-500" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-burnt_sienna-500">{errors.description.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Estado
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={errors.status ? "border-burnt_sienna-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${option.color}`}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-burnt_sienna-500">{errors.status.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === "edit" ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                submitText ||
                (mode === "edit" ? "Actualizar Tarea" : "Crear Tarea")
              )}
            </Button>

            {showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
