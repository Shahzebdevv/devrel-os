export const dynamic = "force-dynamic";

import { getContributions } from "@/actions/contribution"
import { ContributionForm } from "@/components/open-source/contribution-form"
import { ContributionTable } from "@/components/open-source/contribution-table"

export default async function OpenSourcePage() {
  const contributions = await getContributions()

  const serialized = contributions.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Open Source</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your open source contributions across projects.
          </p>
        </div>
        <ContributionForm />
      </div>
      <ContributionTable contributions={serialized} />
    </div>
  )
}
