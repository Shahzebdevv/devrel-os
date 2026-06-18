import { getArticles } from "@/actions/article"
import { ArticleForm } from "@/components/articles/article-form"
import { ArticlesPageClient } from "@/components/articles/articles-page-client"

export default async function ArticlesPage() {
  const articles = await getArticles()

  const serialized = articles.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your technical articles across DEV, Hashnode, Medium, and HackerNoon.
          </p>
        </div>
        <ArticleForm />
      </div>
      <ArticlesPageClient articles={serialized} />
    </div>
  )
}
