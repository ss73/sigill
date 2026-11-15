import { expect, test, type Page } from "@playwright/test";
import { addAuthenticator, firstLink, parseMailto } from "./helpers";

// Long, unbreakable addresses must wrap instead of widening the page on a phone.
const LONG = "firstname.middlename.lastname@subdivision.example-company.com";

test.use({ viewport: { width: 360, height: 740 } });

async function expectNoSideScroll(page: Page, where: string): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, where).toBeLessThanOrEqual(0);
}

test("long e-mail addresses don't make the page scroll sideways", async ({ page }) => {
  await addAuthenticator(page);
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  await page.getByTestId("your-email").fill(LONG);
  await page.getByTestId("create-inbox").click();
  const inboxUrl = await page.getByTestId("inbox-link").inputValue();
  await expectNoSideScroll(page, "inbox");

  await page.goto(inboxUrl);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(LONG);
  await page.getByTestId("message").fill("Hello");
  await expect(page.getByTestId("send-email")).not.toHaveAttribute("aria-disabled", "true");
  await page.getByTestId("send-email").evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await page.getByTestId("send-email").click();
  await expectNoSideScroll(page, "compose");

  const link = firstLink(parseMailto((await page.getByTestId("send-email").getAttribute("href"))!).body);
  await page.goto(link);
  await page.reload();
  await page.getByTestId("open-message").click();
  await expect(page.getByTestId("message-text")).toHaveText("Hello");
  await expectNoSideScroll(page, "open");

  await page.goto(`/#inbox&reply=${encodeURIComponent(LONG)}`);
  await page.getByTestId("forget-inbox").click();
  await expectNoSideScroll(page, "invited");
});
