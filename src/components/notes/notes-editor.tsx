"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { NOTE_CATEGORIES } from "@/lib/validations/note"
import { createNote, updateNote, deleteNote } from "@/actions/note"

interface Note {
  id: number
  title: string
  content: string
  category: string | null
  createdAt: string
  updatedAt: string
}

const categoryColors: Record<string, string> = {
  "Article Draft": "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "Opportunity Notes": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Learning: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  General: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
}

export function NotesEditor({ notes: initialNotes }: { notes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [selectedId, setSelectedId] = useState<number | null>(
    initialNotes[0]?.id ?? null
  )
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("General")
  const [dirty, setDirty] = useState(false)

  const selected = notes.find((n) => n.id === selectedId)

  function selectNote(id: number) {
    if (dirty && selected) {
      saveCurrent(selected.id)
    }
    const note = notes.find((n) => n.id === id)
    if (note) {
      setSelectedId(id)
      setEditTitle(note.title)
      setEditContent(note.content)
      setEditCategory(note.category ?? "General")
      setDirty(false)
    }
  }

  async function saveCurrent(id: number) {
    const formData = new FormData()
    formData.set("title", editTitle)
    formData.set("content", editContent)
    formData.set("category", editCategory)
    const result = await updateNote(id, formData)
    if (result.success) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, title: editTitle, content: editContent, category: editCategory }
            : n
        )
      )
      setDirty(false)
      toast.success("Note saved")
    }
  }

  async function handleCreate(formData: FormData) {
    const result = await createNote(formData)
    if (result.success) {
      toast.success("Note created")
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteNote(id)
    toast.success("Note deleted")
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedId === id) {
      const next = notes.find((n) => n.id !== id)
      if (next) {
        setSelectedId(next.id)
        setEditTitle(next.title)
        setEditContent(next.content)
        setEditCategory(next.category ?? "General")
      } else {
        setSelectedId(null)
        setEditTitle("")
        setEditContent("")
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[480px] rounded-lg border overflow-hidden">
      <div className="w-56 shrink-0 border-r bg-muted/30 flex flex-col">
        <div className="p-2 border-b">
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <Plus className="size-3.5" />
                  New Note
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Note</DialogTitle>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Note title..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" rows={8} placeholder="Write in markdown..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="General">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <DialogClose render={<Button variant="outline">Cancel</Button>} />
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-border/50 transition-colors hover:bg-accent/50 ${
                selectedId === note.id ? "bg-accent" : ""
              }`}
            >
              <p className="text-sm font-medium truncate">{note.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                {note.category && (
                  <Badge
                    className={`text-[10px] px-1 py-0 ${
                      categoryColors[note.category] ?? ""
                    }`}
                  >
                    {note.category}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="flex items-center gap-2 p-3 border-b">
              <Select
                value={editCategory}
                onValueChange={(v) => {
                  if (v) {
                    setEditCategory(v)
                    setDirty(true)
                  }
                }}
              >
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleDelete(selected.id, selected.title)}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
              {dirty && (
                <Button size="xs" onClick={() => saveCurrent(selected.id)}>
                  Save
                </Button>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2 p-4">
              <Input
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value)
                  setDirty(true)
                }}
                className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
                placeholder="Note title..."
              />
              <Textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value)
                  setDirty(true)
                }}
                className="flex-1 min-h-0 resize-none border-0 px-0 focus-visible:ring-0 text-sm leading-relaxed"
                placeholder="Write your note in markdown..."
              />
              <p className="text-[10px] text-muted-foreground text-right">
                Supports Markdown
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-sm text-muted-foreground">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  )
}
