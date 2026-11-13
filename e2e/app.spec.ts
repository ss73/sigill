import { expect, test, type Page } from "@playwright/test";
import { addAuthenticator, firstLink, parseMailto } from "./helpers";

async function createInbox(page: Page, email?: string): Promise<string> {
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  if (email) {
    await page.getByTestId("your-email").fill(email);
  }
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your inbox is ready");
  return page.getByTestId("inbox-link").inputValue();
}

async function writeMessage(page: Page, inboxUrl: string, text: string): Promise<string> {
  await page.goto(inboxUrl);
  await page.getByTestId("message").fill(text);
  const send = page.getByTestId("send-email");
  await expect(send).not.toHaveAttribute("aria-disabled", "true");
  return (await send.getAttribute("href"))!;
}

test("receive: create inbox, get written to, open the message after a reload", async ({ page }) => {
  await addAuthenticator(page);
  const inboxUrl = await createInbox(page, "alice@example.com");
  expect(inboxUrl).toContain("#to=");
  expect(inboxUrl).toContain("e=alice%40example.com");
  const inboxCode = await page.getByTestId("security-code").textContent();

  const share = parseMailto((await page.getByTestId("share-link").getAttribute("href"))!);
  expect(share.to).toBe("");
  expect(firstLink(share.body)).toBe(inboxUrl);

  // Sender side.
  const href = await writeMessage(page, inboxUrl, "Hej Alice! Lösenordet är 🔐 hunter2");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Secure message to alice@example.com");
  await expect(page.getByTestId("security-code")).toHaveText(inboxCode!);
  const mail = parseMailto(href);
  expect(mail.to).toBe("alice@example.com");
  expect(mail.subject).toBe("A secure message for you");
  const messageUrl = firstLink(mail.body);
  expect(messageUrl).toContain("#m=");
  expect(mail.body).not.toContain("hunter2");

  // Recipient opens it later: nothing remembered, passkey needed.
  await page.goto(messageUrl);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("You've received a secure message");
  await page.getByTestId("open-message").click();
  await expect(page.getByTestId("message-text")).toHaveText("Hej Alice! Lösenordet är 🔐 hunter2");
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test("first contact: ask for a link, recipient sets up and sends it back in one click", async ({ page }) => {
  await addAuthenticator(page);
  await page.goto("/");
  await page.getByTestId("choose-send").click();
  await page.getByTestId("ask-their-email").fill("bob@example.com");
  await page.getByTestId("ask-your-email").fill("alice@example.com");
  const invite = parseMailto((await page.getByTestId("ask-send").getAttribute("href"))!);
  expect(invite.to).toBe("bob@example.com");

  // Bob follows the invitation.
  await page.goto(firstLink(invite.body));
  await expect(page.getByRole("status").first()).toContainText("alice@example.com would like to send you something securely");
  await expect(page.getByTestId("your-email")).toHaveValue("bob@example.com");
  await page.getByTestId("create-inbox").click();
  const share = page.getByTestId("share-link");
  await expect(share).toHaveText("Send my link to alice@example.com");
  const reply = parseMailto((await share.getAttribute("href"))!);
  expect(reply.to).toBe("alice@example.com");
  expect(firstLink(reply.body)).toContain("e=bob%40example.com");
});

test("pasting a secure link on the send page opens the compose page", async ({ page }) => {
  await addAuthenticator(page);
  const inboxUrl = await createInbox(page);
  await page.goto("/#send");
  await page.getByTestId("recipient-link").fill(`  ${inboxUrl}  `);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Secure message to the owner of this link");
});

test("a message for another inbox is explained, not shown", async ({ page }) => {
  await addAuthenticator(page);
  await createInbox(page);
  const stranger = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
  const href = await writeMessage(page, `/#to=${stranger}`, "not for you");
  await page.goto(firstLink(parseMailto(href).body));
  await page.reload();
  await page.getByTestId("open-message").click();
  await expect(page.getByRole("alert")).toContainText("wasn't sent to the inbox you unlocked");
  await expect(page.getByTestId("message-text")).toHaveCount(0);
});

test("a truncated message link is reported without a passkey prompt", async ({ page }) => {
  await page.goto("/#m=AQIDBAUG");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This message link is incomplete");
  await expect(page.getByTestId("paste-message")).toBeVisible();
  await expect(page.getByTestId("open-message")).toHaveCount(0);
});

test("long messages fall back to copy and paste", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await addAuthenticator(page);
  const inboxUrl = await createInbox(page, "alice@example.com");
  const random = Buffer.from(crypto.getRandomValues(new Uint8Array(3000))).toString("base64");
  const href = await writeMessage(page, inboxUrl, random);
  expect(parseMailto(href).body).toBe("");
  await expect(page.getByTestId("compose-status")).toContainText("copied");
  await page.getByTestId("copy-message").click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("#m=");
});

test("a passkey without PRF gets a clear explanation", async ({ page }) => {
  await addAuthenticator(page, false);
  await page.goto("/#inbox");
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("alert")).toContainText("can't hold a secure inbox");
});

test("a broken inbox link is explained", async ({ page }) => {
  await page.goto("/#to=abc");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This secure link is incomplete");
});
