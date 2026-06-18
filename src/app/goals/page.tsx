export const dynamic = "force-dynamic";

import { getGoals } from "@/actions/goal"
import { GoalsDashboard } from "@/components/goals/goals-dashboard"

export default async function GoalsPage() {
  const goals = await getGoals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your weekly and monthly targets.
        </p>
      </div>
      <GoalsDashboard goals={goals} />
    </div>
  )
}
