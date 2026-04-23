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

function bullet(text: string) {
  return {
    _key: createKey(),
    _type: "block",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(text)],
  };
}

function quote(text: string) {
  return {
    _key: createKey(),
    _type: "block",
    style: "blockquote",
    markDefs: [],
    children: [span(text)],
  };
}

function code(codeValue: string, language: string, filename?: string) {
  return {
    _key: createKey(),
    _type: "code",
    code: codeValue,
    filename,
    language,
  };
}

function postImage(assetUrl: string, alt: string, caption: string) {
  return {
    _key: createKey(),
    _type: "postImage",
    assetUrl,
    alt,
    caption,
  };
}

const mockPostsInternal: BlogPost[] = [
  {
    _id: "mock-ai-transition",
    title: "AI Is No Longer a Feature. It Is Becoming the New Layer of Work.",
    slug: { current: "ai-is-no-longer-a-feature" },
    publishedAt: "2026-04-21T09:00:00.000Z",
    excerpt:
      "The real change is not that AI can answer questions. The real change is that it is starting to sit inside everyday workflow.",
    readTime: 7,
    category: "AI Trends",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Abstract AI-inspired digital light pattern",
    body: [
      paragraph(
        "For a long time, AI felt like an extra tab. You opened it, asked something, copied the result, and then moved back to your real work. That is changing. AI is starting to move closer to the center of the workflow.",
      ),
      paragraph(
        "The biggest shift is not about novelty. It is about placement. When AI is built into search, writing, support, coding, planning, and review, it stops feeling like a tool on the side. It starts feeling like a working layer under the product itself.",
      ),
      quote(
        "The AI transition becomes real when people stop saying they are using AI and simply say they are getting work done.",
      ),
      heading("What Feels Different Now", "h2"),
      bullet("People expect faster first drafts, not just faster answers."),
      bullet("Teams want AI to reduce repeated work, not just impress in demos."),
      bullet("The best products are hiding complexity behind clear outcomes."),
      postImage(
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
        "Person pointing at a laptop screen during collaboration",
        "The AI shift becomes useful when it changes the flow of work, not only the output.",
      ),
      heading("Why This Matters", "h2"),
      paragraph(
        "When AI moves into the main path of a product, expectations change with it. Users become less patient with busywork. They want systems that can summarize, suggest, organize, and speed up the first 80 percent of the job.",
      ),
      paragraph(
        "That does not mean human judgment matters less. It means judgment moves higher up the stack. More of the value starts coming from deciding what to ask, what to trust, what to edit, and what to ship.",
      ),
    ],
  },
  {
    _id: "mock-agents-guardrails",
    title: "Agent Workflows Only Become Valuable When Guardrails Are Clear",
    slug: { current: "agent-workflows-need-clear-guardrails" },
    publishedAt: "2026-04-17T09:00:00.000Z",
    excerpt:
      "Agents look powerful in a clean demo. In real use, the difference comes from structure, review, and boundaries.",
    readTime: 8,
    category: "Agents",
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Robot hand touching a digital interface",
    body: [
      paragraph(
        "People often talk about agents as if autonomy is the main story. I do not think that is the right frame. In practice, useful agents are not the ones that do everything alone. They are the ones that know where to stop, ask, check, and hand back control.",
      ),
      paragraph(
        "That is why guardrails matter so much. A good agent workflow has clear tasks, good context, clean ownership, and an obvious review step before anything important is finalized.",
      ),
      heading("What Makes an Agent Reliable", "h2"),
      bullet("A narrow goal instead of a vague instruction."),
      bullet("Access to the right context, not unlimited context."),
      bullet("A visible review point before high-impact actions."),
      bullet("Simple rules for what the agent should never touch."),
      code(
        `const workflow = {\n  plan: "gather facts and prepare a draft",\n  act: "work only inside the assigned scope",\n  review: "send results back before final publish",\n};`,
        "ts",
        "agent-guardrails.ts",
      ),
      paragraph(
        "The AI world is moving toward systems that do more on our behalf. That makes trust design more important than ever. The best agent experience is not the most aggressive one. It is the one that feels dependable under normal pressure.",
      ),
    ],
  },
  {
    _id: "mock-ai-workflow",
    title: "My Simple AI Workflow for Research, Drafting, and Decision Support",
    slug: { current: "simple-ai-workflow-for-research-and-drafting" },
    publishedAt: "2026-04-11T09:00:00.000Z",
    excerpt:
      "AI works best for me when it speeds up the middle of the process and still leaves the final call in human hands.",
    readTime: 6,
    category: "Workflow",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Desktop setup with code and notes on screen",
    body: [
      paragraph(
        "I do not treat AI as a replacement for thinking. I treat it as a strong first-pass system. It helps me collect information, sort patterns, generate options, and reduce the slow start that usually sits between an idea and a draft.",
      ),
      heading("The Workflow I Keep Coming Back To", "h2"),
      bullet("Use AI to collect a first map of the topic."),
      bullet("Ask it to show multiple angles, not one answer."),
      bullet("Turn the best ideas into a rough structure."),
      bullet("Write the final view in my own voice after the structure is clear."),
      postImage(
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
        "Circuit board and processor under soft blue lighting",
        "A useful AI workflow is less about magic and more about reducing friction in the middle.",
      ),
      paragraph(
        "The main benefit is not speed alone. It is mental clarity. Once the messy first layer is out of the way, I can spend more energy on judgment, accuracy, and tone.",
      ),
      paragraph(
        "This is where I think AI is becoming practical. It is not about doing everything. It is about making the path from uncertainty to a clear draft much shorter.",
      ),
    ],
  },
  {
    _id: "mock-ai-internet",
    title: "The AI Transition Is Already Changing How the Internet Feels",
    slug: { current: "the-ai-transition-is-changing-the-internet" },
    publishedAt: "2026-04-03T09:00:00.000Z",
    excerpt:
      "The web is starting to feel less like a list of links and more like a set of conversations, summaries, and generated interfaces.",
    readTime: 5,
    category: "Perspective",
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "View of Earth from space with glowing network lines",
    body: [
      paragraph(
        "You can feel the shift in small ways first. Search is becoming more answer-shaped. Writing tools are becoming more collaborative. Interfaces are becoming more adaptive. The internet still looks familiar, but the way people move through it is already changing.",
      ),
      paragraph(
        "This transition matters because it changes where value lives. It is no longer enough to publish information and hope people will dig through it. More value is moving toward clarity, structure, trust, and systems that help people act faster.",
      ),
      quote(
        "The future web may still be built from pages, but it will be experienced more through intelligence wrapped around those pages.",
      ),
      heading("What I Keep Watching", "h2"),
      bullet("How discovery changes when summaries arrive before links."),
      bullet("How products redesign flows once AI becomes part of the default path."),
      bullet("How people learn new trust habits around generated output."),
      paragraph(
        "That is why I find this moment so interesting. We are not just adding AI to the internet. We are watching the shape of the internet itself begin to change.",
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
