"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  AUDIENCE_PERSONAS,
  BRAND_VOICE,
  CITROEN_CLIENT,
} from "@/lib/data/citroen";
import { citroen } from "@/lib/data/brand";
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
        title="Client brief"
        description="Brand voice, audience, and platform reference for the active client."
      />

      <AnimatedContent distance={24} duration={0.5} className="mb-6">
        <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CITROEN_CLIENT.logoUrl}
                alt=""
                className="size-full object-contain p-1.5"
              />
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
              <div className="space-y-3">
                {citroen.voiceTraits.map((trait) => (
                  <div key={trait.trait}>
                    <p className="text-sm font-medium">{trait.trait}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {trait.means}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold">Brand DNA</h3>
              <ul className="space-y-1.5">
                {citroen.dna.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  Language that fits
                </h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  Directional cues — not a keyword checklist.
                </p>
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
                  {citroen.avoidLanguage.map((phrase) => (
                    <li key={phrase} className="text-sm text-muted-foreground">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">Known source tensions</p>
              <ul className="mt-2 space-y-1.5">
                {citroen.knownTensions.map((t) => (
                  <li key={t.slice(0, 40)}>{t}</li>
                ))}
              </ul>
            </div>
          </AnimatedContent>
        </TabsContent>

        <TabsContent value="audience" className="mt-4">
          <AnimatedContent key="audience" distance={28} duration={0.55}>
            <p className="mb-4 text-sm text-muted-foreground">
              Six Everyday Outsiders personas seeded from TGI index scores — the
              same panel Claude uses in review.
            </p>
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
                    {persona.persona && (
                      <p className="mt-2 text-xs text-muted-foreground/80">
                        Scrolls past when:{" "}
                        {persona.persona.scrollsPastWhenever[0]}
                      </p>
                    )}
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
                    <li
                      key={tip}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
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
