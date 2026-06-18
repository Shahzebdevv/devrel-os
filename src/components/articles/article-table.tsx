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
import { ARTICLE_PLATFORMS, ARTICLE_STATUSES } from "@/lib/validations/article"
import { deleteArticle } from "@/actions/article"
import { ArticleEditForm } from "./article-form"

interface Article {
  id: number
  title: string
  platform: string
  status: string
  url: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  Idea: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Draft: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Editing: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  Published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

const platformColors: Record<string, string> = {
  DEV: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
  Hashnode: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Medium: "bg-green-500/15 text-green-600 dark:text-green-400",
  HackerNoon: "bg-red-500/15 text-red-600 dark:text-red-400",
}

type SortKey = "title" | "platform" | "status" | "updatedAt"
type SortDir = "asc" | "desc"

export function ArticleTable({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [editTarget, setEditTarget] = useState<Article | null>(null)

  const filtered = useMemo(() => {
    return articles
      .filter((a) => {
        const q = search.toLowerCase()
        if (q && !a.title.toLowerCase().includes(q)) return false
        if (platformFilter !== "all" && a.platform !== platformFilter) return false
        if (statusFilter !== "all" && a.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? ""
        const bVal = b[sortKey] ?? ""
        const cmp = String(aVal).localeCompare(String(bVal))
        return sortDir === "asc" ? cmp : -cmp
      })
  }, [articles, search, platformFilter, statusFilter, sortKey, sortDir])

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
    await deleteArticle(id)
    toast.success("Article deleted")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={platformFilter} onValueChange={(v) => { if (v) setPlatformFilter(v) }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {ARTICLE_PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
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
            {ARTICLE_STATUSES.map((st) => (
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
              <TableHead className="cursor-pointer" onClick={() => toggleSort("platform")}>
                Platform {renderSortIcon("platform")}
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
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>
                  <Badge className={platformColors[a.platform] ?? ""}>{a.platform}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[a.status] ?? ""}>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {a.url && (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon-sm">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditTarget(a)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(a.id, a.title)}
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
        <ArticleEditForm
          article={editTarget}
          open={!!editTarget}
          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
        />
      )}
    </div>
  )
}
