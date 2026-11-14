import { expect, test } from "@playwright/test";
import { messages as de } from "../src/app/i18n/de";
import { en } from "../src/app/i18n/en";
import { messages as sv } from "../src/app/i18n/sv";
import { addAuthenticator, firstLink, parseMailto } from "./helpers";

/** Matches a mailto: href whose subject is `subject`. */
function withSubject(subject: string): RegExp {
  return new RegExp(`subject=${encodeURIComponent(subject).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
}

test.describe("with a Swedish browser", () => {
  test.use({ locale: "sv-SE" });

  test("the UI follows the browser language", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "sv");
    await expect(page.getByTestId("choose-send")).toContainText(sv.home.sendTitle);
    await expect(page.getByTestId("ui-language")).toHaveValue("sv");
  });

  test("a picked language wins, is remembered, and keeps the draft", async ({ page }) => {
    await addAuthenticator(page);
    await page.goto("/");
    await page.getByTestId("choose-receive").click();
    await page.getByTestId("create-inbox").click();
    await page.goto((await page.getByTestId("inbox-link").inputValue()));
    await page.getByTestId("message").fill("Draft that must survive");

    await page.getByTestId("ui-language").selectOption("en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.compose.title());
    await expect(page.getByTestId("message")).toHaveValue("Draft that must survive");
    await expect(page.getByTestId("send-email")).not.toHaveAttribute("aria-disabled", "true");

    await page.goto("/");
    await expect(page.getByTestId("choose-send")).toContainText(en.home.sendTitle);
  });
});

test("the e-mail goes out in the recipient's language, and the link opens in it", async ({ page, browser }) => {
  await addAuthenticator(page);
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  await page.getByTestId("create-inbox").click();
  const inboxUrl = await page.getByTestId("inbox-link").inputValue();

  await page.goto(inboxUrl);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.compose.title());
  await page.getByTestId("message").fill("Hallo!");
  await page.getByTestId("email-language").selectOption("de");
  const send = page.getByTestId("send-email");
  await expect(send).toHaveAttribute("href", withSubject(de.mail.messageSubject));
  const mail = parseMailto((await send.getAttribute("href"))!);
  expect(mail.subject).toBe(de.mail.messageSubject);
  const link = firstLink(mail.body);
  expect(link).toMatch(/&l=de$/);
  // The UI itself stays in English.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.compose.title());

  // An English-language browser opening the link sees German, like the e-mail.
  const reader = await (await browser.newContext({ locale: "en-US" })).newPage();
  await reader.goto(link);
  await expect(reader.getByRole("heading", { level: 1 })).toHaveText(de.open.receivedTitle);
});

test("the signature follows the e-mail language", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await addAuthenticator(page);
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  await page.getByTestId("create-inbox").click();
  await page.getByTestId("link-language").selectOption("sv");
  await expect(page.getByTestId("signature-preview")).toContainText(sv.mail.signature);
  await expect(page.getByTestId("share-link")).toHaveAttribute("href", withSubject(sv.mail.linkSubject));
  await page.getByTestId("copy-signature").click();
  await expect(page.getByTestId("copy-signature")).toHaveText(en.common.copied);
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text.startsWith(sv.mail.signature)).toBe(true);
});
