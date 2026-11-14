/** Create a secure inbox, or unlock an existing one to get its link again. */

import { fingerprint, type InboxKeyPair } from "../../crypto";
import { rpIdProblem } from "../../config";
import { h } from "../dom";
import { appBase, inboxLink, isEmail } from "../links";
import { SIGNATURE_TEXT, inboxLinkEmail, mailto, signature } from "../mail";
import { createInbox, currentInbox, passkeyErrorMessage, sessionEmail, setSessionEmail, unlockInbox } from "../session";
import { actions, backLink, button, copyButton, field, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

export function inboxView(opts: { reply?: string; email?: string }): HTMLElement {
  const root = h("div");
  const inbox = currentInbox();
  const known = { ...opts, email: opts.email ?? sessionEmail() };
  root.append(inbox ? readyView(inbox, known, false) : setupView(known, root));
  return root;
}

function setupView(opts: { reply?: string; email?: string }, root: HTMLElement): HTMLElement {
  const emailInput = h("input", {
    type: "email",
    autocomplete: "email",
    placeholder: "you@email.com",
    value: opts.email ?? "",
    "data-testid": "your-email",
  });
  const slot = messageSlot();
  const problem = rpIdProblem();

  async function run(action: () => Promise<InboxKeyPair>, created: boolean): Promise<void> {
    slot.show(null);
    try {
      const inbox = await action();
      root.replaceChildren(readyView(inbox, { ...opts, email: emailInput.value.trim() || opts.email }, created));
      root.querySelector("h1")?.focus();
    } catch (error) {
      slot.show(notice("error", passkeyErrorMessage(error)));
    }
  }

  const create = button("Create my inbox", () => run(() => createInbox(emailInput.value.trim()), true), {
    icon: "key",
    testId: "create-inbox",
  });
  const unlock = button("I already have an inbox: show my link", () => run(unlockInbox, false), {
    variant: "text",
    testId: "unlock-inbox",
  });
  if (problem) {
    create.disabled = unlock.disabled = true;
    slot.show(notice("error", problem));
  }

  return page(
    backLink(),
    opts.reply
      ? notice("info", h("strong", null, opts.reply), " would like to send you something securely. Create your inbox below and send them your link. It only takes a moment.")
      : null,
    title("Create your secure inbox", "Your inbox is protected by a passkey in your password manager. There's no account and no password to remember."),
    h(
      "section",
      { class: "card" },
      field("Your e-mail address", emailInput, "Optional. It's added to your link so that messages are addressed to you automatically."),
      actions(create),
      slot.el,
      h(
        "ul",
        { class: "facts" },
        h("li", null, "You'll be asked to save a passkey. Confirm with Face ID, fingerprint or your device PIN."),
        h("li", null, "Your passkey syncs to your other devices (iCloud Keychain, Google Password Manager, 1Password…), so you can open messages anywhere."),
        h("li", null, h("strong", null, "Don't delete the passkey:"), " messages sent to this inbox can only be opened with it."),
      ),
      actions(unlock),
    ),
  );
}

function readyView(inbox: InboxKeyPair, opts: { reply?: string; email?: string }, created: boolean): HTMLElement {
  const emailInput = h("input", {
    type: "email",
    autocomplete: "email",
    placeholder: "you@email.com",
    value: opts.email ?? "",
    "data-testid": "link-email",
  });
  const linkInput = h("input", { type: "text", readOnly: true, "data-testid": "inbox-link" });
  const share = linkButton(opts.reply ? `Send my link to ${opts.reply}` : "Share my link by e-mail", "#", {
    icon: "mail",
    testId: "share-link",
  });
  const slot = messageSlot();
  const codeSlot = h("div");
  const sig = signatureCard(link);

  function link(): string {
    const email = emailInput.value.trim();
    return inboxLink(appBase(), inbox.publicKey, isEmail(email) ? email : undefined);
  }
  function update(): void {
    const email = emailInput.value.trim();
    if (isEmail(email)) {
      setSessionEmail(email);
    }
    linkInput.value = link();
    share.href = mailto(opts.reply, inboxLinkEmail(link()));
    sig.preview.href = link();
  }
  emailInput.addEventListener("input", update);
  linkInput.addEventListener("focus", () => linkInput.select());
  update();

  share.addEventListener("click", () => {
    slot.show(notice("success", "Your e-mail program should open with your link ready to send."));
  });

  void fingerprint(inbox.publicKey).then((code) =>
    codeSlot.replaceChildren(
      securityCode(code, "People who write to you see this code next to your name. If you read it out to each other and it matches, they know the link really is yours."),
    ),
  );

  return page(
    backLink(),
    title(
      created ? "Your inbox is ready" : "Your secure link",
      "Anyone with this link can send you messages that only you can read. It's safe to share: it can't be used to read anything.",
    ),
    h(
      "section",
      { class: "card" },
      field("Your secure link", linkInput),
      actions(share, copyButton("Copy link", link, { testId: "copy-link" })),
      slot.el,
      opts.email ? null : field("Your e-mail address", emailInput, "Optional. Added to the link so messages are addressed to you automatically."),
      codeSlot,
    ),
    sig.card,
  );
}

/** A ready-made signature, so anyone who gets an e-mail from you can write back securely. */
function signatureCard(link: () => string): { card: HTMLElement; preview: HTMLAnchorElement } {
  const image = `${appBase()}sigill-mail.png`;
  const preview = h(
    "a",
    { class: "signature", href: "#", "data-testid": "signature-preview" },
    h("img", { src: image, alt: "", width: 32, height: 32 }),
    h("span", null, h("strong", null, SIGNATURE_TEXT), h("small", null, "Encrypted end to end with Sigill")),
  );
  const card = h(
    "section",
    { class: "card" },
    h("h2", null, "Add it to your e-mail signature"),
    h("p", { class: "help" }, "Then everyone who gets an e-mail from you can write back securely with one click."),
    preview,
    actions(copyButton("Copy signature", () => signature(link(), image), { testId: "copy-signature" })),
    h(
      "p",
      { class: "help" },
      "Paste it into your signature settings: in Gmail under Settings → Signature, in Outlook under Settings → Mail → Compose and reply, ",
      "in Apple Mail under Settings → Signatures.",
    ),
  );
  return { card, preview };
}
