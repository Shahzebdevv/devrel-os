import { prisma } from "@/lib/prisma"
import {
  Briefcase,
  CheckCircle,
  FileText,
  GitPullRequest,
  Users,
  CalendarClock,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  href: string
  gradient: string
  subtitle?: string
}

function MetricCard({ title, value, icon: Icon, href, gradient, subtitle }: MetricCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all hover:ring-foreground/20">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white`}
          >
            <Icon className="size-5" />
          </div>
        </div>
        <ArrowUpRight className="absolute top-3 right-3 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  )
}

interface DeadlineItem {
  id: number
  title: string
  organization: string
  status: string
  daysSinceCreated: string
}

function DeadlineCard({ item }: { item: DeadlineItem }) {
  return (
    <Link
      href="/opportunities"
      className="group flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 transition-colors hover:bg-amber-500/10"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
        <AlertTriangle className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          {item.organization} &middot; {item.status}
        </p>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {item.daysSinceCreated}
      </span>
    </Link>
  )
}

export default async function Dashboard() {
  const [
    totalOpportunities,
    activeApplications,
    articlesPublished,
    contributionsMerged,
    communitiesCount,
    recentOpportunities,
  ] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({
      where: { status: { in: ["Applied", "Active"] } },
    }),
    prisma.article.count({
      where: { status: "Published" },
    }),
    prisma.contribution.count({
      where: { status: { in: ["Submitted", "Merged"] } },
    }),
    prisma.community.count(),
    prisma.opportunity.findMany({
      where: { status: { not: "Completed" } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const deadlineItems = recentOpportunities.map((o) => ({
    id: o.id,
    title: o.title,
    organization: o.organization,
    status: o.status,
    daysSinceCreated: o.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your DevRel command center at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          title="Total Opportunities"
          value={totalOpportunities}
          icon={Briefcase}
          href="/opportunities"
          gradient="from-violet-500 to-purple-600"
        />
        <MetricCard
          title="Active Applications"
          value={activeApplications}
          icon={CheckCircle}
          href="/opportunities"
          gradient="from-emerald-500 to-teal-600"
          subtitle="Applied or Active"
        />
        <MetricCard
          title="Articles Published"
          value={articlesPublished}
          icon={FileText}
          href="/articles"
          gradient="from-blue-500 to-cyan-600"
        />
        <MetricCard
          title="Contributions"
          value={contributionsMerged}
          icon={GitPullRequest}
          href="/open-source"
          gradient="from-orange-500 to-amber-600"
          subtitle="Submitted or Merged"
        />
        <MetricCard
          title="Communities"
          value={communitiesCount}
          icon={Users}
          href="/community"
          gradient="from-rose-500 to-pink-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Opportunities Needing Attention</h2>
            </div>
            <Link
              href="/opportunities"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          {deadlineItems.length > 0 ? (
            <div className="space-y-2">
              {deadlineItems.map((opp) => (
                <DeadlineCard key={opp.id} item={opp} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-foreground/10 py-10 text-center">
              <CheckCircle className="size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground/60">
                All opportunities are completed
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Quick Links</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Weekly Review", href: "/weekly-review", gradient: "from-violet-500/10 to-purple-500/10", text: "text-violet-400" },
              { label: "Goals Tracker", href: "/goals", gradient: "from-emerald-500/10 to-teal-500/10", text: "text-emerald-400" },
              { label: "Notes", href: "/notes", gradient: "from-blue-500/10 to-cyan-500/10", text: "text-blue-400" },
              { label: "Recent Articles", href: "/articles", gradient: "from-orange-500/10 to-amber-500/10", text: "text-orange-400" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg bg-gradient-to-br ${link.gradient} p-3 text-sm font-medium ${link.text} transition-colors hover:brightness-125`}
              >
                <ArrowUpRight className="size-3.5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
