"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { goalSchema, goalProgressSchema } from "@/lib/validations/goal"

export async function getGoals() {
  return prisma.goal.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createGoal(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = goalSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.goal.create({
    data: {
      title: data.title,
      description: data.description || null,
      icon: data.icon || "Target",
      isActive: data.isActive,
      progress: data.progress,
    },
  })

  revalidatePath("/goals")
  return { success: true }
}

export async function updateGoal(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = goalSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.goal.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      icon: data.icon || "Target",
      isActive: data.isActive,
      progress: data.progress,
    },
  })

  revalidatePath("/goals")
  return { success: true }
}

export async function updateGoalProgress(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = goalProgressSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await prisma.goal.update({
    where: { id },
    data: { progress: parsed.data.progress },
  })

  revalidatePath("/goals")
  return { success: true }
}

export async function deleteGoal(id: number) {
  await prisma.goal.delete({ where: { id } })
  revalidatePath("/goals")
  return { success: true }
}
