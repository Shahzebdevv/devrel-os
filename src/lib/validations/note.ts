import { z } from "zod"

export const NOTE_CATEGORIES = [
  "Article Draft",
  "Opportunity Notes",
  "Learning",
  "General",
] as const

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(NOTE_CATEGORIES).optional(),
})

export type NoteFormData = z.infer<typeof noteSchema>
