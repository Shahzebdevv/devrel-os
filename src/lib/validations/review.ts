import { z } from "zod"

export const reviewSchema = z.object({
  weekStart: z.string().min(1, "Week start is required"),
  weekEnd: z.string().min(1, "Week end is required"),
  learned: z.string().optional(),
  built: z.string().optional(),
  wrote: z.string().optional(),
  contributed: z.string().optional(),
  reflection: z.string().optional(),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
