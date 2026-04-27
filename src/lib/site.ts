export const siteConfig = {
  name: "Teja Blogs",
  domain: "tejablog.online",
  eyebrow: "Blogs",
  title: "Building SaaS that people actually pay for.",
  description:
    "Successful SaaS products are not just code. They obsess over user onboarding, distribution, micro-copy, and positioning.",
  intro:
    "Building a SaaS that people actually pay for is harder than writing code. I share what actually works — based on real teardowns, not theory.",
  about: [
    "Building a SaaS that people actually pay for is harder than writing code. I share what actually works — based on real teardowns, not theory.",
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
    "Teja Blogs is a personal publication focused on SaaS growth, distribution, and the real decisions that turn side projects into profitable businesses.",
} as const;

export function getCategoryStyle() {
  return "bg-[var(--accent-text-subtle)] text-[var(--accent-text)]";
}
