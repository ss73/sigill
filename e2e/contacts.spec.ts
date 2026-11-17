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
  await expect(page.getByTestId("contacts").locator("a")).toHaveText(["bob@example.com"]);
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
  await expect(page.getByTestId("contacts").locator("a")).toHaveText(["bob@example.com"]);
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
  await expect(me.getByTestId("contacts").locator("a")).toHaveText(["alice@example.com"]);

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

test("the list's options are in a menu and ask before acting", async ({ browser }) => {
  const bob = await (await browser.newContext()).newPage();
  await addAuthenticator(bob);
  const bobLink = await createInbox(bob, "bob@example.com");
  const page = await browser.newPage();
  await page.goto(bobLink);
  await send(page, "hi");
  await page.goto("/#send");

  // Nothing destructive in view until the menu is opened.
  await expect(page.getByTestId("forget-contacts")).toBeHidden();
  await page.getByTestId("contacts-menu").locator("summary").click();
  await expect(page.getByTestId("contacts-menu")).toContainText("Kept on this browser only");

  // A first click only asks; cancelling keeps everyone.
  await page.getByTestId("forget-contacts").click();
  await expect(page.getByTestId("contacts-menu")).toContainText("Forget everyone on this list?");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByTestId("contacts").locator("a")).toHaveText(["bob@example.com"]);

  // Escape and clicking elsewhere close it.
  await page.getByTestId("contacts-menu").locator("summary").click();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("stop-remembering")).toBeHidden();
  await page.getByTestId("contacts-menu").locator("summary").click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(page.getByTestId("stop-remembering")).toBeHidden();

  // Stopping forgets everyone, and nothing new is remembered.
  await page.getByTestId("contacts-menu").locator("summary").click();
  await page.getByTestId("stop-remembering").click();
  await page.getByTestId("confirm-stop").click();
  await expect(page.getByTestId("contacts")).toHaveCount(0);
  await expect(page.getByText("aren't remembered on this browser")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("sigill.contacts"))).toBeNull();
  await page.goto(bobLink);
  await send(page, "again");
  await page.goto("/#send");
  await page.reload();
  await expect(page.getByTestId("contacts")).toHaveCount(0);

  // And it can be turned back on from the same card.
  await page.getByTestId("remember-again").click();
  await expect(page.getByTestId("contacts-menu").locator("summary")).toBeVisible();
  await page.goto(bobLink);
  await send(page, "and again");
  await page.goto("/#send");
  await expect(page.getByTestId("contacts").locator("a")).toHaveText(["bob@example.com"]);

  // Forgetting everyone, confirmed.
  await page.getByTestId("contacts-menu").locator("summary").click();
  await page.getByTestId("forget-contacts").click();
  await page.getByTestId("confirm-forget").click();
  await expect(page.getByTestId("contacts")).toHaveCount(0);
});
