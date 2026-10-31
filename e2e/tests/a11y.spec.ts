import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const P0_PAGES = ["/", "/products", "/contact", "/admin/login"];

for (const path of P0_PAGES) {
  test(`a11y: ${path} has no critical violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toHaveLength(0);
  });
}
