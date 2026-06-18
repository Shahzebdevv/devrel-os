"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { contributionSchema } from "@/lib/validations/contribution"

export async function getContributions() {
  return prisma.contribution.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function createContribution(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = contributionSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.contribution.create({
    data: {
      title: data.title,
      repository: data.repository,
      type: data.type,
      status: data.status,
      url: data.url || null,
    },
  })

  revalidatePath("/open-source")
  return { success: true }
}

export async function updateContribution(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = contributionSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.contribution.update({
    where: { id },
    data: {
      title: data.title,
      repository: data.repository,
      type: data.type,
      status: data.status,
      url: data.url || null,
    },
  })

  revalidatePath("/open-source")
  return { success: true }
}

export async function deleteContribution(id: number) {
  await prisma.contribution.delete({ where: { id } })
  revalidatePath("/open-source")
  return { success: true }
}
