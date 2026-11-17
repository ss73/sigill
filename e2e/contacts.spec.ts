import { expect, test, type Page } from "@playwright/test";
import { addAuthenticator, firstLink, parseMailto } from "./helpers";

async function createInbox(page: Page, email: string): Promise<string> {
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  await page.getByTestId("your-email").fill(email);
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your inbox is ready");
  return page.getByTestId("inbox-link").inputValue();
}

/** Writes on the current compose page and clicks "Send by e-mail" without leaving it. */
async function send(page: Page, text: string): Promise<string> {
  await page.getByTestId("message").fill(text);
  const button = page.getByTestId("send-email");
  await expect(button).not.toHaveAttribute("aria-disabled", "true");
  await button.evaluate((el) => el.addEventListener("click", (event) => event.preventDefault()));
  await button.click();
  return (await button.getAttribute("href"))!;
}

function otherKey(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
}

test("people you write to are listed on the send page, with the language used", async ({ browser }) => {
  const bob = await (await browser.newContext()).newPage();
  await addAuthenticator(bob);
  const bobLink = await createInbox(bob, "bob@example.com");

  const page = await browser.newPage();
  await page.goto(bobLink);
  await page.getByTestId("email-language").selectOption("sv");
  await send(page, "Hej Bob");

  await page.goto("/#send");
  await expect(page.getByTestId("contact-name")).toHaveText(["bob@example.com"]);
  // The same security code Bob sees on his own link page.
  await expect(page.getByTestId("contact-code")).toHaveText(await bob.getByTestId("security-code").textContent() ?? "");
  await page.getByTestId("contacts").getByRole("link", { name: "bob@example.com" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Secure message to bob@example.com");
  await expect(page.getByTestId("email-language")).toHaveValue("sv");

  // Removing one.
  await page.goto("/#send");
  await page.getByRole("button", { name: "Remove: bob@example.com" }).click();
  await expect(page.getByTestId("contacts")).toHaveCount(0);
});

test("a link for a known address with another key is held back until the user decides", async ({ browser }) => {
  const bob = await (await browser.newContext()).newPage();
  await addAuthenticator(bob);
  const bobLink = await createInbox(bob, "bob@example.com");
  const page = await browser.newPage();
  await page.goto(bobLink);
  await send(page, "first");

  // Someone sends a link that claims Bob's address.
  await page.goto(`/#to=${otherKey()}&e=bob%40example.com`);
  await expect(page.getByTestId("key-changed")).toContainText("This isn't the link you used before");
  await expect(page.getByTestId("known-code")).toHaveText(/^[0-9a-f]{4}(-[0-9a-f]{4}){3}$/);
  await expect(page.getByTestId("key-changed").locator("svg.key-picture")).toHaveCount(2);
  await expect(page.getByTestId("message")).toBeHidden();
  await expect(page.getByTestId("use-known-link")).toHaveAttribute("href", new URL(bobLink).hash);

  // Going back to the known link.
  await page.getByTestId("use-known-link").click();
  await expect(page.getByTestId("key-changed")).toHaveCount(0);
  await expect(page.getByTestId("message")).toBeVisible();

  // Or accepting a new one (say Bob really made a new inbox): it replaces the old.
  const newKey = otherKey();
  await page.goto(`/#to=${newKey}&e=bob%40example.com`);
  await page.getByTestId("use-new-link").click();
  await expect(page.getByTestId("message")).toBeFocused();
  await page.goto("/#send");
  await expect(page.getByTestId("contact-name")).toHaveText(["bob@example.com"]);
  await expect(page.getByTestId("contacts").locator("a")).toHaveAttribute("href", `#to=${newKey}&e=bob%40example.com`);
});

test("senders are remembered from their messages, and a mismatching sender is flagged", async ({ browser }) => {
  const me = await (await browser.newContext()).newPage();
  const alice = await (await browser.newContext()).newPage();
  await addAuthenticator(me);
  await addAuthenticator(alice);
  const myLink = await createInbox(me, "me@example.com");
  await createInbox(alice, "alice@example.com");

  await alice.goto(myLink);
  const message = firstLink(parseMailto(await send(alice, "from the real Alice")).body);
  await me.goto(message);
  await me.reload();
  await me.getByTestId("open-message").click();
  await expect(me.getByTestId("message-text")).toHaveText("from the real Alice");
  await expect(me.getByTestId("sender-changed")).toHaveCount(0);
  await me.goto("/#send");
  await expect(me.getByTestId("contact-name")).toHaveText(["alice@example.com"]);

  // Mallory makes an inbox and signs as Alice.
  const mallory = await (await browser.newContext()).newPage();
  await addAuthenticator(mallory);
  await createInbox(mallory, "alice@example.com");
  await mallory.goto(myLink);
  const fake = firstLink(parseMailto(await send(mallory, "from 'Alice'")).body);
  await me.goto(fake);
  await me.reload();
  await me.getByTestId("open-message").click();
  await expect(me.getByTestId("sender-changed")).toContainText("isn't the one you know");
  // And not trusted: the known link stays.
  await me.getByTestId("reply").click();
  await expect(me.getByTestId("key-changed")).toBeVisible();
});

test("remembering is set in the settings menu, and forgetting asks first", async ({ browser }) => {
  const bob = await (await browser.newContext()).newPage();
  await addAuthenticator(bob);
  const bobLink = await createInbox(bob, "bob@example.com");
  const page = await browser.newPage();
  await page.goto(bobLink);
  await send(page, "hi");
  await page.goto("/#send");
  const settings = page.getByTestId("settings");
  const openSettings = () => settings.locator("summary").click();

  // The list itself has nothing destructive besides "Remove".
  await expect(page.getByTestId("contact-name")).toHaveText(["bob@example.com"]);
  await expect(page.getByTestId("forget-contacts")).toBeHidden();

  // Forgetting everyone asks; cancelling keeps everyone.
  await openSettings();
  await expect(settings).toContainText("Kept on this browser only");
  await page.getByTestId("forget-contacts").click();
  await expect(settings).toContainText("Forget everyone on this list?");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByTestId("contact-name")).toHaveText(["bob@example.com"]);

  // Escape and clicking elsewhere close it.
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("remember-contacts")).toBeHidden();
  await openSettings();
  await page.mouse.click(5, 400); // empty margin, clear of the open menu
  await expect(page.getByTestId("remember-contacts")).toBeHidden();

  // Switching off with people on the list asks, then forgets them; the list goes away.
  await openSettings();
  await page.getByTestId("remember-contacts").click();
  await expect(settings).toContainText("Stop remembering people, and forget everyone on this list?");
  await page.getByTestId("confirm-stop").click();
  await expect(page.getByTestId("remember-contacts")).not.toBeChecked();
  await expect(page.getByTestId("contacts")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("sigill.contacts"))).toBeNull();

  // Nothing new is remembered while off, on any page.
  await page.goto(bobLink);
  await send(page, "again");
  await page.goto("/#send");
  await page.reload();
  await expect(page.getByTestId("contacts")).toHaveCount(0);

  // Back on from the same menu.
  await openSettings();
  await page.getByTestId("remember-contacts").click();
  await expect(page.getByTestId("remember-contacts")).toBeChecked();
  await page.goto(bobLink);
  await send(page, "and again");
  await page.goto("/#send");
  await expect(page.getByTestId("contact-name")).toHaveText(["bob@example.com"]);

  // Forgetting everyone, confirmed.
  await openSettings();
  await page.getByTestId("forget-contacts").click();
  await page.getByTestId("confirm-forget").click();
  await expect(page.getByTestId("contacts")).toHaveCount(0);
  await expect(page.getByTestId("remember-contacts")).toBeChecked();
});
