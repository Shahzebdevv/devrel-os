"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { communitySchema } from "@/lib/validations/community"

export async function getCommunities() {
  return prisma.community.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function createCommunity(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = communitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.community.create({
    data: {
      name: data.name,
      role: data.role || null,
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
    },
  })

  revalidatePath("/community")
  return { success: true }
}

export async function updateCommunity(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = communitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.community.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role || null,
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
    },
  })

  revalidatePath("/community")
  return { success: true }
}

export async function deleteCommunity(id: number) {
  await prisma.community.delete({ where: { id } })
  revalidatePath("/community")
  return { success: true }
}
