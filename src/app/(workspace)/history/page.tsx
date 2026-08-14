"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { useReviews } from "@/hooks/use-reviews";
import { useConceptChats } from "@/hooks/use-concept-chats";
import {
  formatConceptChatTime,
  groupConceptChatsByDay,
  type ConceptChatHistoryItem,
} from "@/lib/concept-chats-store";
import {
  formatReviewDateShort,
  getPlatformLabel,
} from "@/lib/reviews-store";
import type { CheckStatus, Platform, ReviewHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  History,
  MessageSquareText,
} from "lucide-react";

function ReviewDetail({ review }: { review: ReviewHistoryItem }) {
  const checks = [
    { label: "Best practice", ...review.checks.bestPractice },
    { label: "Brand visual", ...review.checks.brandTone },
    { label: "Audience", ...review.checks.audience },
    { label: "Caption", ...review.checks.caption },
  ];

  return (
    <AnimatedContent distance={24} duration={0.5} immediate>
      <div className="border-t border-border bg-muted/20 px-4 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Full caption
        </p>
        <p className="mb-4 text-sm">{review.caption}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((check) => (
            <div
              key={check.label}
              className="rounded-md border border-border bg-card/80 p-3 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{check.label}</p>
                <StatusBadge status={check.status} />
              </div>
              <p className="text-lg font-semibold">{check.score}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {check.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedContent>
  );
}

function ConceptChatDetail({ chat }: { chat: ConceptChatHistoryItem }) {
  return (
    <AnimatedContent distance={24} duration={0.5} immediate>
      <div className="border-t border-border bg-muted/20 px-4 py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Full conversation
          </p>
          <Link
            href={`/concept?chat=${chat.id}`}
            className="inline-flex h-7 items-center rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted"
          >
            Open in Concept Check
          </Link>
        </div>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto">
          {chat.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[min(100%,36rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card/80 text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedContent>
  );
}

function ReviewMobileCard({
  review,
  isExpanded,
  onToggle,
}: {
  review: ReviewHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        {isExpanded ? (
          <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">
              {getPlatformLabel(review.platform)}
            </p>
            <StatusBadge status={review.status} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatReviewDateShort(review.date)} · Score {review.score}/100
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {review.captionPreview}
          </p>
        </div>
      </button>
      {isExpanded && <ReviewDetail review={review} />}
    </div>
  );
}

function ConceptMobileCard({
  chat,
  isExpanded,
  onToggle,
}: {
  chat: ConceptChatHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        {isExpanded ? (
          <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{chat.titlePreview}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatConceptChatTime(chat.updatedAt)} · {chat.messageCount}{" "}
            messages
          </p>
        </div>
      </button>
      {isExpanded && <ConceptChatDetail chat={chat} />}
    </div>
  );
}

export default function HistoryPage() {
  const { reviews } = useReviews();
  const { chats } = useConceptChats();
  const [tab, setTab] = useState<"reviews" | "concepts">("reviews");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CheckStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (platformFilter !== "all" && review.platform !== platformFilter)
        return false;
      if (statusFilter !== "all" && review.status !== statusFilter) return false;
      return true;
    });
  }, [platformFilter, statusFilter, reviews]);

  const conceptGroups = useMemo(
    () => groupConceptChatsByDay(chats),
    [chats],
  );

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <>
      <PageHeader
        title="History"
        description="Past creative reviews and Concept Check chats. Click a row to see details."
      />

      <div className="mb-4 inline-flex rounded-lg border border-border bg-card/80 p-1">
        <button
          type="button"
          onClick={() => {
            setTab("reviews");
            setExpandedId(null);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "reviews"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Reviews
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("concepts");
            setExpandedId(null);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "concepts"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Concept checks
        </button>
      </div>

      {tab === "reviews" ? (
        <>
          <AnimatedContent distance={20} duration={0.5} immediate className="mb-4">
            <div className="flex flex-wrap gap-3">
              <Select
                value={platformFilter}
                onValueChange={(v) => setPlatformFilter(v as Platform | "all")}
              >
                <SelectTrigger className="w-full min-w-[140px] bg-card/80 sm:w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="x">X</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as CheckStatus | "all")}
              >
                <SelectTrigger className="w-full min-w-[140px] bg-card/80 sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pass">Passed</SelectItem>
                  <SelectItem value="warn">Needs review</SelectItem>
                  <SelectItem value="fail">Not ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AnimatedContent>

          {filtered.length === 0 ? (
            <EmptyState
              icon={History}
              title={reviews.length === 0 ? "No reviews yet" : "No reviews found"}
              description={
                reviews.length === 0
                  ? "Complete a review and it will appear here."
                  : "Try adjusting your filters to see more results."
              }
            />
          ) : (
            <>
              <div className="space-y-3 lg:hidden">
                {filtered.map((review) => (
                  <ReviewMobileCard
                    key={review.id}
                    review={review}
                    isExpanded={expandedId === review.id}
                    onToggle={() => toggleExpanded(review.id)}
                  />
                ))}
              </div>

              <AnimatedContent distance={30} duration={0.6} immediate>
                <div className="hidden rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>Date</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Caption
                        </TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Reviewer
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((review) => {
                        const isExpanded = expandedId === review.id;
                        return (
                          <Fragment key={review.id}>
                            <TableRow
                              className="cursor-pointer hover:bg-muted/30"
                              onClick={() => toggleExpanded(review.id)}
                            >
                              <TableCell>
                                {isExpanded ? (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="size-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-muted-foreground">
                                {formatReviewDateShort(review.date)}
                              </TableCell>
                              <TableCell>
                                {getPlatformLabel(review.platform)}
                              </TableCell>
                              <TableCell className="hidden max-w-xs truncate md:table-cell">
                                {review.captionPreview}
                              </TableCell>
                              <TableCell className="font-medium">
                                {review.score}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={review.status} />
                              </TableCell>
                              <TableCell className="hidden text-muted-foreground sm:table-cell">
                                {review.reviewer}
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="p-0">
                                  <ReviewDetail review={review} />
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </AnimatedContent>
            </>
          )}
        </>
      ) : chats.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No Concept Check chats yet"
          description="Start a Concept Check conversation and it will appear here by date."
        />
      ) : (
        <div className="space-y-6">
          {conceptGroups.map((group) => (
            <section key={group.dayKey}>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                {group.dayLabel}
              </h2>
              <div className="space-y-3 lg:hidden">
                {group.chats.map((chat) => (
                  <ConceptMobileCard
                    key={chat.id}
                    chat={chat}
                    isExpanded={expandedId === chat.id}
                    onToggle={() => toggleExpanded(chat.id)}
                  />
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8" />
                      <TableHead>Time</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Messages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.chats.map((chat) => {
                      const isExpanded = expandedId === chat.id;
                      return (
                        <Fragment key={chat.id}>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/30"
                            onClick={() => toggleExpanded(chat.id)}
                          >
                            <TableCell>
                              {isExpanded ? (
                                <ChevronDown className="size-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="size-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {formatConceptChatTime(chat.updatedAt)}
                            </TableCell>
                            <TableCell className="max-w-md truncate">
                              {chat.titlePreview}
                            </TableCell>
                            <TableCell>{chat.messageCount}</TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow className="hover:bg-transparent">
                              <TableCell colSpan={4} className="p-0">
                                <ConceptChatDetail chat={chat} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
