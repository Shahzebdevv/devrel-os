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
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_STATUSES,
} from "@/lib/validations/opportunity"
import { deleteOpportunity } from "@/actions/opportunity"
import { OpportunityEditForm } from "./opportunity-form"

interface Opportunity {
  id: number
  title: string
  organization: string
  url: string | null
  category: string
  status: string
  description: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  Researching: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Applied: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
  Completed: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
}

type SortKey = "title" | "organization" | "category" | "status" | "updatedAt"
type SortDir = "asc" | "desc"

export function OpportunityTable({
  opportunities,
}: {
  opportunities: Opportunity[]
}) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null)

  const filtered = useMemo(() => {
    return opportunities
      .filter((o) => {
        const q = search.toLowerCase()
        if (q && !o.title.toLowerCase().includes(q) && !o.organization.toLowerCase().includes(q)) {
          return false
        }
        if (categoryFilter !== "all" && o.category !== categoryFilter) return false
        if (statusFilter !== "all" && o.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? ""
        const bVal = b[sortKey] ?? ""
        const cmp = String(aVal).localeCompare(String(bVal))
        return sortDir === "asc" ? cmp : -cmp
      })
  }, [opportunities, search, categoryFilter, statusFilter, sortKey, sortDir])

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
    await deleteOpportunity(id)
    toast.success("Opportunity deleted")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { if (v) setCategoryFilter(v) }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {OPPORTUNITY_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
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
            {OPPORTUNITY_STATUSES.map((st) => (
              <SelectItem key={st} value={st}>
                {st}
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
              <TableHead className="cursor-pointer" onClick={() => toggleSort("organization")}>
                Organization {renderSortIcon("organization")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("category")}>
                Category {renderSortIcon("category")}
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
                  No opportunities found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.title}</TableCell>
                <TableCell>{o.organization}</TableCell>
                <TableCell>
                  <Badge variant="outline">{o.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[o.status] ?? ""}>{o.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {o.url && (
                      <a href={o.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon-sm">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditTarget(o)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(o.id, o.title)}
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
        <OpportunityEditForm
          opportunity={editTarget}
          open={!!editTarget}
          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
        />
      )}
    </div>
  )
}
