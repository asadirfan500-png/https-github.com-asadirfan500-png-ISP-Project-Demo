/**
 * Caption training set scraped from real @citroenuk / UGC Instagram posts
 * (top vs lowest performing by total engagements). Used to calibrate brand
 * voice rules and the review simulator — not a neural network.
 */

export type EngagementTier = "high" | "low";

export interface TrainingPost {
  id: string;
  url: string;
  engagements: number;
  tier: EngagementTier;
  source: "ugc" | "brand";
  format: "reel" | "post";
  caption: string;
  notes: string;
}

export const CITROEN_TRAINING_POSTS: TrainingPost[] = [
  {
    id: "high-1",
    url: "https://www.instagram.com/reel/DZ4GXfEMWOW/",
    engagements: 3532,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "AD Just another normal journey with kids in the @citroenUK #C5Aircross #CitroenUK #ManualNotIncluded #parenting",
    notes: "Parenting comedy UGC — humour + kids + model tag",
  },
  {
    id: "high-2",
    url: "https://www.instagram.com/reel/DYkO-LoIbXq/",
    engagements: 2665,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "Becoming a parent changes how you drive from being more speed and safety conscious to learning how to put a car seat in (or deliberately never learning and making your partner do it every time in my case). Having a comfy and reliable car like this C5 Aircross helps you navigate every bump and detour along the way. You'll still be covered in snacks and tormented by nursery rhymes, but life feels better in a Citroen. AD @citroenuk #c5aircross #citroenuk #manualnotincluded",
    notes: "Honest parenting story — snacks, nursery rhymes, comfort",
  },
  {
    id: "high-3",
    url: "https://www.instagram.com/reel/DYeXj5fK2kz/",
    engagements: 2412,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "@citroenuk wanted to know our thoughts and we are now sold on the electric dream ⚡️ 💭 ❤️ #citroenuk #c3aircross #EV #ad",
    notes: "Family EV lifestyle — short, emotional, electric dream",
  },
  {
    id: "high-4",
    url: "https://www.instagram.com/reel/DX_7qb_N-iV/",
    engagements: 2283,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "There's nothing like that fresh car feeling, and this @citroenuk C3 is looking FRESH 😍✨ ad #asmrcleaning #carclean #cleaningmotivation #cardetailing",
    notes: "ASMR cleaning trend + fresh car feeling",
  },
  {
    id: "high-5",
    url: "https://www.instagram.com/reel/DXrFPDWCC_7/",
    engagements: 1103,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "ad 🌼 if your car needs a reset this is your sign 😌🫧 this @citroenuk C3 Aircross was due a clean 😅 do you clean your car yourself or take it to be cleaned? #cleaning #cleaningmotivation #springclean #cleaningtips #carclean",
    notes: "Cleaning UGC with audience question",
  },
  {
    id: "high-6",
    url: "https://www.instagram.com/reel/DY1oYIzsabk/",
    engagements: 1091,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "A little reflection on motherhood, surfing, and finding pieces of yourself again along the way. Spent the weekend parked by the sea in the Citroën Holidays Camper Premium watching the next generation at the Surfing England Rip Curl Grom Search… then somehow ended up surfing more myself than I have in years. I think somewhere between motherhood, injuries and life generally moving very fast, I forgot that I'm a surfer too. Turns out sometimes you don't need a huge adventure to reconnect with yourself a bit. Just a local road trip, a few waves, coffee in a car park and a night sleeping by the ocean. Although I do now passionately need a camper van in my life, so thanks for that @citroenuk 😭 #CitroenHolidays #CitroenUK #AD #PR",
    notes: "Long personal story — motherhood, sea, camper, local adventure",
  },
  {
    id: "high-7",
    url: "https://www.instagram.com/reel/DalAfhHMOI8/",
    engagements: 1084,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "ad | I didn't see this coming... 😂🚐 It started with me trying to solve four of your DIY dilemmas with the Citroën Berlingo Van... and now I don't think I can live without it! 😍 For this project I tackled: picking up bulky building materials, taking rubbish to the recycling centre, delivering things I'd sold, moving furniture. The wild part? I could've done all four of those jobs in a single trip 🤯 It's so roomy without feeling massive to drive, and it's ridiculously comfy too. Whether you're halfway through a renovation, want to pick up some cute vintage furniture, or you're fed up making three trips when one would do, it's one of those things you don't realise you need until you've got it. Thanks to @CitroënUK for partnering with me. #Berlingo #CitroenUK #DIYDilemmas",
    notes: "DIY practical comedy — real jobs, roomy, comfy",
  },
  {
    id: "high-8",
    url: "https://www.instagram.com/reel/DWt5PQcjIVI/",
    engagements: 513,
    tier: "high",
    source: "ugc",
    format: "reel",
    caption:
      "💕 LET'S GO CHARITY SHOPPING (£20.50 SPENT) 💸 Hey lovelies 🫶🏻 Yesterday I had a solo day out doing my favourite things: picking up iced coffee + charity shopping so I thought I'd take you with me 👇🏻🥰 We currently have a @citroenuk C5 Aircross on loan (which is SO nice to drive) & honestly any excuse to take the car out at this point 🤣🙌🏻 *PR loan which items are your favourite?",
    notes: "Day-out lifestyle haul with soft car mention",
  },
  {
    id: "high-9",
    url: "https://www.instagram.com/p/DZkceY5CPo5/",
    engagements: 466,
    tier: "high",
    source: "ugc",
    format: "post",
    caption:
      "Family car POV: nailing meeting the chaotic and conflicting needs of a young family. I mourn my passenger princess days (where I'd be DJ/ asleep rather than a terrified snack butler/ referee) but there's something so satisfying about having my whole family excited to be on the road to an adventure ❤️ AD @citroenuk #c5aircross #citroenuk #manualnotincluded",
    notes: "Family car POV — chaos, adventure, humour",
  },
  {
    id: "high-10",
    url: "https://www.instagram.com/reel/DZwsTNgkQPH/",
    engagements: 436,
    tier: "high",
    source: "brand",
    format: "reel",
    caption:
      '"What does my dad really want for Father\'s Day?" This week, Mike took his dad for a drive and a catch-up to find out 🚗❤️ #CitroenUK #DrivingFAQs #C5Aircross #FathersDay',
    notes: "Brand human story — Father's Day drive (still lifestyle, not motorsport)",
  },
  {
    id: "low-1",
    url: "https://www.instagram.com/p/DWqiAHzlCEs/",
    engagements: 15,
    tier: "low",
    source: "brand",
    format: "post",
    caption:
      "Reliving @CitroenRacing first pole position with @NickCassidy in Madrid. #CitroënUK #FormulaE #SpeedReborn #CitroenRacing",
    notes: "Motorsport recap — niche audience",
  },
  {
    id: "low-2",
    url: "https://www.instagram.com/reel/DadXi70DMSu/",
    engagements: 14,
    tier: "low",
    source: "brand",
    format: "reel",
    caption:
      "Final stop: the podium. 🏆🚄 From P18 on the grid to P2 at the flag, Jean-Éric Vergne delivered a spectacular comeback drive in Shanghai, turning strategy, energy management and pure racecraft into a podium finish. A tactical gamble. A drying track. A last-lap fight. Shanghai Express, you gave us a weekend to remember. Next stop: Tokyo. ⚡️ #CitroenRacing #FormulaE",
    notes: "Formula E race report — racecraft, energy management",
  },
  {
    id: "low-3",
    url: "https://www.instagram.com/p/DXgfz6hjuxd/",
    engagements: 14,
    tier: "low",
    source: "brand",
    format: "post",
    caption:
      "Get off-grid this weekend… You might actually have to talk to each other! Where are you spending yours? #CitroenUK #CitroenHoliday",
    notes: "Short lifestyle line but thin product story / low engagement",
  },
  {
    id: "low-4",
    url: "https://www.instagram.com/reel/DaXZXPmjts_/",
    engagements: 13,
    tier: "low",
    source: "brand",
    format: "reel",
    caption:
      "The Shanghai Express is departing today… 🏎️ The tropics gave us heat. Shanghai promises magic. The ABB FIA Formula E World Championship continues this weekend… 🏁 #SpeedReborn #CitroënRacing",
    notes: "Race weekend teaser — cryptic motorsport",
  },
  {
    id: "low-5",
    url: "https://www.instagram.com/reel/DZrmIT-Effy/",
    engagements: 9,
    tier: "low",
    source: "brand",
    format: "reel",
    caption: "POV: you're swiping and every option is a green flag 💚 #CitroenUK #LCV #Vans #SwipeRight",
    notes: "Vague dating-app metaphor for vans — weak lifestyle link",
  },
  {
    id: "low-6",
    url: "https://www.instagram.com/p/DXwImCbFPU0/",
    engagements: 9,
    tier: "low",
    source: "brand",
    format: "post",
    caption:
      "We left the turbulence behind. A new arc begins on the runway. 🛫 S12E07-E08, Fasten your seatbelts. #CitroënRacing #SpeedReborn",
    notes: "TV-style cryptic motorsport promo",
  },
  {
    id: "low-7",
    url: "https://www.instagram.com/reel/DXt9gyPm8Ep/",
    engagements: 7,
    tier: "low",
    source: "brand",
    format: "reel",
    caption:
      "Madrid was a stall. The crew is back on set. The trajectory has been recalibrated. We are ready to fly. Copy that, Berlin. #CitroënRacing #SpeedReborn",
    notes: "Corporate/racing metaphor — stall, trajectory, recalibrated",
  },
  {
    id: "low-8",
    url: "https://www.instagram.com/reel/DXMASmSAdFz/",
    engagements: 7,
    tier: "low",
    source: "brand",
    format: "reel",
    caption: "Whatever your job, Citroën always has a van for you. #CitroenUK #LCV",
    notes: "Generic brand claim — no story",
  },
  {
    id: "low-9",
    url: "https://www.instagram.com/reel/DZuQwWgCtGc/",
    engagements: 6,
    tier: "low",
    source: "brand",
    format: "reel",
    caption:
      "Previously on Speed Reborn: a gamble that left us in dark waters. New episode. New shores. New light. Sanya, we're ready to shine. 20.06.26 ☀️ #SpeedReborn #CitroënRacing",
    notes: "Serialised racing drama language",
  },
  {
    id: "low-10",
    url: "https://www.instagram.com/reel/DYUSGFxjkmx/",
    engagements: 3,
    tier: "low",
    source: "brand",
    format: "reel",
    caption:
      "One last look back at Berlin. ✈️ Under the lights of Tempelhof, the weekend gave us silver, speed and scars to learn from. A podium on Saturday. Two cars in the duels on Sunday. A team pushing through every lap, every call, every fight. Berlin is behind us. Monaco is waiting. ⚡ #CitroenRacing #SpeedReborn",
    notes: "Race weekend wrap — duels, podium, scars",
  },
];

/** Phrases that repeatedly appear in high-engagement UGC captions */
export const HIGH_ENGAGEMENT_SIGNALS = [
  "family",
  "kids",
  "parent",
  "motherhood",
  "car seat",
  "snacks",
  "nursery",
  "weekend",
  "adventure",
  "road trip",
  "comfy",
  "comfortable",
  "reliable",
  "electric",
  "fresh car",
  "clean",
  "diy",
  "renovation",
  "charity",
  "day out",
  "surfing",
  "ocean",
  "camper",
  "holidays",
  "aircross",
  "berlingo",
  "c5",
  "c3",
  "passenger",
  "partner",
  "dad",
  "father",
  "drive",
  "loan",
];

/** Phrases that dominate low-engagement brand motorsport posts */
export const LOW_ENGAGEMENT_SIGNALS = [
  "formula e",
  "formulae",
  "citroen racing",
  "citroënracing",
  "speed reborn",
  "pole position",
  "podium",
  "racecraft",
  "energy management",
  "grid",
  "duels",
  "trajectory",
  "recalibrated",
  "stall",
  "shanghai express",
  "abb fia",
  "world championship",
  "lap",
  "flag",
  "dark waters",
  "turbulence",
  "runway",
  "swipe right",
  "green flag",
  "lcv",
];

export const TRAINING_INSIGHTS = {
  summary:
    "Across 20 real Instagram posts, high engagement skewed to human UGC stories (parenting, cleaning, DIY, day trips, family EV). Low engagement skewed to Formula E / Speed Reborn motorsport copy and thin generic brand lines.",
  highPatterns: [
    "First-person storytelling and humour",
    "Real-life moments (kids, snacks, DIY trips, charity shops, surfing)",
    "Soft product mention after lifestyle context",
    "Clear AD/PR disclosure on creator posts",
    "Audience questions or invitation to comment",
    "Model names used naturally (C5 Aircross, C3, Berlingo, Holidays Camper)",
  ],
  lowPatterns: [
    "Motorsport jargon and race recaps",
    "Cryptic TV-style metaphors without everyday life",
    "Very short generic claims with no story",
    "Niche Formula E audience framing",
  ],
};
