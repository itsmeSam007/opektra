import { test, expect } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL || "admin@founderos.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD || "admin123";

test.describe("Smoke — public site", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Opektra/i);
    await expect(page.getByRole("link", { name: "Products", exact: true })).toBeVisible();
  });

  test("products page lists published products", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("contact topic prepares the business email", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Product enquiries", exact: true }).click();
    await expect(page.getByRole("button", { name: "Product enquiries", exact: true })).toHaveAttribute("aria-pressed", "true");
    const href = await page.getByRole("link", { name: "Start the conversation" }).getAttribute("href");
    expect(href).toBeTruthy();
    const email = new URL(href!);
    expect(email.protocol).toBe("mailto:");
    expect(email.pathname).toBe("admin@opektra.com");
    expect(email.searchParams.get("subject")).toBe("Opektra product enquiry");
    expect(email.searchParams.get("body")).toContain("The product I’m interested in:");
  });
});

test.describe("Smoke — admin", () => {
  test("admin login reaches dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByTestId("admin-login-email").fill(adminEmail);
    await page.getByTestId("admin-login-password").fill(adminPassword);
    await page.getByTestId("admin-login-submit").click();
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });
});
