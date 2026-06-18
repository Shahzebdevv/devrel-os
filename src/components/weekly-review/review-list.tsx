"use client"

import { useState } from "react"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { deleteReview } from "@/actions/review"
import { ReviewEditForm } from "./review-form"

interface Review {
  id: number
  weekStart: string
  weekEnd: string
  learned: string | null
  built: string | null
  wrote: string | null
  contributed: string | null
  reflection: string | null
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const [editTarget, setEditTarget] = useState<Review | null>(null)

  async function handleDelete(id: number) {
    if (!confirm("Delete this review?")) return
    await deleteReview(id)
    toast.success("Review deleted")
  }

  function formatDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          No weekly reviews yet. Start your first one!
        </div>
      )}
      {reviews.map((r) => {
        const sections = [
          { label: "Learned", value: r.learned },
          { label: "Built", value: r.built },
          { label: "Wrote", value: r.wrote },
          { label: "Contributed", value: r.contributed },
        ].filter((s) => s.value)

        return (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatDate(r.weekStart)} — {formatDate(r.weekEnd)}
                </span>
              </div>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon-xs" onClick={() => setEditTarget(r)}>
                  <Pencil className="size-3" />
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="size-3 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {sections.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No entries for this week.</p>
              )}
              {sections.map((s) => (
                <div key={s.label}>
                  <Badge variant="outline" className="mb-1 text-xs font-normal">
                    {s.label}
                  </Badge>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{s.value}</p>
                </div>
              ))}
              {r.reflection && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Reflection</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {r.reflection}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {editTarget && (
        <ReviewEditForm
          review={editTarget}
          open={!!editTarget}
          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
        />
      )}
    </div>
  )
}
