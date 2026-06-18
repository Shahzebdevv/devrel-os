"use client"

import { useActionState, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "@/components/ui/dialog"

import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_STATUSES,
} from "@/lib/validations/contribution"
import { createContribution, updateContribution } from "@/actions/contribution"

interface FormState {
  error?: Record<string, string[]>
  success?: boolean
}

const initialState: FormState = {}

export function ContributionForm() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await createContribution(formData)
    if (result.success) {
      toast.success("Contribution created")
      setOpen(false)
    } else if (result.error) {
      toast.error("Validation failed")
    }
    return result as FormState
  }

  const [, formAction, pending] = useActionState(handleSubmit, initialState, "/open-source")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add Contribution</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Contribution</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. Fix typo in docs" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository">Repository</Label>
            <Input id="repository" name="repository" placeholder="e.g. owner/repo" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="Documentation">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRIBUTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Planned">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRIBUTION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">PR URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://github.com/..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ContributionEditForm({
  contribution,
  open,
  onOpenChange,
}: {
  contribution: {
    id: number
    title: string
    repository: string
    type: string
    status: string
    url: string | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await updateContribution(contribution.id, formData)
    if (result.success) {
      toast.success("Contribution updated")
      onOpenChange(false)
    } else if (result.error) {
      toast.error("Validation failed")
    }
    return result as FormState
  }

  const [, formAction, pending] = useActionState(handleSubmit, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contribution</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={contribution.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository">Repository</Label>
            <Input id="repository" name="repository" defaultValue={contribution.repository} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={contribution.type}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRIBUTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={contribution.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRIBUTION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">PR URL</Label>
            <Input id="url" name="url" type="url" defaultValue={contribution.url ?? ""} />
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
