import { z } from "zod"

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.coerce.boolean(),
  progress: z.coerce.number().min(0).max(100),
})

export type GoalFormData = z.infer<typeof goalSchema>

export const goalProgressSchema = z.object({
  progress: z.coerce.number().min(0).max(100),
})

export type GoalProgressData = z.infer<typeof goalProgressSchema>
