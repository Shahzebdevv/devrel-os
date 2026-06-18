"use client"

import { useState, useMemo } from "react"
import { ExternalLink, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_STATUSES,
} from "@/lib/validations/contribution"
import { deleteContribution } from "@/actions/contribution"
import { ContributionEditForm } from "./contribution-form"

interface Contribution {
  id: number
  title: string
  repository: string
  type: string
  status: string
  url: string | null
  createdAt: string
  updatedAt: string
}

const typeColors: Record<string, string> = {
  Documentation: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Code: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Translation: "bg-green-500/15 text-green-600 dark:text-green-400",
  Tutorial: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
}

const statusColors: Record<string, string> = {
  Planned: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
  "In Progress": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Submitted: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  Merged: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Closed: "bg-red-500/15 text-red-600 dark:text-red-400",
}

type SortKey = "title" | "repository" | "type" | "status" | "updatedAt"
type SortDir = "asc" | "desc"

export function ContributionTable({
  contributions,
}: {
  contributions: Contribution[]
}) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [editTarget, setEditTarget] = useState<Contribution | null>(null)

  const filtered = useMemo(() => {
    return contributions
      .filter((c) => {
        const q = search.toLowerCase()
        if (q && !c.title.toLowerCase().includes(q) && !c.repository.toLowerCase().includes(q)) {
          return false
        }
        if (typeFilter !== "all" && c.type !== typeFilter) return false
        if (statusFilter !== "all" && c.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? ""
        const bVal = b[sortKey] ?? ""
        const cmp = String(aVal).localeCompare(String(bVal))
        return sortDir === "asc" ? cmp : -cmp
      })
  }, [contributions, search, typeFilter, statusFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function renderSortIcon(column: SortKey) {
    if (sortKey !== column) return null
    return <span className="ml-1">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteContribution(id)
    toast.success("Contribution deleted")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search contributions..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { if (v) setTypeFilter(v) }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CONTRIBUTION_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v) setStatusFilter(v) }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {CONTRIBUTION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
                Title {renderSortIcon("title")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("repository")}>
                Repository {renderSortIcon("repository")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("type")}>
                Type {renderSortIcon("type")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                Status {renderSortIcon("status")}
              </TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No contributions found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="font-mono text-xs">{c.repository}</TableCell>
                <TableCell>
                  <Badge className={typeColors[c.type] ?? ""}>{c.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[c.status] ?? ""}>{c.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon-sm">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditTarget(c)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(c.id, c.title)}
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

      {editTarget && (
        <ContributionEditForm
          contribution={editTarget}
          open={!!editTarget}
          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
        />
      )}
    </div>
  )
}
