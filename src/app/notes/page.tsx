export const dynamic = "force-dynamic";

import { getNotes } from "@/actions/note"
import { NotesEditor } from "@/components/notes/notes-editor"

export default async function NotesPage() {
  const notes = await getNotes()

  const serialized = notes.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Markdown workspace for article drafts, opportunity research, and learning logs.
        </p>
      </div>
      <NotesEditor notes={serialized} />
    </div>
  )
}
