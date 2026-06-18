"use client"

import { useMemo, useState } from "react"
import { ExternalLink, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ARTICLE_STATUSES } from "@/lib/validations/article"
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

const platformColors: Record<string, string> = {
  DEV: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
  Hashnode: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Medium: "bg-green-500/15 text-green-600 dark:text-green-400",
  HackerNoon: "bg-red-500/15 text-red-600 dark:text-red-400",
}

const columnColors: Record<string, string> = {
  Idea: "border-t-purple-500",
  Draft: "border-t-blue-500",
  Editing: "border-t-yellow-500",
  Published: "border-t-emerald-500",
}

export function ArticleKanban({ articles }: { articles: Article[] }) {
  const [editTarget, setEditTarget] = useState<Article | null>(null)

  const columns = useMemo(() => {
    return ARTICLE_STATUSES.map((status) => ({
      status,
      articles: articles.filter((a) => a.status === status),
    }))
  }, [articles])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteArticle(id)
    toast.success("Article deleted")
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(({ status, articles }) => (
        <div key={status} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-muted-foreground">{status}</h3>
            <span className="text-xs text-muted-foreground tabular-nums">{articles.length}</span>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="flex flex-col gap-3 pr-2">
              {articles.length === 0 && (
                <div className="rounded-lg border border-dashed py-8 text-center text-xs text-muted-foreground">
                  No articles
                </div>
              )}
              {articles.map((a) => (
                <Card
                  key={a.id}
                  className={`border-t-2 ${columnColors[a.status] ?? ""}`}
                >
                  <CardHeader className="p-3 pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{a.title}</p>
                      <div className="flex shrink-0 gap-0.5">
                        {a.url && (
                          <a href={a.url} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon-xs">
                              <ExternalLink className="size-3" />
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="icon-xs" onClick={() => setEditTarget(a)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDelete(a.id, a.title)}
                        >
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <Badge
                      variant="outline"
                      className={platformColors[a.platform] ?? ""}
                    >
                      {a.platform}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}

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
