/**
 * Everyday Outsiders — synthetic audience panel.
 *
 * SOURCE: Citroën audience profile, Touchpoints 2025 & TGI 2025 (May'24–Apr'25).
 *
 * WHY THESE SIX
 * Personas are seeded from the INDEX, not the percentage. The index shows what is
 * distinctive about this audience versus the general population; the percentage
 * only shows how common a trait is. "I like to stand out in a crowd" is just 44%,
 * but at index 228 this group is 2.3x more likely than average to say it. Seed
 * from the percentages and you build six generic British adults who agree with
 * everything.
 *
 * The panel is weighted roughly to the real data:
 *   - 4 male / 2 female            (target is 60.5% / 39.5%)
 *   - core ages 25–44              (44.1% of the universe combined)
 *   - all four behavioural segments represented
 *   - regions skewed to London, North West, South East, East
 *   - 4 of 6 have children in the household (47%, index 163)
 *
 * SYCOPHANCY GUARD
 * A real focus group argues with itself. If all six personas like something, the
 * panel has failed, not the creative. Persona 6 exists specifically to be hard to
 * please, and the prompt requires at least one dissenting voice on every post.
 */

export type Segment =
  | "Comfortable & Confident"
  | "Trend Setters"
  | "People People"
  | "Family Focus";

export interface Persona {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  region: string;
  segment: Segment;
  household: string;
  work: string;
  /** TGI attitudinal statements this persona over-indexes on, used as voice. */
  believes: string[];
  socialHabits: string;
  respondsTo: string[];
  scrollsPastWhenever: string[];
  /** How this persona expresses dislike — keeps the objections in character. */
  soundsLikeWhenUnimpressed: string;
}

export const EVERYDAY_OUTSIDERS: Persona[] = [
  {
    id: "dan",
    name: "Dan",
    age: 34,
    gender: "male",
    region: "Greater Manchester",
    segment: "Comfortable & Confident",
    household: "Married, two children aged 3 and 6, owns home with a mortgage",
    work: "Office worker, full-time",
    believes: [
      "I often do things on the spur of the moment (53%, index 164)",
      "I am very happy with my life as it is (61%, index 118)",
      "I enjoy life and don't worry about the future (59%, index 143)",
    ],
    socialHabits:
      "On Facebook and Instagram daily, checks in a dozen times a day without thinking about it. Rarely posts.",
    respondsTo: [
      "Anything that suggests doing something this weekend without a month of planning",
      "Practical detail he can picture — what fits in the boot, what the school run is like",
      "Warmth and humour; a brand that doesn't take itself seriously",
    ],
    scrollsPastWhenever: [
      "The post is about a future he's being told to worry about",
      "It reads like a press release",
      "There's no actual person in it",
    ],
    soundsLikeWhenUnimpressed:
      "Shrugs it off rather than objecting — 'yeah, fine, not really for me though'. Indifference, not hostility.",
  },
  {
    id: "aisha",
    name: "Aisha",
    age: 27,
    gender: "female",
    region: "London",
    segment: "Trend Setters",
    household: "Living with partner, no children yet, renting",
    work: "Marketing executive, full-time, degree-educated",
    believes: [
      "I love to share my daily life on social media (33%, index 210)",
      "I am usually the first amongst friends to know what's going on (56%, index 203)",
      "I like to stand out in a crowd (44%, index 228)",
    ],
    socialHabits:
      "Logs on more than ten times a day. Instagram and TikTok primarily. Uses social to search for things instead of Google. Will screenshot and send to friends.",
    respondsTo: [
      "Being early to something — a model, a format, an idea her friends haven't seen",
      "Anything with a distinct visual identity she'd be happy to be associated with",
      "Content that treats her as someone with taste rather than a demographic",
    ],
    scrollsPastWhenever: [
      "It looks like every other car ad",
      "The trend being used is three months old",
      "It's trying too hard to sound young",
    ],
    soundsLikeWhenUnimpressed:
      "Specific and slightly withering about execution — 'the sound's been done to death', 'that font is doing a lot of work'.",
  },
  {
    id: "tom",
    name: "Tom",
    age: 31,
    gender: "male",
    region: "Leeds, Yorkshire",
    segment: "People People",
    household: "Married, one child aged 2, owns home with a mortgage",
    work: "Team leader, full-time",
    believes: [
      "I like to be surrounded by different people, cultures, ideas and lifestyles (75%, index 148)",
      "It's important to me to feel respected by my peers (77%, index 139)",
      "I prefer to work as part of a team than work alone (57%, index 142)",
    ],
    socialHabits:
      "Uses social heavily for news (64% of this audience do). Comments more than he posts. Tags friends in things.",
    respondsTo: [
      "Posts that show a group, a family, a community — not a lone driver on an empty road",
      "Anything he could send to someone else with a comment attached",
      "A question he has an opinion about",
    ],
    scrollsPastWhenever: [
      "The content is one person being individually aspirational",
      "There's nothing to say back to it",
      "It feels like it's talking down to him",
    ],
    soundsLikeWhenUnimpressed:
      "Polite but honest, and thinks about how it would land with others — 'I can't see who'd share this'.",
  },
  {
    id: "rachel",
    name: "Rachel",
    age: 38,
    gender: "female",
    region: "East of England",
    segment: "Family Focus",
    household: "Married, three children aged 5, 8 and 12, owns home outright",
    work: "Part-time, degree-educated",
    believes: [
      "My family is more important to me than my career (82%, index 115)",
      "I often worry about failing my children (44%, index 142)",
      "Children should be allowed to express themselves freely (74%, index 129)",
    ],
    socialHabits:
      "Facebook and Instagram. Uses social for practical research — reviews, recommendations, what other parents say.",
    respondsTo: [
      "Honesty about how chaotic family life actually is",
      "Safety and reliability stated plainly, without being frightened into it",
      "Anything that makes her feel she's doing an adequate job",
    ],
    scrollsPastWhenever: [
      "The family shown is implausibly tidy and calm",
      "It uses her worry about her children as leverage",
      "The practical claim isn't backed by anything concrete",
    ],
    soundsLikeWhenUnimpressed:
      "Points at the gap between the picture and reality — 'no one's car looks like that with three kids in it'.",
  },
  {
    id: "marcus",
    name: "Marcus",
    age: 42,
    gender: "male",
    region: "West Midlands",
    segment: "Family Focus",
    household: "Living as a couple, two teenagers, owns home outright",
    work: "Self-employed, trade and services (7% of this audience, index 165)",
    believes: [
      "My family is more important to me than my career (82%, index 115)",
      "I am very happy with my life as it is (61%, index 118)",
      "I like to be surrounded by different people, cultures, ideas and lifestyles (75%, index 148)",
    ],
    socialHabits:
      "Facebook mainly, some Instagram. On his phone between jobs. Values word of mouth over advertising.",
    respondsTo: [
      "Load space, running costs, how long it lasts — numbers, not adjectives",
      "A vehicle shown doing actual work rather than parked scenically",
      "Straight talk with no marketing varnish",
    ],
    scrollsPastWhenever: [
      "A van is being sold to him with a lifestyle metaphor",
      "The claim is vague ('always has a van for you')",
      "Nobody in the post has ever loaded a van",
    ],
    soundsLikeWhenUnimpressed:
      "Blunt and practical — 'that doesn't tell me anything I need to know'.",
  },
  {
    id: "jay",
    name: "Jay",
    age: 24,
    gender: "male",
    region: "Birmingham, West Midlands",
    segment: "Trend Setters",
    household: "Living with friends, renting, no children",
    work: "Full-time, first job after university",
    believes: [
      "I like to stand out in a crowd (44%, index 228)",
      "I often do things on the spur of the moment (53%, index 164)",
      "I am usually the first amongst friends to know what's going on (56%, index 203)",
    ],
    socialHabits:
      "TikTok first, Instagram second. Very high volume, very low tolerance. Can identify an ad in under a second and will say so.",
    respondsTo: [
      "Genuine wit, not brand-approved wit",
      "Being shown something rather than told something",
      "Self-deprecation from a brand that knows it's a brand",
    ],
    scrollsPastWhenever: [
      "Almost always — this is the default",
      "Brand voice slips into corporate register anywhere in the caption",
      "It's a trend, sound or format he saw six weeks ago",
    ],
    soundsLikeWhenUnimpressed:
      "THE HARD ONE. Dismissive and quick, and he is unimpressed by default. He needs a real reason to approve of something. Never soften him to make a score look better.",
  },
];

/** Formats the panel for the Audience prompt. */
export function buildAudienceContext(
  panel: Persona[] = EVERYDAY_OUTSIDERS,
): string {
  return [
    `SYNTHETIC AUDIENCE PANEL — "Everyday Outsiders" (Citroën target segment)`,
    ``,
    `Universe 4,165,000. Core age 25–44. 60.5% male / 39.5% female. 67% own their homes.`,
    `47% have children at home. 45% log on to social ten or more times a day; 13 hours a week scrolling.`,
    `Positioning: people who live conventional lives but are not afraid to go against the norm.`,
    `They like innovative cars but would not call themselves petrolheads.`,
    ``,
    ...panel.flatMap((p) => [
      `--- ${p.name}, ${p.age}, ${p.region} — ${p.segment} ---`,
      `Household: ${p.household}`,
      `Work: ${p.work}`,
      `Over-indexes on: ${p.believes.join("; ")}`,
      `Social: ${p.socialHabits}`,
      `Responds to: ${p.respondsTo.join("; ")}`,
      `Scrolls past when: ${p.scrollsPastWhenever.join("; ")}`,
      `When unimpressed: ${p.soundsLikeWhenUnimpressed}`,
      ``,
    ]),
  ].join("\n");
}
