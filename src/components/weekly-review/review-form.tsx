"use client"

import { useActionState, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createReview, updateReview } from "@/actions/review"

interface FormState {
  error?: Record<string, string[]>
  success?: boolean
}

const initialState: FormState = {}

function getWeekRange(): { start: string; end: string } {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  }
}

export function ReviewForm() {
  const [open, setOpen] = useState(false)
  const week = getWeekRange()

  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await createReview(formData)
    if (result.success) {
      toast.success("Weekly review saved")
      setOpen(false)
    } else if (result.error) {
      toast.error("Validation failed")
    }
    return result as FormState
  }

  const [, formAction, pending] = useActionState(handleSubmit, initialState, "/weekly-review")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>New Review</Button>} />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Weekly Review</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStart">Week Start</Label>
              <Input id="weekStart" name="weekStart" type="date" defaultValue={week.start} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekEnd">Week End</Label>
              <Input id="weekEnd" name="weekEnd" type="date" defaultValue={week.end} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="learned">What did you learn?</Label>
            <Textarea id="learned" name="learned" rows={2} placeholder="New concepts, tools, techniques..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="built">What did you build?</Label>
            <Textarea id="built" name="built" rows={2} placeholder="Projects, features, systems..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wrote">What did you write?</Label>
            <Textarea id="wrote" name="wrote" rows={2} placeholder="Articles, docs, notes..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contributed">How did you contribute?</Label>
            <Textarea id="contributed" name="contributed" rows={2} placeholder="Open source, community, mentoring..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reflection">Reflection</Label>
            <Textarea id="reflection" name="reflection" rows={3} placeholder="What went well? What to improve?" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ReviewEditForm({
  review,
  open,
  onOpenChange,
}: {
  review: {
    id: number
    weekStart: string
    weekEnd: string
    learned: string | null
    built: string | null
    wrote: string | null
    contributed: string | null
    reflection: string | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await updateReview(review.id, formData)
    if (result.success) {
      toast.success("Review updated")
      onOpenChange(false)
    } else if (result.error) {
      toast.error("Validation failed")
    }
    return result as FormState
  }

  const [, formAction, pending] = useActionState(handleSubmit, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Weekly Review</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStart">Week Start</Label>
              <Input id="weekStart" name="weekStart" type="date" defaultValue={review.weekStart} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekEnd">Week End</Label>
              <Input id="weekEnd" name="weekEnd" type="date" defaultValue={review.weekEnd} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="learned">What did you learn?</Label>
            <Textarea id="learned" name="learned" rows={2} defaultValue={review.learned ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="built">What did you build?</Label>
            <Textarea id="built" name="built" rows={2} defaultValue={review.built ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wrote">What did you write?</Label>
            <Textarea id="wrote" name="wrote" rows={2} defaultValue={review.wrote ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contributed">How did you contribute?</Label>
            <Textarea id="contributed" name="contributed" rows={2} defaultValue={review.contributed ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reflection">Reflection</Label>
            <Textarea id="reflection" name="reflection" rows={3} defaultValue={review.reflection ?? ""} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
