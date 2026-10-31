import { describe, expect, it } from "vitest";
import { ADMIN_NAV, CONTENT_MODULES, canAccess } from "./admin-nav";

describe("admin-nav", () => {
  it("defines eleven admin sections", () => {
    expect(ADMIN_NAV).toHaveLength(11);
  });

  it("canAccess grants dashboard without permission", () => {
    expect(canAccess([], null)).toBe(true);
  });

  it("canAccess checks required permission", () => {
    expect(canAccess(["users:read"], "users:read")).toBe(true);
    expect(canAccess([], "users:read")).toBe(false);
  });

  it("content modules include products and blog", () => {
    const labels = CONTENT_MODULES.map((m) => m.label);
    expect(labels).toContain("Products");
    expect(labels).toContain("Blog");
  });
});
