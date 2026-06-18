import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
})

async function main() {
  // Clean existing data
  await prisma.note.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.article.deleteMany()
  await prisma.contribution.deleteMany()
  await prisma.community.deleteMany()
  await prisma.weeklyReview.deleteMany()
  await prisma.goal.deleteMany()

  // ── Goals ──────────────────────────────────────────────────────────
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: "Publish 1 Article Weekly",
        description: "Write and publish at least one technical article every week across platforms.",
        icon: "FileText",
        isActive: true,
        progress: 0.25,
      },
    }),
    prisma.goal.create({
      data: {
        title: "Make 1 Open Source Contribution Weekly",
        description: "Submit at least one meaningful PR to an open source project each week.",
        icon: "Code2",
        isActive: true,
        progress: 0.5,
      },
    }),
    prisma.goal.create({
      data: {
        title: "Post Daily on X",
        description: "Share developer relations insights, tips, and updates daily.",
        icon: "X",
        isActive: true,
        progress: 0.6,
      },
    }),
    prisma.goal.create({
      data: {
        title: "Publish YouTube Content",
        description: "Create and publish developer-focused video content monthly.",
        icon: "Youtube",
        isActive: false,
        progress: 0.1,
      },
    }),
    prisma.goal.create({
      data: {
        title: "Attend 2 Community Events Monthly",
        description: "Participate in meetups, conferences, or community gatherings.",
        icon: "Users",
        isActive: true,
        progress: 0.4,
      },
    }),
  ])

  // ── Opportunities ──────────────────────────────────────────────────
  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        title: "Hackmamba Sprint Contributor",
        organization: "Hackmamba",
        url: "https://hackmamba.io",
        category: "Open Source",
        status: "Active",
        description:
          "Contributing to documentation and content sprint for Hackmamba's open source initiatives.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "React Hindi Documentation",
        organization: "React Hindi Community",
        url: "https://github.com/react-hindi",
        category: "Open Source",
        status: "Applied",
        description:
          "Translating and maintaining React documentation in Hindi to make it accessible to Hindi-speaking developers.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Developer Relations Engineer",
        organization: "Web3 Foundation",
        url: "https://web3.foundation",
        category: "DevRel",
        status: "Researching",
        description:
          "Full-time DevRel role focused on developer education and community building in the Web3 ecosystem.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Technical Writer — Cloud Native",
        organization: "CNCF",
        url: "https://cncf.io",
        category: "Technical Writing",
        status: "Researching",
        description:
          "Creating technical content and tutorials for cloud-native projects under the CNCF umbrella.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Open Source Fellowship",
        organization: "Major League Hacking (MLH)",
        url: "https://mlh.io",
        category: "Fellowship",
        status: "Researching",
        description:
          "12-week open source fellowship program working on real-world projects with mentors.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "DevRel Intern",
        organization: "Postman",
        url: "https://postman.com",
        category: "Internship",
        status: "Rejected",
        description:
          "Applied for the DevRel internship program focused on API education and community support.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Community Manager — Developer Ecosystem",
        organization: "TBD",
        category: "Community",
        status: "Completed",
        description:
          "Managed and grew the developer community through events, content, and direct engagement.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Technical Content Creator",
        organization: "FreeCodeCamp",
        url: "https://freecodecamp.org",
        category: "Technical Writing",
        status: "Applied",
        description:
          "Publishing long-form technical tutorials on the FreeCodeCamp publication.",
      },
    }),
    prisma.opportunity.create({
      data: {
        title: "Web3 DevRel Advocate",
        organization: "Ethereum Foundation",
        url: "https://ethereum.foundation",
        category: "Web3",
        status: "Researching",
        description:
          "Advocate role focusing on developer onboarding and educational content for Ethereum ecosystem.",
      },
    }),
  ])

  // ── Articles ───────────────────────────────────────────────────────
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "Getting Started with Prisma ORM and Next.js",
        platform: "DEV",
        status: "Published",
        url: "https://dev.to/username/getting-started-prisma-nextjs",
      },
    }),
    prisma.article.create({
      data: {
        title: "How to Land Your First DevRel Role in 2025",
        platform: "Hashnode",
        status: "Editing",
      },
    }),
    prisma.article.create({
      data: {
        title: "Building Accessible Web Components with React",
        platform: "Medium",
        status: "Draft",
      },
    }),
    prisma.article.create({
      data: {
        title: "A Complete Guide to Open Source Contributions",
        platform: "HackerNoon",
        status: "Idea",
      },
    }),
    prisma.article.create({
      data: {
        title: "The Developer Relations Playbook",
        platform: "DEV",
        status: "Draft",
      },
    }),
    prisma.article.create({
      data: {
        title: "Understanding Web3: A Developer's Perspective",
        platform: "Hashnode",
        status: "Published",
        url: "https://hashnode.com/username/web3-developer-perspective",
      },
    }),
    prisma.article.create({
      data: {
        title: "10 Tips for Technical Writing in Open Source",
        platform: "Medium",
        status: "Editing",
      },
    }),
  ])

  // ── Contributions ──────────────────────────────────────────────────
  const contributions = await Promise.all([
    prisma.contribution.create({
      data: {
        title: "Fix typo in React documentation",
        repository: "reactjs/react.dev",
        type: "Documentation",
        status: "Merged",
        url: "https://github.com/reactjs/react.dev/pull/1234",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Add Hindi translation for React tutorial",
        repository: "reactjs/hindi-docs",
        type: "Translation",
        status: "In Progress",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Implement new CLI command for Hackmamba",
        repository: "hackmamba/cli",
        type: "Code",
        status: "Submitted",
        url: "https://github.com/hackmamba/cli/pull/56",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Write beginner's guide to Prisma",
        repository: "prisma/docs",
        type: "Documentation",
        status: "Planned",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Create tutorial: Deploy Next.js on Railway",
        repository: "railway/community",
        type: "Tutorial",
        status: "Merged",
        url: "https://github.com/railway/community/pull/89",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Fix accessibility issues in shadcn/ui",
        repository: "shadcn-ui/ui",
        type: "Code",
        status: "Closed",
        url: "https://github.com/shadcn-ui/ui/pull/234",
      },
    }),
    prisma.contribution.create({
      data: {
        title: "Translate Next.js docs to Hindi",
        repository: "vercel/next.js",
        type: "Translation",
        status: "Planned",
      },
    }),
  ])

  // ── Communities ────────────────────────────────────────────────────
  const communities = await Promise.all([
    prisma.community.create({
      data: {
        name: "GDG On Campus",
        role: "Core Member",
        joinedAt: new Date("2024-08-01"),
      },
    }),
    prisma.community.create({
      data: {
        name: "AWS User Group Kolkata",
        role: "Community Volunteer",
        joinedAt: new Date("2024-06-15"),
      },
    }),
    prisma.community.create({
      data: {
        name: "React Hindi Community",
        role: "Contributor & Translator",
        joinedAt: new Date("2025-01-10"),
      },
    }),
    prisma.community.create({
      data: {
        name: "Hackmamba",
        role: "Open Source Contributor",
        joinedAt: new Date("2025-03-01"),
      },
    }),
    prisma.community.create({
      data: {
        name: "DevRel Collective",
        role: "Member",
        joinedAt: new Date("2024-11-20"),
      },
    }),
    prisma.community.create({
      data: {
        name: "Women Who Code",
        role: "Technical Writer Mentor",
        joinedAt: new Date("2024-09-05"),
      },
    }),
  ])

  // ── Weekly Reviews ─────────────────────────────────────────────────
  const weeklyReviews = await Promise.all([
    prisma.weeklyReview.create({
      data: {
        weekStart: "2025-06-09",
        weekEnd: "2025-06-15",
        learned:
          "Learned about Prisma's relation strategies and SQLite optimization techniques.",
        built: "Built the DevRel OS database layer with full Prisma schema and seed data.",
        wrote: "Wrote a draft article on getting started with Prisma and Next.js.",
        contributed: "Submitted a PR to Hackmamba for the CLI tooling improvements.",
        reflection:
          "Productive week focused on infrastructure. Need to allocate more time for community engagement.",
      },
    }),
    prisma.weeklyReview.create({
      data: {
        weekStart: "2025-06-02",
        weekEnd: "2025-06-08",
        learned: "Deep dive into React Server Components and the App Router pattern.",
        built: "Set up the initial Next.js project with shadcn/ui components.",
        wrote: "Published an article on open source contribution best practices.",
        contributed: "Merged a documentation PR for React Hindi translation.",
        reflection:
          "Good momentum on content creation. Should balance technical writing with open source code contributions.",
      },
    }),
    prisma.weeklyReview.create({
      data: {
        weekStart: "2025-05-26",
        weekEnd: "2025-06-01",
        learned: "Explored Web3 fundamentals and the Ethereum development ecosystem.",
        built: "Created a demo dApp for learning purposes.",
        wrote: "Started drafting a Web3 developer perspective article.",
        contributed: "Fixed accessibility issues in an open source UI component library.",
        reflection:
          "Web3 is fascinating but complex. Need to focus on one area at a time.",
      },
    }),
  ])

  // ── Notes ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.note.create({
      data: {
        title: "Article Outline: Getting Started with Prisma",
        content: `## Introduction
- What is Prisma and why use it?
- Prisma vs traditional ORMs

## Setup
- Install Prisma CLI
- Initialize with SQLite
- Define your first model

## CRUD Operations
- Create records
- Read with filters
- Update and delete

## Relations
- One-to-many
- Many-to-many
- How SQLite handles relations`,
        category: "Article Draft",
        articleId: articles[0].id,
      },
    }),
    prisma.note.create({
      data: {
        title: "DevRel Role Research Notes",
        content: `## Key Skills Required
- Strong technical background (full-stack or specialized)
- Excellent written and verbal communication
- Public speaking and presentation skills
- Community management experience
- Content creation (blogs, videos, tutorials)

## Companies Hiring DevRel
- Web3 Foundation — DevRel Engineer
- CNCF — Technical Writer
- Postman — DevRel Intern

## Application Tips
- Build a portfolio of content
- Contribute to open source
- Network at developer events
- Start a blog or YouTube channel`,
        category: "Opportunity Notes",
        opportunityId: opportunities[2].id,
      },
    }),
    prisma.note.create({
      data: {
        title: "Open Source Contribution Workflow",
        content: `## Finding Projects
1. Look for "good first issue" labels
2. Check project documentation for contribution guides
3. Join project Discord/Slack communities

## Making Contributions
- Always fork the repository first
- Create a feature branch
- Follow the project's coding standards
- Write clear commit messages
- Reference the issue number in PR description

## Best Practices
- Start with documentation fixes
- Review existing PRs to understand patterns
- Be responsive to reviewer feedback
- Don't be discouraged by rejected PRs`,
        category: "Learning",
        contributionId: contributions[0].id,
      },
    }),
    prisma.note.create({
      data: {
        title: "GDG On Campus — Event Ideas",
        content: `## Upcoming Events
1. **Cloud Computing Workshop** — AWS EC2, Lambda basics (co-host with AWS UG)
2. **Open Source Hackathon** — Weekend-long contribution sprint
3. **Tech Talk Series** — Invite speakers from industry

## Notes
- Coordinate with AWS UG Kolkata for joint events
- Reach out to Hackmamba for potential collaboration
- Book venue at least 2 weeks in advance`,
        category: "General",
        communityId: communities[0].id,
      },
    }),
    prisma.note.create({
      data: {
        title: "React Hindi Docs — Translation Progress",
        content: `## Completed
- Introduction to React (pages 1-50)
- Installation guide
- Getting Started tutorial

## In Progress
- Core Concepts (pages 51-100)
- Hooks documentation

## Pending
- Advanced Patterns
- API Reference
- Contributing guide

## Challenges
- Technical terminology often lacks standard Hindi equivalents
- Need reviewer for quality assurance`,
        category: "Opportunity Notes",
        opportunityId: opportunities[1].id,
      },
    }),
  ])

  console.log("Seed data inserted successfully!")
  console.log(`  Goals: ${goals.length}`)
  console.log(`  Opportunities: ${opportunities.length}`)
  console.log(`  Articles: ${articles.length}`)
  console.log(`  Contributions: ${contributions.length}`)
  console.log(`  Communities: ${communities.length}`)
  console.log(`  Weekly Reviews: ${weeklyReviews.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
