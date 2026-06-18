import { z } from "zod"

export const communitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  joinedAt: z.string().optional(),
})

export type CommunityFormData = z.infer<typeof communitySchema>
