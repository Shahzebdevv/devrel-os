export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="size-11 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
