"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  AUDIENCE_PERSONAS,
  BRAND_VOICE,
  CITROEN_CLIENT,
} from "@/lib/data/citroen";
import { PLATFORMS } from "@/lib/data/platforms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import GradientText from "@/components/react-bits/GradientText";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ClientBriefPage() {
  const [activeTab, setActiveTab] = useState("voice");

  return (
    <>
      <PageHeader
        title="Citroën brief"
        description="Brand voice, audience, and platform reference for the social team."
      />

      <AnimatedContent distance={24} duration={0.5} className="mb-6">
        <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
              C
            </div>
            <div>
              <GradientText
                colors={["#EB4D4B", "#ffffff", "#ff8a80"]}
                animationSpeed={6}
                className="text-lg font-semibold"
              >
                {CITROEN_CLIENT.name}
              </GradientText>
              <p className="mt-1 text-sm text-muted-foreground">
                Target audience: {CITROEN_CLIENT.audience}
              </p>
              <p className="mt-1 text-sm italic text-muted-foreground">
                &ldquo;{CITROEN_CLIENT.tagline}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </AnimatedContent>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <TabsList className="bg-card/80">
            <TabsTrigger value="voice">Brand voice</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="platforms">Platform guides</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="voice" className="mt-4 space-y-4">
          <AnimatedContent key="voice" distance={28} duration={0.55}>
            <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold">Voice traits</h3>
              <div className="flex flex-wrap gap-2">
                {BRAND_VOICE.traits.map((trait) => (
                  <span
                    key={trait}
                    className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-sm capitalize"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  Use this language
                </h3>
                <ul className="space-y-1.5">
                  {BRAND_VOICE.preferPhrases.map((phrase) => (
                    <li key={phrase} className="text-sm text-muted-foreground">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <XCircle className="size-4 text-red-400" />
                  Avoid
                </h3>
                <ul className="space-y-1.5">
                  {BRAND_VOICE.avoidPhrases.map((phrase) => (
                    <li key={phrase} className="text-sm text-muted-foreground">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Keep emoji use to {BRAND_VOICE.maxEmojiCount} or fewer per post.
            </p>
          </AnimatedContent>
        </TabsContent>

        <TabsContent value="audience" className="mt-4">
          <AnimatedContent key="audience" distance={28} duration={0.55}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCE_PERSONAS.map((persona) => (
                <SpotlightCard
                  key={persona.id}
                  className="rounded-lg border-border bg-card/90 p-0"
                  spotlightColor="rgba(235, 77, 75, 0.18)"
                >
                  <div className="p-5">
                    <h3 className="text-sm font-semibold">{persona.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {persona.description}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </AnimatedContent>
        </TabsContent>

        <TabsContent value="platforms" className="mt-4 space-y-4">
          <AnimatedContent key="platforms" distance={28} duration={0.55}>
            {PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-semibold">{platform.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    Ideal length: ~{platform.idealCaptionLength} chars
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {platform.tips.map((tip) => (
                    <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-foreground">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </AnimatedContent>
        </TabsContent>
      </Tabs>
    </>
  );
}
