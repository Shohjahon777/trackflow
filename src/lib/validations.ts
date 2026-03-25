import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  repoUrl: z.string().url().optional().or(z.literal("")),
  deployUrl: z.string().url().optional().or(z.literal("")),
  stack: z.array(z.string()).default([]),
  category: z.enum(["PERSONAL", "CLIENT", "OPEN_SOURCE", "EXPERIMENT"]).default("PERSONAL"),
});

export const updateProjectSchema = createProjectSchema.extend({
  showOnProfile: z.boolean().optional(),
}).partial();

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Username must be lowercase letters, numbers, and hyphens")
    .optional(),
  bio: z.string().max(300).optional(),
});

export const createTimeLogSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  hours: z.coerce.number().int().min(0).max(999),
  minutes: z.coerce.number().int().min(0).max(59),
  cost: z.coerce.number().min(0).optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  taskId: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
});

export const updateTaskSchema = createTaskSchema.extend({
  pomodoroMinutes: z.coerce.number().int().min(1).max(120).optional(),
}).partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateTimeLogInput = z.infer<typeof createTimeLogSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
