import { getOpportunities } from "@/actions/opportunity"
import { OpportunityForm } from "@/components/opportunities/opportunity-form"
import { OpportunityTable } from "@/components/opportunities/opportunity-table"

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()

  const serialized = opportunities.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track job applications, fellowships, and community opportunities.
          </p>
        </div>
        <OpportunityForm />
      </div>
      <OpportunityTable opportunities={serialized} />
    </div>
  )
}
