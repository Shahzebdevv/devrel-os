"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { articleSchema } from "@/lib/validations/article"

export async function getArticles() {
  return prisma.article.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function createArticle(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = articleSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.article.create({
    data: {
      title: data.title,
      platform: data.platform,
      status: data.status,
      url: data.url || null,
    },
  })

  revalidatePath("/articles")
  return { success: true }
}

export async function updateArticle(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = articleSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      platform: data.platform,
      status: data.status,
      url: data.url || null,
    },
  })

  revalidatePath("/articles")
  return { success: true }
}

export async function deleteArticle(id: number) {
  await prisma.article.delete({ where: { id } })
  revalidatePath("/articles")
  return { success: true }
}
