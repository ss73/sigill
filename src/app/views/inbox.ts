/** Create a secure inbox, or unlock an existing one to get its link again. */

import { fingerprint, type InboxKeyPair } from "../../crypto";
import { rpIdProblem } from "../../config";
import { h } from "../dom";
import { lang, messagesFor, t, type Lang, type Messages } from "../i18n";
import { appBase, inboxLink, isEmail } from "../links";
import { inboxLinkEmail, mailto, signature } from "../mail";
import { createInbox, currentInbox, passkeyErrorMessage, sessionEmail, setSessionEmail, unlockInbox } from "../session";
import { actions, backLink, button, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

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
    placeholder: t.common.emailPlaceholder,
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

  const create = button(t.inbox.create, () => run(() => createInbox(emailInput.value.trim()), true), {
    icon: "key",
    testId: "create-inbox",
  });
  const unlock = button(t.inbox.unlock, () => run(unlockInbox, false), {
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
      ? notice("info", t.inbox.invited(opts.reply))
      : null,
    title(t.inbox.setupTitle, t.inbox.setupLead),
    h(
      "section",
      { class: "card" },
      field(t.common.yourEmail, emailInput, t.inbox.emailHelp),
      actions(create),
      slot.el,
      h(
        "ul",
        { class: "facts" },
        h("li", null, t.inbox.fact1),
        h("li", null, t.inbox.fact2),
        h("li", null, h("strong", null, t.inbox.fact3Strong), t.inbox.fact3),
      ),
      actions(unlock),
    ),
  );
}

function readyView(inbox: InboxKeyPair, opts: { reply?: string; email?: string }, created: boolean): HTMLElement {
  const emailInput = h("input", {
    type: "email",
    autocomplete: "email",
    placeholder: t.common.emailPlaceholder,
    value: opts.email ?? "",
    "data-testid": "link-email",
  });
  const linkInput = h("input", { type: "text", readOnly: true, "data-testid": "inbox-link" });
  const share = linkButton(opts.reply ? t.inbox.sendLinkTo(opts.reply) : t.inbox.shareLink, "#", {
    icon: "mail",
    testId: "share-link",
  });
  const slot = messageSlot();
  const codeSlot = h("div");
  let emailLang: Lang = lang();
  const sig = signatureCard(link, () => emailLang);

  function link(): string {
    const email = emailInput.value.trim();
    return inboxLink(appBase(), inbox.publicKey, isEmail(email) ? email : undefined);
  }
  let sequence = 0;
  async function update(): Promise<void> {
    const mine = ++sequence;
    const email = emailInput.value.trim();
    if (isEmail(email)) {
      setSessionEmail(email);
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
  emailInput.addEventListener("input", () => void update());
  linkInput.addEventListener("focus", () => linkInput.select());
  void update();

  share.addEventListener("click", () => {
    slot.show(notice("success", t.inbox.shared));
  });

  void fingerprint(inbox.publicKey).then((code) =>
    codeSlot.replaceChildren(
      securityCode(code, t.inbox.codeHelp),
    ),
  );

  return page(
    backLink(),
    title(
      created ? t.inbox.readyTitle : t.inbox.linkTitle,
      t.inbox.readyLead,
    ),
    h(
      "section",
      { class: "card" },
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
      opts.email ? null : field(t.common.yourEmail, emailInput, t.inbox.linkEmailHelp),
      codeSlot,
    ),
    sig.card,
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
