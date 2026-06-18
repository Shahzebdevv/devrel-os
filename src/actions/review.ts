"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { reviewSchema } from "@/lib/validations/review"

export async function getReviews() {
  return prisma.weeklyReview.findMany({ orderBy: { weekStart: "desc" } })
}

export async function createReview(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = reviewSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.weeklyReview.create({
    data: {
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      learned: data.learned || null,
      built: data.built || null,
      wrote: data.wrote || null,
      contributed: data.contributed || null,
      reflection: data.reflection || null,
    },
  })

  revalidatePath("/weekly-review")
  return { success: true }
}

export async function updateReview(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = reviewSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.weeklyReview.update({
    where: { id },
    data: {
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      learned: data.learned || null,
      built: data.built || null,
      wrote: data.wrote || null,
      contributed: data.contributed || null,
      reflection: data.reflection || null,
    },
  })

  revalidatePath("/weekly-review")
  return { success: true }
}

export async function deleteReview(id: number) {
  await prisma.weeklyReview.delete({ where: { id } })
  revalidatePath("/weekly-review")
  return { success: true }
}
