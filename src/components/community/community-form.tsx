"use client"

import { useActionState, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createCommunity, updateCommunity } from "@/actions/community"

interface FormState {
  error?: Record<string, string[]>
  success?: boolean
}

const initialState: FormState = {}

export function CommunityForm() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await createCommunity(formData)
    if (result.success) {
      toast.success("Community added")
      setOpen(false)
    } else if (result.error) {
      toast.error("Validation failed")
    }
    return result as FormState
  }

  const [, formAction, pending] = useActionState(handleSubmit, initialState, "/community")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add Community</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Community</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input id="name" name="name" placeholder="e.g. GDG On Campus" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <Input id="role" name="role" placeholder="e.g. Core Member" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinedAt">Joined Date</Label>
            <Input id="joinedAt" name="joinedAt" type="date" />
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

export function CommunityEditForm({
  community,
  open,
  onOpenChange,
}: {
  community: {
    id: number
    name: string
    role: string | null
    joinedAt: string | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleSubmit = async (_prev: FormState, formData: FormData) => {
    const result = await updateCommunity(community.id, formData)
    if (result.success) {
      toast.success("Community updated")
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
          <DialogTitle>Edit Community</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input id="name" name="name" defaultValue={community.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <Input id="role" name="role" defaultValue={community.role ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinedAt">Joined Date</Label>
            <Input
              id="joinedAt"
              name="joinedAt"
              type="date"
              defaultValue={community.joinedAt ? community.joinedAt.split("T")[0] : ""}
            />
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
