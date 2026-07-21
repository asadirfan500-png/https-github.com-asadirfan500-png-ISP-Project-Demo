"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import CountUp from "@/components/react-bits/CountUp";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import StarBorder from "@/components/react-bits/StarBorder";
import {
  DASHBOARD_STATS,
  formatReviewDate,
  getPlatformLabel,
  MOCK_REVIEWS,
} from "@/lib/data/mock-reviews";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, ClipboardList, Clock } from "lucide-react";

export default function DashboardPage() {
  const recentReviews = MOCK_REVIEWS.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your creative review workspace."
        actions={
          <StarBorder as={Link} href="/review" color="#EB4D4B" speed="5s" className="rounded-lg">
            <span className="flex items-center gap-1.5 px-1 py-0.5 text-sm font-medium">
              <ClipboardList className="size-4" />
              Start a review
            </span>
          </StarBorder>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard
          className="rounded-lg border-border bg-card/80 p-0"
          spotlightColor="rgba(235, 77, 75, 0.18)"
        >
          <StatCard
            label="Reviews this week"
            value={<CountUp to={DASHBOARD_STATS.reviewsThisWeek} duration={1.5} className="text-2xl font-semibold tracking-tight" />}
            hint="Across all platforms"
          />
        </SpotlightCard>
        <SpotlightCard
          className="rounded-lg border-border bg-card/80 p-0"
          spotlightColor="rgba(235, 77, 75, 0.18)"
        >
          <StatCard
            label="Average score"
            value={<CountUp to={DASHBOARD_STATS.avgScore} duration={1.8} className="text-2xl font-semibold tracking-tight" />}
            hint="Out of 100"
          />
        </SpotlightCard>
        <SpotlightCard
          className="rounded-lg border-border bg-card/80 p-0"
          spotlightColor="rgba(235, 77, 75, 0.18)"
        >
          <StatCard
            label="Pending sign-off"
            value={<CountUp to={DASHBOARD_STATS.pendingSignOff} duration={1.2} className="text-2xl font-semibold tracking-tight" />}
            hint="Awaiting your approval"
            icon={Clock}
          />
        </SpotlightCard>
        <SpotlightCard
          className="rounded-lg border-border bg-card/80 p-0"
          spotlightColor="rgba(235, 77, 75, 0.18)"
        >
          <StatCard
            label="Active client"
            value={DASHBOARD_STATS.client}
            hint="Everyday Outsiders"
          />
        </SpotlightCard>
      </div>

      <AnimatedContent distance={30} duration={0.6} className="mb-6">
        <div className="rounded-lg border border-border bg-card/70 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            STM checks run before anything goes to the client.{" "}
            <span className="font-medium text-foreground">You still sign off.</span>
          </p>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={40} duration={0.7} delay={0.1}>
        <div className="rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recent reviews</h2>
            <Link href="/history" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border md:hidden">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{getPlatformLabel(review.platform)}</p>
                    <StatusBadge status={review.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatReviewDate(review.date)} · Score {review.score}/100
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="hidden md:table-cell">Caption</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatReviewDate(review.date)}
                    </TableCell>
                    <TableCell>{getPlatformLabel(review.platform)}</TableCell>
                    <TableCell className="hidden max-w-xs truncate md:table-cell">
                      {review.captionPreview}
                    </TableCell>
                    <TableCell className="font-medium">{review.score}</TableCell>
                    <TableCell>
                      <StatusBadge status={review.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AnimatedContent>

      <div className="mt-4">
        <Link href="/client" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <BookOpen className="size-4" />
          View client brief
        </Link>
      </div>
    </>
  );
}
