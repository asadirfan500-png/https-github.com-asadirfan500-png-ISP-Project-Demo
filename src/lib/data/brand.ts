/**
 * Citroën brand profile — single source of truth for the Brand Tone check.
 *
 * SOURCES
 *  [TOV]   "Tone of Voice Strategy", 2 slides, authored by 33Seconds for Citroën
 *          social. Received from Elisah van Allen, 17 July 2026.
 *  [CHARTE] Citroën "Fundamentals / Charte graphique", 2022. Visual identity only.
 *  [TEAM]  Inferred by the UEA team from the above. NOT client-approved.
 *          Flag these to Elisah before they harden into rules.
 *
 * The [TEAM] tags matter: if this file ever goes back to 33Seconds, they need to
 * see which lines are theirs and which are ours.
 */

export interface BrandProfile {
  brand: string;
  signature: string;
  dna: string[];
  personality: string[];
  voiceTraits: { trait: string; means: string; source: Source }[];
  audienceStatement: string;
  contentApproach: string[];
  useLanguage: string[];
  avoidLanguage: string[];
  verbalRules: { rule: string; source: Source }[];
  visualRules: string[];
  knownTensions: string[];
  exampleCaptions: ExampleCaption[];
}

type Source = "TOV" | "CHARTE" | "TEAM";

export interface ExampleCaption {
  verdict: "on-brand" | "off-brand";
  caption: string;
  why: string;
  /** false = written by the team as a placeholder. Replace with real posts. */
  clientSupplied: boolean;
}

export const citroen: BrandProfile = {
  brand: "Citroën",

  // [CHARTE]
  signature: "nothing moves us like Citroën",

  // [CHARTE] brand DNA
  dna: [
    "Accessibility — affordable mobility, including electric, for everyone",
    "Audacity — an audacious spirit that dares to build different",
    "Customer wellbeing — one objective: to care for its customers",
  ],

  // [TOV] brand personality, verbatim qualities
  personality: [
    "playfulness",
    "fun",
    "functionality",
    "affordability",
    "safety (above all)",
    "rich heritage, deeply recognisable identity — celebrates the past while embracing the future",
  ],

  voiceTraits: [
    {
      trait: "Approachable",
      means:
        "Every interaction should feel like a friendly conversation with an old friend. No distance, no corporate register.",
      source: "TOV",
    },
    {
      trait: "Upbeat",
      means: "Warmth and enthusiasm. Optimistic framing, never flat or purely informational.",
      source: "TOV",
    },
    {
      trait: "Authentic",
      means: "Real and unforced. Not slang-chasing, not trying to sound younger than it is.",
      source: "TOV",
    },
    {
      trait: "Light-hearted",
      means:
        "A sense of fun injected into everything. Ready to share a laugh or a smile with the audience.",
      source: "TOV",
    },
    {
      trait: "Self-aware",
      means:
        "Takes the role seriously, but not itself. Gentle self-deprecation is on-brand; self-importance is not.",
      source: "TOV",
    },
  ],

  // [TOV] verbatim
  audienceStatement:
    "We speak primarily to families, but our audience is diverse, encompassing all ages and family types — young couples, new parents, and seasoned veterans of family life. Content is tailored to resonate with their experiences, challenges and joys.",

  // [TOV] content approach
  contentApproach: [
    "Informative — genuinely useful, teaches the reader something",
    "Entertaining — earns attention rather than demanding it",
    "Relevant to the audience's actual lives, not to the product cycle",
    "Practical family territory: road trips, ownership, everyday use",
    "Behind-the-scenes glimpses of the models",
    "Provides value while keeping things light-hearted and engaging",
  ],

  /**
   * [TEAM] — derived from the traits above, not supplied by the client.
   * These are directional cues for the model, not a whitelist. Do not let the
   * check reward keyword-stuffing; the tone test is whether it reads like a
   * friend talking, not whether it contains these words.
   */
  useLanguage: [
    "everyday",
    "family",
    "road trip",
    "weekend",
    "journey",
    "your",
    "we",
    "comfort",
    "easy",
    "handy",
    "electric",
    "compact",
    "clever",
    "honest",
  ],

  /**
   * [TEAM] — each entry has a reason rooted in a client-stated value.
   * Prestige and jargon are the two failure modes to catch.
   */
  avoidLanguage: [
    // conflicts with accessibility + affordability [CHARTE, TOV]
    "premium",
    "luxury",
    "exclusive",
    "elite",
    "aspirational lifestyle",
    // conflicts with "friendly conversation with an old friend" [TOV]
    "synergy",
    "leverage",
    "best-in-class",
    "paradigm",
    "utilise",
    "stakeholders",
    "disruptive innovation",
    "solutions",
    "seamlessly",
    "elevate",
    // conflicts with "we don't take ourselves too seriously" [TOV]
    "revolutionary",
    "unrivalled",
    "game-changing",
  ],

  verbalRules: [
    {
      rule: "Write 'Citroën' with the initial capital and the diaeresis, never in full capitals.",
      source: "CHARTE",
    },
    {
      rule: "Lower case is preferred throughout, to reflect accessibility and proximity.",
      source: "CHARTE",
    },
    {
      rule: "Sound like a friend, not a brand. If a line could not be said aloud to someone in a car park, rewrite it.",
      source: "TOV",
    },
    {
      rule: "Humour is welcome and self-deprecation is on-brand; sarcasm at the audience's expense is not.",
      source: "TEAM",
    },
    {
      rule: "Safety, affordability and practicality are claims to make plainly, not to dramatise.",
      source: "TEAM",
    },
    {
      rule: "Heritage may be referenced warmly (2CV, the chevrons) but should connect to the present, not become nostalgia for its own sake.",
      source: "TOV",
    },
  ],

  /**
   * [CHARTE] — hard don'ts, fed to the image half of the Brand Tone check.
   * These are the only rules in this file a model can fail a post against
   * objectively, so they carry disproportionate weight in scoring.
   */
  visualRules: [
    "White predominates in compositions — it is the dominant brand colour.",
    "Infra Red (#DA291C) is used sparingly: graphic elements and secondary titles only.",
    "Never use black backgrounds.",
    "Never use blue backgrounds, and never red on text.",
    "No colours outside the brand chart (#FFFFFF, #7A99AC, #DA291C, #000000, greys #97999B / #B1B3B3 / #D9D9D6, secondary blue #5B7F95).",
    "The logo must not be recoloured, outlined, shadowed, gradient-filled, rotated, distorted, resized disproportionately, or re-spaced.",
    "Respect the logo protection zone — no graphic or typographic element inside it.",
    "No more than two type weights in a single composition.",
    "No justified text, no drop shadows on type, no outlines on type.",
    "Do not overuse capitals.",
    "Simplicity prevails — less is more.",
  ],

  /**
   * Documented conflicts between source materials. Surfaced to the model so it
   * does not penalise content for following one document over another, and
   * surfaced to the user because these tensions are a genuine finding.
   */
  knownTensions: [
    "The ToV describes the audience as 'all ages and family types', while the Citroën media brief targets 'Everyday Outsiders' (core 25–44, 60.5% male, high index on standing out and spontaneity). Content aimed at the narrower segment should not be marked off-brand for being narrow.",
    "The ToV leads on safety, affordability and functionality; the Everyday Outsiders profile leads on non-conformity and self-expression. Reassurance and distinctiveness pull in opposite directions — note it in findings rather than resolving it silently.",
    "These guidelines were written by 33Seconds for social specifically. They are not Citroën's global corporate tone of voice.",
  ],

  exampleCaptions: [
    {
      verdict: "off-brand",
      caption:
        "Citroën leverages best-in-class synergy to deliver a premium mobility solution for the discerning modern consumer.",
      why: "Corporate register, prestige framing and jargon. Fails 'friendly conversation with an old friend' and contradicts affordability and accessibility. Retained as the standing smoke test — if this does not score badly, the rubric is too soft.",
      clientSupplied: false,
    },
    {
      verdict: "off-brand",
      caption: "THE ALL-NEW CITROËN. REVOLUTIONARY. UNRIVALLED. AVAILABLE NOW.",
      why: "Full capitals against an explicit lower-case preference, self-important claims against 'we don't take ourselves too seriously', and no value offered to the reader.",
      clientSupplied: false,
    },
    {
      verdict: "on-brand",
      caption:
        "packing the boot for a weekend away is a competitive sport. here's how much actually fits in the ë-C3 👇",
      why: "PLACEHOLDER, written by the team. Useful and light-hearted, lower case, family-practical, gently self-aware. Replace with a real strong-performing post from Elisah as soon as the labelled set arrives.",
      clientSupplied: false,
    },
  ],
};

/**
 * Formats the profile into a text block for the Brand Tone prompt.
 * Both the evaluator and the client-facing brief page read from here, so the
 * check and what the user is told can never drift apart.
 */
export function buildBrandToneContext(profile: BrandProfile = citroen): string {
  const clientSupplied = profile.exampleCaptions.filter((e) => e.clientSupplied);
  const placeholder = profile.exampleCaptions.filter((e) => !e.clientSupplied);

  return [
    `BRAND: ${profile.brand}`,
    `Signature: ${profile.signature}`,
    ``,
    `BRAND DNA`,
    ...profile.dna.map((d) => `- ${d}`),
    ``,
    `PERSONALITY`,
    ...profile.personality.map((p) => `- ${p}`),
    ``,
    `VOICE TRAITS`,
    ...profile.voiceTraits.map((t) => `- ${t.trait}: ${t.means}`),
    ``,
    `WHO WE SPEAK TO`,
    profile.audienceStatement,
    ``,
    `CONTENT APPROACH`,
    ...profile.contentApproach.map((c) => `- ${c}`),
    ``,
    `LANGUAGE THAT FITS (directional, not a checklist — do not reward keyword stuffing)`,
    profile.useLanguage.join(", "),
    ``,
    `LANGUAGE THAT DOES NOT FIT`,
    profile.avoidLanguage.join(", "),
    ``,
    `VERBAL RULES`,
    ...profile.verbalRules.map((r) => `- ${r.rule}`),
    ``,
    `VISUAL RULES (apply to any supplied image)`,
    ...profile.visualRules.map((v) => `- ${v}`),
    ``,
    `KNOWN TENSIONS IN THE SOURCE MATERIAL`,
    ...profile.knownTensions.map((t) => `- ${t}`),
    ``,
    clientSupplied.length
      ? `LABELLED EXAMPLES FROM THE CLIENT`
      : `LABELLED EXAMPLES (none client-supplied yet — treat the below as weak evidence)`,
    ...[...clientSupplied, ...placeholder].map(
      (e) => `[${e.verdict.toUpperCase()}] "${e.caption}"\n  Why: ${e.why}`,
    ),
  ].join("\n");
}
