import type { BlogPost, PostPreview } from "@/lib/types";

let keyIndex = 0;

function createKey() {
  keyIndex += 1;
  return `mock-${keyIndex}`;
}

function span(text: string, marks: string[] = []) {
  return {
    _key: createKey(),
    _type: "span",
    marks,
    text,
  };
}

function paragraph(text: string) {
  return {
    _key: createKey(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [span(text)],
  };
}

function heading(text: string, style: "h2" | "h3") {
  return {
    _key: createKey(),
    _type: "block",
    style,
    markDefs: [],
    children: [span(text)],
  };
}

function postImage(
  assetUrl: string,
  alt: string,
  caption: string,
  options?: {
    layout?: "normal" | "wide" | "full";
    imageWidth?: number;
    imageHeight?: number;
  },
) {
  return {
    _key: createKey(),
    _type: "postImage",
    assetUrl,
    alt,
    caption,
    ...(options?.layout ? { layout: options.layout } : {}),
    ...(options?.imageWidth != null && options?.imageHeight != null
      ? { imageWidth: options.imageWidth, imageHeight: options.imageHeight }
      : {}),
  };
}

const mockPostsInternal: BlogPost[] = [
  {
    _id: "duolingo-onboarding-analysis",
    title: "Duolingo Has 39 Onboarding Screens. Most People Complete Every Single One.",
    slug: { current: "duolingo-onboarding-analysis" },
    publishedAt: "2026-04-26T09:00:00.000Z",
    excerpt:
      "Downloaded Duolingo last month just to study their onboarding. Not to learn Spanish. Not to streak. To reverse-engineer why 500 million people sit through 39 screens and call it fun.",
    readTime: 8,
    category: "Product Analysis",
    coverImage: "/duolingo-1.png",
    coverImageAlt: "Duolingo onboarding screen analysis",
    body: [
      paragraph(
        "Downloaded Duolingo last month just to study their onboarding. Not to learn Spanish. Not to streak. To reverse-engineer why 500 million people sit through 39 screens and call it fun. Here is what I found.",
      ),
      heading("The Framework Nobody Talks About", "h2"),
      paragraph(
        "Every great onboarding flow follows the same 4-step architecture. Sign in, Set up, Aha moment, Make it a habit. Most SaaS founders build a 2-step flow. Sign in. Here is your empty dashboard. Good luck. Duolingo builds all 4. Every single time. That is not an accident. That is a deliberate psychology machine.",
      ),
      heading("Step 1: Sign In", "h2"),
      paragraph(
        "The Commitment With No Commitment. Here is what Duolingo does in the first 10 seconds. They do not ask you to create an account. They do not show you a pricing page. They do not ask for your email. They ask you one question: What language do you want to learn? That is it. You answered. You are inside.",
      ),
      paragraph(
        "This is called the foot-in-the-door technique. One tiny yes. No friction. No email. No credit card. Just one answer that makes you feel like you have already started. By the time Duolingo asks for your account details, 7 screens later, you have already built a custom learning path, told them your daily goal, and practiced your first 3 words. Asking for an account at that point feels completely reasonable. Because you have too much to lose to leave now.",
      ),
      postImage("/duolingo-1.png", "Duolingo onboarding screen showing language selection", "Step 1: Sign in with no commitment", {
        layout: "normal",
        imageWidth: 299,
        imageHeight: 483,
      }),
      heading("Step 2: Set Up", "h2"),
      paragraph(
        "The Longest Part Nobody Wants to Skip. Duolingo asks 9 questions during setup. What is your goal? How good is your Spanish already? How many minutes a day do you want to practice? Why are you learning this? What is your schedule like? That sounds exhausting. It is not.",
      ),
      paragraph(
        "Each screen takes 8 seconds. Each screen makes you feel seen. This is called progressive personalization. You are not filling a form. You are building a version of the app that belongs to you. Every answer makes the experience feel more tailored. More yours. And here is the psychology nobody explains: Every minute you spend personalizing something is a sunk cost. Walk away from a product you spent 4 minutes customizing? Almost no one does. Duolingo's setup is not onboarding. It is investment. And investment creates retention before the product has delivered a single lesson.",
      ),
      postImage(
        "/duolingo-2.png",
        "Duolingo setup screens showing personalization questions",
        "Step 2: Progressive personalization during setup",
      ),
      heading("Step 3: The Aha Moment", "h2"),
      paragraph(
        "The Screen That Sells the Subscription. Most apps show you their value. Duolingo makes you experience it. Before the end of onboarding, you complete your first lesson. A real lesson. Not a demo. Not a walkthrough. You translate a sentence. The app lights up. Confetti explodes. A green owl celebrates like you just won the World Cup. You learned something. In 2 minutes. In an app you downloaded 4 minutes ago. That is the aha moment.",
      ),
      paragraph(
        "Not a feature tour. Not a tutorial video. Not a welcome email. The moment you feel: I can actually do this. For any SaaS product: the aha moment must happen inside the onboarding. Not in week 2. Not after the user figures it out alone. Inside the onboarding. Before you ever ask for money. Duolingo shows you the paywall after the first lesson. Not before. By then, you already feel the progress. You are not deciding whether to try Duolingo. You are deciding whether 7 dollars a month is worth removing the ads from something you already love. That is a completely different conversation.",
      ),
      postImage(
        "/duolingo-3.jpg",
        "Duolingo lesson completion screen with confetti",
        "Step 3: The Aha moment after first lesson",
      ),
      heading("Step 4: Make It a Habit", "h2"),
      paragraph(
        "The Streak That Turned Into a Business Model. Duolingo's streak mechanic is one of the most studied retention tools in consumer software. Day 1: You completed a lesson. Your streak is 1. Day 3: You do not want to break it. Day 7: Breaking the streak would feel like losing something real. This is called loss aversion. Kahneman proved it. Duolingo built a business on it.",
      ),
      paragraph(
        "The streak does something subtle but powerful. It turns Duolingo from a product into a daily ritual. And rituals do not churn. Rituals renew. The average Duolingo user opens the app 4.3 times per week. The average B2B SaaS user logs in 1.2 times. One is a habit. One is a tool. Habits pay subscriptions on autopilot. Tools get cancelled when budgets tighten.",
      ),
      postImage(
        "/duolingo-4.jpg",
        "Duolingo streak counter and daily reminder",
        "Step 4: Making it a habit with streaks",
      ),
      heading("What This Means for Your Product", "h2"),
      paragraph(
        "Most indie founders I see build the same onboarding. Account creation. Dashboard. Empty state. Goodbye. That is not onboarding. That is abandonment with extra steps. The Duolingo model is not complicated. Ask one question before you ask for an account. Spend 9 screens making the user feel seen. Deliver the aha moment before you show pricing. Build one habit mechanic before you ask for money. Sign in. Set up. Aha. Habit. Paid. In that order. Every time. No shortcuts.",
      ),
      paragraph(
        "Duolingo has 500 million users. They did not skip a single step. Neither should you. Which onboarding flow do you want me to tear down next? Drop it below, I will break it down screen by screen. Repost to help one founder rethink their first 3 minutes.",
      ),
    ],
  },
];

export const mockPosts = [...mockPostsInternal].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getMockPreviews(): PostPreview[] {
  return mockPosts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    readTime: post.readTime,
    category: post.category,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
  }));
}

export function getMockPostBySlug(slug: string) {
  return mockPosts.find((post) => post.slug.current === slug) ?? null;
}
