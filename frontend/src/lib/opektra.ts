import { engineeringArticles } from "./engineering-articles";

export type Article = { slug: string; category: string; readTime: string; title: string; excerpt: string; image: string; imageAlt: string; sections: { heading: string; paragraphs: string[] }[]; takeaway?: string; sources?: { title: string; url: string }[] };

export const company = {
  name: "Opektra",
  legalName: "Opektra Technologies Pvt Ltd",
  owner: "Soumen Karmakar",
  location: "Kolkata, West Bengal, India",
  url: "https://www.opektra.com",
  email: "admin@opektra.com",
  description: "Opektra is a software engineering company building thoughtful products for the way businesses work.",
};

// Add independently useful products here as they launch. Never show fictional products.
export const products = [{
  slug: "conektra", name: "Conektra", category: "Connected business operations",
  tagline: "Your business. Connected.", url: "https://www.conektra.com/",
  description: "Conversations, bookings, billing, stock and follow-ups, working together.",
  capabilities: ["Shared conversations", "Bookings & reminders", "Billing & inventory", "Follow-ups & insights"],
}];

export const articles: Article[] = [
  {
    slug: "simpler-tools-for-growing-businesses", category: "Product thinking", readTime: "4 min read",
    title: "The power of simpler tools for growing businesses",
    excerpt: "Good software reduces the distance between a conversation and getting something done.",
    image: "/opektra/workflow-editorial.png", imageAlt: "Connected conversation, booking and operations interface panels",
    sections: [
      { heading: "The work between the tools", paragraphs: ["A customer sends a message. Someone checks a calendar, copies a name into another system, and asks a colleague whether the booking is confirmed. None of those steps is particularly difficult. The difficulty is keeping the context intact as work moves between them.", "For a growing business, simplicity is less about having fewer buttons and more about having fewer things to remember. Useful software makes the next step clear without asking people to reconstruct what happened before."] },
      { heading: "Connect the moments that matter", paragraphs: ["Start with a real journey rather than a feature list. What does a person need to know when an enquiry becomes a booking? What should the team see when the customer returns? Which actions need a human decision?", "These questions reveal where information needs to travel. A booking should retain the context of the conversation. A follow-up should reflect the service that actually happened. An operational change should be visible to the people responsible for it."] },
      { heading: "Keep people in control", paragraphs: ["Automation should make ordinary work easier while keeping unusual situations understandable. Clear status, explicit approvals and an easy handoff to a person matter more than a long list of automations.", "This is the product thinking behind Conektra: bring conversations and operations into a shared context, so people can focus on the business and the customers behind each task."] },
    ],
  },
  {
    slug: "designing-for-real-human-workflows", category: "Engineering & design", readTime: "4 min read",
    title: "Designing software for real human workflows",
    excerpt: "Why understanding people is the first step to building useful software.",
    image: "/opektra/engineering-editorial.png", imageAlt: "A close view of a software engineering workspace and code editor",
    sections: [
      { heading: "Begin with the work", paragraphs: ["A tidy diagram is not the same thing as a working day. People get interrupted, customers change their plans, and a colleague may need to pick up a task halfway through. Software needs to make sense in those moments too.", "Before choosing an interface or a technical solution, map the decisions people make. Find out what they need to know, where they get that information, and what happens when it is missing."] },
      { heading: "Make state understandable", paragraphs: ["A useful interface answers three questions: what happened, what is happening now, and what can I do next? A clear confirmation is often more valuable than another control.", "Engineering supports that clarity. Explicit states, predictable transitions and careful handling of failures help the interface tell the truth. A request being sent should look different from a request that has been confirmed."] },
      { heading: "Design the handoffs", paragraphs: ["The edges of a workflow deserve as much care as the main path. Consider how a person takes over from an assistant, how a new team member finds the history, and how someone safely corrects a mistake.", "At Opektra, thoughtful design and solid engineering belong to the same conversation. The aim is software that feels clear because the underlying behaviour has been considered, not because the complexity has simply been hidden."] },
    ],
  },
  ...engineeringArticles,
];

export function articleReadTime(article: Article) {
  const words = [article.title, article.excerpt, ...article.sections.flatMap(section => [section.heading, ...section.paragraphs])].join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
