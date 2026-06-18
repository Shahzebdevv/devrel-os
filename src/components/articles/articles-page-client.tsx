"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleTable } from "@/components/articles/article-table"
import { ArticleKanban } from "@/components/articles/article-kanban"

interface Article {
  id: number
  title: string
  platform: string
  status: string
  url: string | null
  createdAt: string
  updatedAt: string
}

export function ArticlesPageClient({ articles }: { articles: Article[] }) {
  return (
    <Tabs defaultValue="table">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
      </TabsList>
      <TabsContent value="table" className="mt-4">
        <ArticleTable articles={articles} />
      </TabsContent>
      <TabsContent value="kanban" className="mt-4">
        <ArticleKanban articles={articles} />
      </TabsContent>
    </Tabs>
  )
}
