"use client"

import { useState, useMemo } from "react"
import { Pencil, Trash2, Users, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteCommunity } from "@/actions/community"
import { CommunityEditForm } from "./community-form"

interface Community {
  id: number
  name: string
  role: string | null
  joinedAt: string | null
  createdAt: string
  updatedAt: string
}

export function CommunityGrid({
  communities,
}: {
  communities: Community[]
}) {
  const [search, setSearch] = useState("")
  const [editTarget, setEditTarget] = useState<Community | null>(null)
  const [view, setView] = useState<"grid" | "table">("grid")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return communities
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.role && c.role.toLowerCase().includes(q))
    )
  }, [communities, search])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Remove "${name}"?`)) return
    await deleteCommunity(id)
    toast.success("Community removed")
  }

  function formatDate(iso: string | null) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center rounded-lg border p-0.5">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="h-7 px-2.5"
          >
            Grid
          </Button>
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className="h-7 px-2.5"
          >
            Table
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-16 text-sm text-muted-foreground">
              No communities found.
            </div>
          )}
          {filtered.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{c.name}</p>
                    {c.role && (
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon-xs" onClick={() => setEditTarget(c)}>
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(c.id, c.name)}
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    Joined {formatDate(c.joinedAt)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No communities found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.role ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(c.joinedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setEditTarget(c)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(c.id, c.name)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editTarget && (
        <CommunityEditForm
          community={editTarget}
          open={!!editTarget}
          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
        />
      )}
    </div>
  )
}
