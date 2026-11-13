import { expect, test, type Page } from "@playwright/test";

/** Attaches a Chrome virtual authenticator that auto-approves prompts. */
async function addAuthenticator(page: Page, hasPrf: boolean) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  await cdp.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
      hasPrf,
    },
  });
}

test("creates an inbox, round-trips a message, and re-derives the same key after reload", async ({ page }) => {
  await addAuthenticator(page, true);
  await page.goto("/");
  await expect(page.locator("#support")).toContainText("X25519");

  await page.fill("#label", "test@example.com");
  await page.click("#create");
  const fingerprint = page.locator("#fingerprint");
  await expect(fingerprint).toHaveText(/^[0-9a-f]{4}(-[0-9a-f]{4}){3}$/);
  const created = await fingerprint.textContent();

  await page.fill("#plaintext", "Hej Åsa! 🔐");
  await page.click("#encrypt");
  await expect(page.locator("#envelope")).not.toHaveValue("");
  await page.click("#decrypt");
  await expect(page.locator("#decrypted")).toHaveText("Hej Åsa! 🔐");
  const envelope = await page.locator("#envelope").inputValue();

  // Nothing persisted: after a reload the key comes back only via the passkey.
  await page.reload();
  await expect(page.locator("#inbox")).toBeHidden();
  await page.click("#unlock");
  await expect(fingerprint).toHaveText(created!);

  await page.fill("#envelope", envelope);
  await page.click("#decrypt");
  await expect(page.locator("#decrypted")).toHaveText("Hej Åsa! 🔐");

  const stored = await page.evaluate(() => localStorage.length + sessionStorage.length);
  expect(stored).toBe(0);
});

test("refuses an authenticator without PRF", async ({ page }) => {
  await addAuthenticator(page, false);
  await page.goto("/");
  await page.click("#create");
  await expect(page.locator("#inbox-error")).toContainText("PRF");
  await expect(page.locator("#inbox")).toBeHidden();
});

test("decrypting without an unlocked inbox explains what to do", async ({ page }) => {
  await page.goto("/");
  await page.fill("#envelope", "AQ");
  await page.click("#decrypt");
  await expect(page.locator("#open-error")).toContainText("unlock an inbox");
});
