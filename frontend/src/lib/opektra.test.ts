import { describe, expect, it } from "vitest";
import { articleReadTime, type Article } from "./opektra";

const article: Article = {
  slug: "read-time", category: "Engineering", readTime: "99 min read",
  title: "", excerpt: "", image: "", imageAlt: "", sections: [],
};

describe("journal reading time", () => {
  it("keeps very short articles readable without displaying zero minutes", () => {
    expect(articleReadTime(article)).toBe("1 min read");
  });

  it("counts the complete article and ignores stale editorial estimates", () => {
    expect(articleReadTime({
      ...article,
      title: "A useful title", excerpt: "A brief introduction",
      sections: [{ heading: "How it works", paragraphs: [Array(400).fill("word").join("\n ")] }],
    })).toBe("3 min read");
  });
});
