import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTodo } from "../hooks/useTodo";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo";

// Schema específico para el formulario de tareas simplificado
const taskFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").trim(),
  description: z.string().default(""),
  status: z
    .enum(["pendiente", "en_progreso", "completada"])
    .default("pendiente"),
});

interface TaskFormProps {
  /** Initial task data for editing */
  initialData?: Partial<Todo>;
  /** Callback when form is submitted successfully */
  onSuccess?: () => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether the form is in edit mode */
  isEditing?: boolean;
}

/**
 * TaskForm Component
 *
 * A simplified form component for creating and editing tasks.
 * Only handles title, description, and status fields.
 * Features validation with Zod and integration with the useTodo hook.
 *
 * @param props - TaskForm props
 * @returns JSX.Element
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEditing = false,
}) => {
  const { createNewTodo, updateExistingTodo, isLoading } = useTodo();

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "pendiente",
    },
  });

  const onSubmit = async (data: z.infer<typeof taskFormSchema>) => {
    try {
      if (isEditing && initialData?.id) {
        // Update existing task
        const updateData: UpdateTodoInput = {
          title: data.title,
          description: data.description,
          status: data.status,
        };
        await updateExistingTodo(initialData.id, updateData);
      } else {
        // Create new task
        const createData: CreateTodoInput = {
          title: data.title,
          description: data.description || "",
          status: data.status,
        };
        await createNewTodo(createData);
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {isEditing ? "Editar Tarea" : "Nueva Tarea"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Modifica los detalles de la tarea"
            : "Completa los campos para crear una nueva tarea"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Escribe el título de la tarea..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe la tarea (opcional)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                ? "Actualizar Tarea"
                : "Crear Tarea"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
