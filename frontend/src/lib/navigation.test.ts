import { describe, expect, it } from "vitest";
import { routeCurrent } from "./navigation";

describe("navigation state", () => {
  it("marks the open page and its parent section separately", () => {
    expect(routeCurrent("/products/conektra", "/products/conektra")).toBe("page");
    expect(routeCurrent("/products/conektra", "/products")).toBe("location");
  });

  it("does not mark home or a similarly named section as current", () => {
    expect(routeCurrent("/products/conektra", "/")).toBeUndefined();
    expect(routeCurrent("/products-archive", "/products")).toBeUndefined();
    expect(routeCurrent("/", "/")).toBe("page");
  });
});
