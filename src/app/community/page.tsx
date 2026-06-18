import { getCommunities } from "@/actions/community"
import { CommunityForm } from "@/components/community/community-form"
import { CommunityGrid } from "@/components/community/community-grid"

export default async function CommunityPage() {
  const communities = await getCommunities()

  const serialized = communities.map((c) => ({
    ...c,
    joinedAt: c.joinedAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your developer community memberships and groups.
          </p>
        </div>
        <CommunityForm />
      </div>
      <CommunityGrid communities={serialized} />
    </div>
  )
}
