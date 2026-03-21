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

export const updateProjectSchema = createProjectSchema.partial();

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

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
