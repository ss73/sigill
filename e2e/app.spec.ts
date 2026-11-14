import { expect, test, type Page } from "@playwright/test";
import { addAuthenticator, firstLink, parseMailto } from "./helpers";

async function createInbox(page: Page, email = "me@example.com"): Promise<string> {
  await page.goto("/");
  await page.getByTestId("choose-receive").click();
  await page.getByTestId("your-email").fill(email);
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your inbox is ready");
  return page.getByTestId("inbox-link").inputValue();
}

async function writeMessage(page: Page, inboxUrl: string, text: string): Promise<string> {
  await page.goto(inboxUrl);
  return writeMessageHere(page, text);
}

/** Types a message on the current compose page and returns the "Send by e-mail" href. */
async function writeMessageHere(page: Page, text: string): Promise<string> {
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

  // Recipient opens it later: the key isn't remembered, so the passkey is needed.
  await page.goto(messageUrl);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("You've received a secure message");
  await page.getByTestId("open-message").click();
  await expect(page.getByTestId("message-text")).toHaveText("Hej Alice! Lösenordet är 🔐 hunter2");

  // The browser keeps only the public link (key and e-mail), nothing secret.
  const stored = await page.evaluate(() => ({ ...localStorage }));
  expect(Object.keys(stored)).toEqual(["sigill.inbox"]);
  const inboxKey = new URLSearchParams(new URL(inboxUrl).hash.slice(1)).get("to");
  expect(JSON.parse(stored["sigill.inbox"]!)).toEqual({ k: inboxKey, e: "alice@example.com" });
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
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
  const inboxUrl = await createInbox(page, "dave@example.com");
  await page.goto("/#send");
  await page.getByTestId("recipient-link").fill(`  ${inboxUrl}  `);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Secure message to dave@example.com");
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
  await page.getByTestId("your-email").fill("me@example.com");
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("alert")).toContainText("can't hold a secure inbox");
});

test("a broken inbox link is explained", async ({ page }) => {
  await page.goto("/#to=abc");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This secure link is incomplete");
});

test("secure reply: a two-person conversation, each reply one click away", async ({ browser }) => {
  // Two people, each with their own browser and passkey.
  const alice = await (await browser.newContext()).newPage();
  const bob = await (await browser.newContext()).newPage();
  await addAuthenticator(alice);
  await addAuthenticator(bob);

  const aliceLink = await createInbox(alice, "alice@example.com");
  await createInbox(bob, "bob@example.com");

  // Bob writes to Alice. His browser knows his inbox, so reply is on by default.
  await bob.goto(aliceLink);
  await bob.reload();
  await expect(bob.getByTestId("reply-panel")).toContainText("Secure reply is on");
  const first = firstLink(parseMailto(await writeMessageHere(bob, "Hi Alice, what's the door code?")).body);

  // Alice reads it in a fresh visit and replies with one click.
  await alice.goto(first);
  await alice.reload();
  await alice.getByTestId("open-message").click();
  await expect(alice.getByTestId("message-text")).toHaveText("Hi Alice, what's the door code?");
  await expect(alice.getByRole("heading", { level: 1 }).locator("..")).toContainText("From bob@example.com");
  await alice.getByTestId("reply").click();
  await expect(alice.getByRole("heading", { level: 1 })).toHaveText("Secure message to bob@example.com");
  await expect(alice.getByTestId("reply-panel")).toContainText("Secure reply is on");
  const answer = parseMailto(await writeMessageHere(alice, "It's 4711."));
  expect(answer.to).toBe("bob@example.com");

  // Bob reads the answer and can keep the conversation going.
  await bob.goto(firstLink(answer.body));
  await bob.reload();
  await bob.getByTestId("open-message").click();
  await expect(bob.getByTestId("message-text")).toHaveText("It's 4711.");
  await expect(bob.getByRole("heading", { level: 1 }).locator("..")).toContainText("From alice@example.com");
  await expect(bob.getByTestId("reply")).toBeVisible();
});

test("secure reply can be added with the passkey, or left out", async ({ page }) => {
  await addAuthenticator(page);
  const ownLink = await createInbox(page, "carol@example.com");

  // A browser that doesn't know the inbox: reply starts off and is added with
  // the passkey, which also brings back the e-mail address.
  await page.getByTestId("forget-inbox").click();
  await page.goto(ownLink);
  await page.reload();
  await page.getByTestId("reply-add").click();
  await expect(page.getByTestId("reply-panel")).toContainText("Secure reply is on");
  const withReply = await writeMessageHere(page, "reply wanted");
  await page.goto(firstLink(parseMailto(withReply).body));
  await expect(page.getByRole("heading", { level: 1 }).locator("..")).toContainText("From carol@example.com");

  // Opting out: the recipient is told there is no reply address.
  await page.goto(ownLink);
  await page.getByTestId("reply-remove").click();
  await expect(page.getByTestId("reply-add")).toBeVisible();
  const href = await writeMessageHere(page, "no reply wanted");
  await page.goto(firstLink(parseMailto(href).body));
  await expect(page.getByTestId("message-text")).toHaveText("no reply wanted");
  await expect(page.getByTestId("reply")).toHaveCount(0);
  await expect(page.getByTestId("no-reply")).toBeVisible();
});

test("secure reply offers to create an inbox when the sender has none", async ({ page }) => {
  await addAuthenticator(page);
  const stranger = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
  await page.goto(`/#to=${stranger}`);
  await page.getByTestId("message").fill("draft stays");
  await page.getByTestId("reply-add").click(); // no passkey exists yet: the prompt fails
  await page.getByTestId("reply-create").click();
  await expect(page.getByRole("alert")).toContainText("enter your e-mail address");
  await page.getByTestId("reply-own-email").fill("erin@example.com");
  await page.getByTestId("reply-create").click();
  await expect(page.getByTestId("reply-panel")).toContainText("Secure reply is on");
  await expect(page.getByTestId("message")).toHaveValue("draft stays");
});

test("signature: copies a linked logo and text that open the inbox", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await addAuthenticator(page);
  const inboxUrl = await createInbox(page, "alice@example.com");
  await expect(page.getByTestId("signature-preview")).toHaveAttribute("href", inboxUrl);

  await page.getByTestId("copy-signature").click();
  await expect(page.getByTestId("copy-signature")).toHaveText("Copied");
  const { html, text } = await page.evaluate(async () => {
    const item = (await navigator.clipboard.read())[0]!;
    return {
      html: await (await item.getType("text/html")).text(),
      text: await (await item.getType("text/plain")).text(),
    };
  });
  expect(text).toBe(`Send me a secure message: ${inboxUrl}`);

  // Paste it like a mail program would, then follow the logo link.
  await page.setContent(html);
  const logo = page.locator("a:has(img)");
  const src = await logo.locator("img").getAttribute("src");
  expect((await page.request.get(src!)).headers()["content-type"]).toBe("image/png");
  const reader = await context.newPage();
  await reader.goto((await logo.getAttribute("href"))!);
  await expect(reader.getByRole("heading", { level: 1 })).toHaveText("Secure message to alice@example.com");
});

test("an e-mail address is required to create an inbox", async ({ page }) => {
  await addAuthenticator(page);
  await page.goto("/#inbox");
  await page.getByTestId("create-inbox").click();
  await expect(page.getByRole("alert")).toContainText("Please enter your e-mail address first.");
  await expect(page.getByTestId("your-email")).toBeFocused();
  await expect(page.getByTestId("inbox-link")).toHaveCount(0);
});

test("a revisit shows your link without a passkey; forgetting it asks again", async ({ page }) => {
  await addAuthenticator(page);
  const inboxUrl = await createInbox(page, "frank@example.com");

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your secure link");
  await expect(page.getByTestId("inbox-link")).toHaveValue(inboxUrl);

  await page.getByTestId("forget-inbox").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create your secure inbox");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create your secure inbox");

  // "I already have an inbox": the passkey brings back both the key and the e-mail.
  await page.getByTestId("your-email").fill("");
  await page.getByTestId("unlock-inbox").click();
  await expect(page.getByTestId("inbox-link")).toHaveValue(inboxUrl);
});
