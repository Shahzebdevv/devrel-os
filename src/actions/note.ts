"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { noteSchema } from "@/lib/validations/note"

export async function getNotes() {
  return prisma.note.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function createNote(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = noteSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category || null,
    },
  })

  revalidatePath("/notes")
  return { success: true }
}

export async function updateNote(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = noteSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  await prisma.note.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      category: data.category || null,
    },
  })

  revalidatePath("/notes")
  return { success: true }
}

export async function deleteNote(id: number) {
  await prisma.note.delete({ where: { id } })
  revalidatePath("/notes")
  return { success: true }
}
