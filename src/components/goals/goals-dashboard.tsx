"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Code2,
  X,
  Video,
  Target,
  Users,
  Pencil,
  Trash2,
} from "lucide-react"
import { updateGoalProgress, deleteGoal } from "@/actions/goal"

interface Goal {
  id: number
  title: string
  description: string | null
  icon: string
  isActive: boolean
  progress: number
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Code2,
  X,
  Video,
  Target,
  Users,
}

const gradientMap: Record<string, string> = {
  FileText: "from-violet-500 to-purple-600",
  Code2: "from-blue-500 to-cyan-600",
  X: "from-zinc-700 to-zinc-900",
  Video: "from-red-500 to-rose-600",
  Target: "from-emerald-500 to-teal-600",
  Users: "from-orange-500 to-amber-600",
}

export function GoalsDashboard({ goals }: { goals: Goal[] }) {
  const [editId, setEditId] = useState<number | null>(null)
  const [progressValue, setProgressValue] = useState(0)

  async function handleProgress(id: number) {
    const formData = new FormData()
    formData.set("progress", String(progressValue))
    const result = await updateGoalProgress(id, formData)
    if (result.success) {
      toast.success("Progress updated")
      setEditId(null)
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete goal "${title}"?`)) return
    await deleteGoal(id)
    toast.success("Goal deleted")
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {goals.map((goal) => {
        const Icon = iconMap[goal.icon] ?? Target
        const gradient = gradientMap[goal.icon] ?? "from-zinc-500 to-zinc-600"
        const pct = Math.round(goal.progress)

        return (
          <Card key={goal.id}>
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{goal.title}</p>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      setEditId(goal.id)
                      setProgressValue(goal.progress)
                    }}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(goal.id, goal.title)}
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium tabular-nums">{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {editId === goal.id && (
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={progressValue}
                    onChange={(e) => setProgressValue(Number(e.target.value))}
                    className="h-7 w-20 text-xs"
                  />
                  <Button size="xs" onClick={() => handleProgress(goal.id)}>
                    Save
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setEditId(null)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
