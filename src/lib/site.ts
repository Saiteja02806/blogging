export const siteConfig = {
  name: "Teja Blog",
  domain: "tejablog.online",
  eyebrow: "SaaS Blog",
  title: "Building SaaS that people actually pay for.",
  description:
    "Practical insights on building successful SaaS products. What actually matters, why coding alone isn't enough, and the distribution, positioning, and user obsession that separates products that scale from ones that disappear.",
  intro:
    "Building a SaaS that people actually pay for is harder than writing code. I am here to share what actually works.",
  about: [
    "Building a SaaS that people actually pay for is harder than writing code. I am here to share what actually works.",
    "I write about distribution, positioning, onboarding, pricing, and the real-world decisions that turn a side project into a real business.",
    "This blog is where I break down why building alone is never enough, and what separates SaaS products that scale from the ones that never get a single paying user.",
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
    "Teja Blog is a personal publication focused on SaaS growth, distribution, and the real decisions that turn side projects into profitable businesses.",
} as const;

export function getCategoryStyle() {
  return "bg-[var(--accent-text-subtle)] text-[var(--accent-text)]";
}
