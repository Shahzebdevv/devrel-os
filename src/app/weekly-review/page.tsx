import { getReviews } from "@/actions/review"
import { ReviewForm } from "@/components/weekly-review/review-form"
import { ReviewList } from "@/components/weekly-review/review-list"

export default async function WeeklyReviewPage() {
  const reviews = await getReviews()

  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Weekly Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reflect on what you learned, built, wrote, and contributed each week.
          </p>
        </div>
        <ReviewForm />
      </div>
      <ReviewList reviews={serialized} />
    </div>
  )
}
