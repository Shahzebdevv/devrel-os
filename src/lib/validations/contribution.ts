import { z } from "zod"

export const CONTRIBUTION_TYPES = [
  "Documentation",
  "Code",
  "Translation",
  "Tutorial",
] as const

export const CONTRIBUTION_STATUSES = [
  "Planned",
  "In Progress",
  "Submitted",
  "Merged",
  "Closed",
] as const

export const contributionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  repository: z.string().min(1, "Repository is required"),
  type: z.enum(CONTRIBUTION_TYPES),
  status: z.enum(CONTRIBUTION_STATUSES),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export type ContributionFormData = z.infer<typeof contributionSchema>
