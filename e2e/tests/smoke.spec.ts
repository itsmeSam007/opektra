import { test, expect } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL || "admin@founderos.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD || "admin123";

test.describe("Smoke — public site", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Soumen Karmakar/i);
    await expect(page.getByRole("link", { name: "Products" })).toBeVisible();
  });

  test("products page lists published products", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("contact form submits successfully", async ({ page }) => {
    await page.goto("/contact");
    await page.getByTestId("contact-name").fill("E2E Tester");
    await page.getByTestId("contact-email").fill("e2e@example.com");
    await page.getByTestId("contact-message").fill("This is an automated E2E contact form test message.");
    await page.getByTestId("contact-submit").click();
    await expect(page.getByTestId("contact-success")).toBeVisible({ timeout: 15_000 });
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
