export const siteConfig = {
  name: "Teja Blog",
  domain: "tejablog.online",
  eyebrow: "AI Blog",
  title: "Tracking how AI is changing work, products, and the web.",
  description:
    "Simple, grounded writing on AI tools, agents, workflows, and the transition happening around us.",
  intro:
    "I am here too, sharing my insights on the AI world and how the AI world is transitioning.",
  about: [
    "I am here too, sharing my insights on the AI world and how the AI world is transitioning.",
    "I write in simple words about AI tools, agent workflows, product shifts, and what those changes mean in real work.",
    "This blog is where I slow things down, explain what matters, and make the AI wave easier to follow.",
  ],
  author: {
    name: "Teja",
    role: "Creator and writer",
    image: "/author-avatar.png",
  },
  navigation: [
    { href: "/", label: "Blog" },
    { href: "/about", label: "About" },
  ],
  footerDescription:
    "Teja Blog is a personal AI publication focused on practical insights, agent systems, and the transition shaping the next phase of digital work.",
} as const;

export function getCategoryStyle() {
  return "bg-[var(--accent-text-subtle)] text-[var(--accent-text)]";
}
