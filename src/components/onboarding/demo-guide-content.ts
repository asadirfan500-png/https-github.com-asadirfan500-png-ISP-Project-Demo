export const DUMMY_DATA_BANNER = {
  title: "Important: this is a demo with fake data",
  body: [
    "All numbers, review history, scores, names (including “Elisah M.”), and check results are made up for demonstration only.",
    "Nothing is connected to Citroën’s real systems, a live database, or real AI.",
    "When you submit a post, the “checks” are simulated — they follow simple rules to show what the real product could feel like.",
  ],
};

export const WHAT_IS_THIS = {
  title: "What is this?",
  paragraphs: [
    "Review Desk is a practice website that shows an idea from 33Seconds, a social media agency. It is not a finished product — it is something you can click through to understand a concept.",
    "The idea is a helpful digital colleague that reads a social post first and flags obvious issues. We call that a Synthetic Team Member, or STM for short. Think of it as a first pair of eyes before a human manager approves the post.",
    "The pretend client in this demo is Citroën, the car brand. The pretend audience is called “Everyday Outsiders” — people who live life their own way.",
    "Use the menu on the left to move between pages. The bar at the top shows where you are. The profile button in the top-right corner (Elisah M.) is also fake — it is just for show.",
  ],
};

export const WHY_EXISTS = {
  title: "Why does it exist?",
  paragraphs: [
    "Social teams write many posts every week — for Instagram, TikTok, LinkedIn, Facebook, and more. Before Citroën ever sees a post, someone at the agency wants to ask three simple questions: Does it sound like Citroën? Will our audience care? Does it fit the platform?",
    "STM would do that first pass automatically. A real person still presses the final “yes.” The tool suggests; humans decide. Nothing goes to the client without a human sign-off.",
  ],
};

export const GLOSSARY = [
  {
    term: "Review",
    meaning: "Checking a social post before sending it to the client",
  },
  {
    term: "Caption",
    meaning: "The words written under or with the post",
  },
  {
    term: "Sign-off",
    meaning: "A person saying “yes, this is ready to show Citroën”",
  },
  {
    term: "Score",
    meaning: "A number out of 100 — higher means the demo thinks the post is stronger",
  },
  {
    term: "Passed / Needs review / Not ready",
    meaning: "Green = looks good; amber = fix a few things; red = major issues",
  },
  {
    term: "Brief",
    meaning: "The client’s rulebook — how Citroën should sound and who they speak to",
  },
  {
    term: "Dashboard",
    meaning: "The home screen with summary numbers and recent activity",
  },
  {
    term: "History",
    meaning: "A list of past checks — all fake, pre-loaded data in this demo",
  },
  {
    term: "STM",
    meaning: "Synthetic Team Member — the pretend “first reviewer” in this demo",
  },
];

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Start here",
    description:
      "You are on the overview page right now. Read through this guide so you know what each part of the demo does. When you are ready, click Go to Dashboard at the top or bottom of this page.",
  },
  {
    step: 2,
    title: "See your workspace",
    description:
      "Open the Dashboard from the left menu. You will see four summary boxes (reviews this week, average score, pending sign-off, active client) and a table of recent reviews. Remember: every number and every row in that table is dummy data — it was written in advance to make the demo look realistic.",
  },
  {
    step: 3,
    title: "Submit a post",
    description:
      "Go to Review in the left menu. Pick a platform (Instagram, TikTok, etc.), type or paste your caption, and optionally upload an image. Not sure what to write? Click Load good sample or Load weak sample to fill in example text. Then click Submit for review.",
  },
  {
    step: 4,
    title: "STM runs three checks",
    description:
      "After you submit, wait a few seconds. You will see three checks run one after another: (1) Is the post the right length and style for the platform? (2) Does the wording match Citroën’s brand voice? (3) Would our pretend audience react well? Each check gets a score out of 100 and short written feedback. These results are simulated — not from real AI.",
  },
  {
    step: 5,
    title: "You decide",
    description:
      "When all three checks finish, a sign-off summary appears. It shows an overall score, a list of priority fixes, and two buttons: Mark ready for client (shows a confirmation message — demo only) or Revise and re-run (lets you edit your post and try again). You are playing the role of the human manager who gives final approval.",
  },
  {
    step: 6,
    title: "Look things up later",
    description:
      "History shows a list of fake past reviews you can filter and expand. Citroën brief holds the brand rulebook — voice, audience, and platform tips. Use these pages as reference while you explore. Nothing you do on the Review page is saved to History — that page always shows the same pre-loaded dummy data.",
  },
];

export type PageGuideSection = {
  heading: string;
  items: string[];
};

export type PageGuide = {
  id: string;
  menuLabel: string;
  route: string;
  whatItIs: string;
  sections: PageGuideSection[];
  whatsFake: string;
};

export const PAGE_GUIDES: PageGuide[] = [
  {
    id: "intro",
    menuLabel: "How it works",
    route: "/",
    whatItIs:
      "This is the page you are reading now. It explains the whole demo in plain English before you click around.",
    sections: [
      {
        heading: "What to do here",
        items: [
          "Read the dummy-data notice at the top so nobody thinks the numbers are real.",
          "Skim the glossary if any words on screen confuse you.",
          "Read the page-by-page section below so you know what each menu item does.",
          "When ready, click Go to Dashboard and start exploring.",
        ],
      },
    ],
    whatsFake: "This page is pure explanation — there is no data here.",
  },
  {
    id: "dashboard",
    menuLabel: "Dashboard",
    route: "/dashboard",
    whatItIs:
      "The home screen. It gives a quick snapshot of review activity for Citroën — like glancing at a team dashboard on a Monday morning.",
    sections: [
      {
        heading: "Four stat boxes at the top",
        items: [
          "Reviews this week — how many posts were checked (fake number: 12).",
          "Average score — the typical score out of 100 (fake number: 78).",
          "Pending sign-off — posts waiting for a human “yes” (fake number: 2).",
          "Active client — shows Citroën and their audience name “Everyday Outsiders.”",
        ],
      },
      {
        heading: "The note below the stats",
        items: [
          "“STM checks run before anything goes to the client. You still sign off.”",
          "This means: the tool checks first, but a real person must still approve before Citroën sees anything.",
        ],
      },
      {
        heading: "Recent reviews table",
        items: [
          "Shows five example past reviews with date, platform, caption preview, score, and status.",
          "Status badges: Passed (green), Needs review (amber), Not ready (red).",
          "Click View all to go to the full History page.",
        ],
      },
      {
        heading: "Buttons to try",
        items: [
          "Start a review — jumps to the Review page.",
          "View client brief — opens Citroën’s brand reference page.",
        ],
      },
    ],
    whatsFake:
      "Every stat, every table row, and every score on this page is dummy data written in advance. Refreshing the page will not change the numbers.",
  },
  {
    id: "review",
    menuLabel: "Review",
    route: "/review",
    whatItIs:
      "The main event. This is where you paste a social post and see the three automated checks in action.",
    sections: [
      {
        heading: "Left side — your post",
        items: [
          "Platform — choose where the post would go (Instagram, TikTok, LinkedIn, Facebook, or X).",
          "Caption — type your post text, or use Load good sample / Load weak sample to see examples that pass or fail.",
          "Image — optional. Drag an image in or click to upload. The demo checks mainly use your words, not the picture.",
          "Submit for review — starts the three checks. Clear — wipes the form and starts over.",
          "How review works — a small panel listing the three check types (visible on larger screens, collapsible on phones).",
        ],
      },
      {
        heading: "Right side — results (empty until you submit)",
        items: [
          "Review progress — a bar showing 0/3, 1/3, 2/3, 3/3 complete as checks finish.",
          "Three result cards — one per check, each with a score, status badge, findings, and suggested edits.",
          "Focus group quotes — pretend reactions from made-up audience members (e.g. “Weekend Wanderer”).",
          "Sign-off summary — appears when all checks finish. Shows overall score, priority actions, Mark ready for client, and Revise and re-run.",
        ],
      },
      {
        heading: "The three checks explained",
        items: [
          "Platform Best Practice — is the caption the right length? Too many hashtags? Right tone for that network?",
          "Brand Tone of Voice — does it sound like Citroën? Does it use words they like and avoid words they hate?",
          "Audience Focus Group — would “Everyday Outsiders” care about this post? Simulated quotes show pretend reactions.",
        ],
      },
      {
        heading: "What to try",
        items: [
          "Load good sample → Submit — see a post that mostly passes.",
          "Load weak sample → Submit — see a post with more warnings and lower scores.",
          "Edit the caption yourself and submit — see how changing words affects scores.",
        ],
      },
    ],
    whatsFake:
      "Check results are simulated using simple rules, not real AI. Mark ready for client only shows a pop-up message — nothing is sent anywhere. Your submissions are not saved to History.",
  },
  {
    id: "history",
    menuLabel: "History",
    route: "/history",
    whatItIs:
      "A log of past creative reviews for Citroën — like looking back at previous weeks’ work.",
    sections: [
      {
        heading: "Filters at the top",
        items: [
          "Platform — show all platforms or filter to one (Instagram, TikTok, etc.).",
          "Status — show all, or only Passed, Needs review, or Not ready.",
        ],
      },
      {
        heading: "The review list",
        items: [
          "Each row shows date, platform, caption preview, score, status, and reviewer name.",
          "Click a row (or tap a card on mobile) to expand and see the full caption plus all three check scores.",
          "On phones, reviews appear as cards instead of a table — same information, easier to read.",
        ],
      },
      {
        heading: "What to try",
        items: [
          "Filter by Instagram only — see how the list narrows.",
          "Expand a row — read the full caption and check breakdown.",
        ],
      },
    ],
    whatsFake:
      "The entire History page is pre-loaded dummy data. Reviews you run on the Review page do not appear here. Reviewer names like “Elisah M.” are placeholders.",
  },
  {
    id: "client",
    menuLabel: "Citroën brief",
    route: "/client",
    whatItIs:
      "Citroën’s reference guide — the rulebook the social team uses when writing posts. STM uses these same rules when checking your caption.",
    sections: [
      {
        heading: "Client card at the top",
        items: [
          "Shows Citroën’s name, target audience (Everyday Outsiders), and tagline.",
          "This is background context — who we are writing for.",
        ],
      },
      {
        heading: "Brand voice tab",
        items: [
          "Voice traits — personality words like bold, human, optimistic.",
          "Use this language — words and phrases Citroën likes.",
          "Avoid this language — corporate jargon and words that do not fit the brand.",
        ],
      },
      {
        heading: "Audience tab",
        items: [
          "Persona cards — pretend people representing Citroën’s audience.",
          "Each card has a name and short description of who they are and what they care about.",
          "When STM runs the “audience check,” it pretends to ask these people what they think.",
        ],
      },
      {
        heading: "Platform guides tab",
        items: [
          "One section per social network (Instagram, TikTok, LinkedIn, etc.).",
          "Shows ideal caption length and practical tips for that platform.",
          "Useful when writing a post — and when understanding why the best-practice check flagged something.",
        ],
      },
    ],
    whatsFake:
      "Brand rules and personas are realistic examples for the demo, not live documents from Citroën’s marketing team.",
  },
  {
    id: "sidebar",
    menuLabel: "Sidebar and profile",
    route: "",
    whatItIs:
      "The menu on the left and the profile button at the top-right — navigation chrome around every page.",
    sections: [
      {
        heading: "Left menu",
        items: [
          "How it works — this guide page.",
          "Dashboard — summary home screen.",
          "Review — submit and check a post.",
          "History — browse fake past reviews.",
          "Citroën brief — brand reference (under the Client section).",
          "On desktop, a button collapses the menu to icons only. On phones, a menu button opens the sidebar as a drawer.",
        ],
      },
      {
        heading: "Active client card (bottom of sidebar)",
        items: [
          "Shows Citroën as the only client in this demo.",
          "In a real tool, you might switch between multiple clients here.",
        ],
      },
      {
        heading: "Profile button (top right)",
        items: [
          "Shows “Elisah M., Head of Social” — a pretend user.",
          "Clicking opens Profile, Settings, and Sign out — none of these do anything real in the demo.",
        ],
      },
    ],
    whatsFake:
      "The user account, menu actions, and single-client setup are all placeholders for demonstration.",
  },
];

export const DEMO_IS_ISNT = {
  title: "What this demo is — and isn’t",
  isItems: [
    "An interactive prototype you can click through safely.",
    "Simulated checks that show what an automated first review could feel like.",
    "A conversation starter for the team — “would this help us day to day?”",
  ],
  isntItems: [
    "Real AI or a connection to Citroën’s live systems.",
    "A tool that saves your work or remembers what you submitted.",
    "A finished product ready for client use.",
  ],
  reminder:
    "All data in this demo is dummy data — numbers, names, history, scores, and feedback are made up.",
};
