import { z } from "zod"

export const OPPORTUNITY_CATEGORIES = [
  "Technical Writing",
  "Open Source",
  "Web3",
  "DevRel",
  "Community",
  "Fellowship",
  "Internship",
] as const

export const OPPORTUNITY_STATUSES = [
  "Researching",
  "Applied",
  "Active",
  "Rejected",
  "Completed",
] as const

export const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.enum(OPPORTUNITY_CATEGORIES),
  status: z.enum(OPPORTUNITY_STATUSES),
  description: z.string().optional(),
})

export type OpportunityFormData = z.infer<typeof opportunitySchema>
