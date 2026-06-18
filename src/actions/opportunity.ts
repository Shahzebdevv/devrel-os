"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { opportunitySchema } from "@/lib/validations/opportunity"

export async function getOpportunities() {
  return prisma.opportunity.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function createOpportunity(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = opportunitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.opportunity.create({
    data: {
      title: data.title,
      organization: data.organization,
      url: data.url || null,
      category: data.category,
      status: data.status,
      description: data.description || null,
    },
  })

  revalidatePath("/opportunities")
  return { success: true }
}

export async function updateOpportunity(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = opportunitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.opportunity.update({
    where: { id },
    data: {
      title: data.title,
      organization: data.organization,
      url: data.url || null,
      category: data.category,
      status: data.status,
      description: data.description || null,
    },
  })

  revalidatePath("/opportunities")
  return { success: true }
}

export async function deleteOpportunity(id: number) {
  await prisma.opportunity.delete({ where: { id } })
  revalidatePath("/opportunities")
  return { success: true }
}
