import { z } from "zod"

export const ARTICLE_PLATFORMS = [
  "DEV",
  "Hashnode",
  "Medium",
  "HackerNoon",
] as const

export const ARTICLE_STATUSES = [
  "Idea",
  "Draft",
  "Editing",
  "Published",
] as const

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  platform: z.enum(ARTICLE_PLATFORMS),
  status: z.enum(ARTICLE_STATUSES),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export type ArticleFormData = z.infer<typeof articleSchema>
