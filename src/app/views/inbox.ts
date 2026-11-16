/**
 * Your inbox: create it, or see its secure link. Once created or unlocked,
 * this browser remembers the link (see session), so coming back shows it
 * straight away without a passkey prompt. Someone with several e-mail
 * addresses has an inbox for each, and picks the one to share.
 */

import { fingerprint } from "../../crypto";
import { rpIdProblem } from "../../config";
import { PasskeyError } from "../../passkey";
import { h } from "../dom";
import { lang, messagesFor, t, type Lang, type Messages } from "../i18n";
import { appBase, cleanEmail, inboxLink } from "../links";
import { inboxLinkEmail, mailto, signature } from "../mail";
import {
  createInbox,
  emailOf,
  forgetInbox,
  inboxFor,
  knownInbox,
  knownInboxes,
  passkeyErrorMessage,
  sessionEmail,
  setInboxEmail,
  suggestedInbox,
  unlockInbox,
  useInbox,
  type KnownInbox,
} from "../session";
import { actions, button, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

interface Opts {
  /** Someone who asked for your link (from an invitation). */
  reply?: string;
  /** Your own e-mail, if the invitation knew it. */
  email?: string;
}

export function inboxView(opts: Opts): HTMLElement {
  const root = h("div");
  const invited = opts.email ? inboxFor(opts.email) : undefined;
  if (invited) {
    useInbox(invited.publicKey);
  }
  const known = knownInbox();
  // Asked for the link of an address that has no inbox here yet: set it up,
  // with the others a click away.
  root.append(
    known && (invited || !opts.email)
      ? readyView(known, opts, false, root)
      : setupView({ ...opts, email: opts.email ?? sessionEmail() }, root),
  );
  return root;
}

function show(root: HTMLElement, view: HTMLElement): void {
  root.replaceChildren(view);
  root.querySelector("h1")?.focus();
}

function setupView(opts: Opts, root: HTMLElement): HTMLElement {
  const emailInput = h("input", {
    type: "email",
    // Offers an existing inbox passkey right here, before a duplicate is made.
    autocomplete: "email webauthn",
    required: true,
    placeholder: t.common.emailPlaceholder,
    value: opts.email ?? "",
    "data-testid": "your-email",
  });
  const slot = messageSlot();
  const problem = rpIdProblem();
  const adding = knownInboxes().length > 0;

  function showReady(created: boolean): void {
    show(root, readyView(knownInbox()!, opts, created, root));
  }

  async function run(action: () => Promise<unknown>, created: boolean): Promise<void> {
    slot.show(null);
    try {
      await action();
      showReady(created);
    } catch (error) {
      slot.show(notice("error", passkeyErrorMessage(error)));
    }
  }

  /** Picked from the e-mail field's autofill: an inbox that already exists. */
  async function offerExisting(): Promise<void> {
    try {
      if (await suggestedInbox()) {
        showReady(false);
      }
    } catch (error) {
      if (!(error instanceof PasskeyError && error.code === "cancelled")) {
        slot.show(notice("error", passkeyErrorMessage(error)));
      }
    }
  }

  const create = button(
    t.inbox.create,
    () => {
      const email = cleanEmail(emailInput.value);
      if (!email) {
        slot.show(notice("error", t.inbox.emailMissing));
        emailInput.focus();
        return;
      }
      const existing = inboxFor(email);
      if (existing) {
        // Already here: a second inbox for the same address would only confuse.
        useInbox(existing.publicKey);
        showReady(false);
        return;
      }
      return run(() => createInbox(email), true);
    },
    { icon: "key", testId: "create-inbox" },
  );
  const unlock = button(t.inbox.unlock, () => run(unlockInbox, false), {
    variant: "text",
    testId: "unlock-inbox",
  });
  if (problem) {
    create.disabled = unlock.disabled = true;
    slot.show(notice("error", problem));
  } else {
    queueMicrotask(() => void offerExisting());
  }

  return page(
    opts.reply ? notice("info", t.inbox.invited(opts.reply)) : null,
    title(adding ? t.inbox.addTitle : t.inbox.setupTitle, t.inbox.setupLead),
    h(
      "section",
      { class: "card" },
      field(t.common.yourEmail, emailInput, t.inbox.emailHelp),
      actions(create, unlock),
      slot.el,
      h(
        "ul",
        { class: "facts" },
        h("li", null, t.inbox.fact1),
        h("li", null, t.inbox.fact2),
        h("li", null, t.inbox.factRemembered),
        h("li", null, h("strong", null, t.inbox.fact3Strong), t.inbox.fact3),
      ),
    ),
    adding
      ? actions(button(t.inbox.backToLink, () => showReady(false), { variant: "text", testId: "back-to-link" }))
      : null,
  );
}

function readyView(inbox: KnownInbox, opts: Opts, created: boolean, root: HTMLElement): HTMLElement {
  // Only passkeys from before e-mail was required lack it; ask once.
  const emailInput = inbox.email
    ? null
    : h("input", {
        type: "email",
        autocomplete: "email",
        required: true,
        placeholder: t.common.emailPlaceholder,
        value: opts.email ?? "",
        "data-testid": "link-email",
      });
  const linkInput = h("input", { type: "text", readOnly: true, "data-testid": "inbox-link" });
  const others = knownInboxes();
  const address = h(
    "select",
    { "data-testid": "inbox-address" },
    ...others.map((other, i) =>
      h("option", { value: String(i), selected: other === inbox }, emailOf(other) ?? t.inbox.unnamed),
    ),
    h("option", { value: "add" }, t.inbox.addAddress),
  );
  address.addEventListener("change", () => {
    const picked = others[Number(address.value)];
    if (picked) {
      useInbox(picked.publicKey);
      show(root, readyView(picked, opts, false, root));
    } else {
      show(root, setupView({ reply: opts.reply }, root));
    }
  });
  const share = linkButton(opts.reply ? t.inbox.sendLinkTo(opts.reply) : t.inbox.shareLink, "#", {
    icon: "mail",
    testId: "share-link",
  });
  const slot = messageSlot();
  const codeSlot = h("div");
  let emailLang: Lang = lang();
  const sig = signatureCard(link, () => emailLang);

  function email(): string | undefined {
    const value = inbox.email ?? emailInput?.value;
    return value ? cleanEmail(value) : undefined;
  }
  function link(): string {
    return inboxLink(appBase(), inbox.publicKey, email());
  }
  let sequence = 0;
  async function update(): Promise<void> {
    const mine = ++sequence;
    const own = email();
    if (own && !inbox.email) {
      setInboxEmail(own);
    }
    linkInput.value = link();
    sig.preview.href = link();
    const m = await messagesFor(emailLang);
    if (mine !== sequence) {
      return; // a newer change won
    }
    share.href = mailto(opts.reply, inboxLinkEmail(link(), m));
    sig.render(m);
  }
  emailInput?.addEventListener("input", () => void update());
  linkInput.addEventListener("focus", () => linkInput.select());
  void update();

  share.addEventListener("click", () => {
    slot.show(notice("success", t.inbox.shared));
  });

  void fingerprint(inbox.publicKey).then((code) => codeSlot.replaceChildren(securityCode(code, t.inbox.codeHelp)));

  const forget = button(
    t.inbox.forget,
    () => {
      forgetInbox(inbox.publicKey);
      const next = knownInbox();
      show(root, next ? readyView(next, opts, false, root) : setupView({ email: inbox.email }, root));
    },
    { variant: "text", testId: "forget-inbox" },
  );

  return page(
    title(created ? t.inbox.readyTitle : t.inbox.linkTitle, t.inbox.readyLead),
    h(
      "section",
      { class: "card" },
      inbox.email || others.length > 1 ? field(t.common.yourEmail, address) : null,
      emailInput ? field(t.common.yourEmail, emailInput, t.inbox.linkEmailHelp) : null,
      field(t.inbox.linkLabel, linkInput),
      field(
        t.common.emailLanguage,
        languageSelect(emailLang, (code) => {
          emailLang = code;
          void update();
        }, "link-language"),
      ),
      actions(share, copyButton(t.inbox.copyLink, link, { testId: "copy-link" })),
      slot.el,
      codeSlot,
    ),
    sig.card,
    actions(forget),
  );
}

/**
 * A ready-made signature, so anyone who gets an e-mail from you can write back
 * securely. It's written in the chosen e-mail language.
 */
function signatureCard(
  link: () => string,
  emailLang: () => Lang,
): { card: HTMLElement; preview: HTMLAnchorElement; render: (m: Messages) => void } {
  const image = `${appBase()}sigill-mail.png`;
  const text = h("strong");
  const tagline = h("small");
  const preview = h(
    "a",
    { class: "signature", href: "#", "data-testid": "signature-preview" },
    h("img", { src: image, alt: "", width: 32, height: 32 }),
    h("span", null, text, tagline),
  );
  let current: Messages = t;
  const card = h(
    "section",
    { class: "card" },
    h("h2", null, t.inbox.signatureTitle),
    h("p", { class: "help" }, t.inbox.signatureLead),
    preview,
    actions(copyButton(t.inbox.copySignature, () => signature(link(), image, current), { testId: "copy-signature" })),
    h("p", { class: "help" }, t.inbox.signatureHelp),
  );
  function render(m: Messages): void {
    current = m;
    preview.lang = emailLang();
    text.textContent = m.mail.signature;
    tagline.textContent = m.mail.signatureTagline;
  }
  render(t);
  return { card, preview, render };
}
