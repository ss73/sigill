/**
 * English: the source text. Every other language must provide the same keys
 * with the same shapes (see Messages), so a missing translation fails the
 * build. Functions take the parts that vary, so each language can order and
 * inflect them freely. `email` parameters are absent when the address is unknown.
 */
export const en = {
  common: {
    back: "Back",
    copied: "Copied",
    copyFailed: "Copy failed: select and copy manually",
    securityCode: "Security code",
    yourEmail: "Your e-mail address",
    emailPlaceholder: "you@email.com",
    language: "Language",
    emailLanguage: "Language of the e-mail",
    theme: "Theme",
    themeAuto: "Match device",
    themeLight: "Light",
    themeDark: "Dark",
    tooOld: "This browser is too old for Sigill. Please update it, or use a current Safari, Chrome, Edge or Firefox.",
  },

  home: {
    lead: "Private messages over ordinary e-mail. Only the person you write to can read them.",
    choicesLabel: "What do you want to do?",
    sendTitle: "Send a secure message",
    sendText: "Write to someone confidentially",
    receiveTitle: "Receive secure messages",
    receiveText: "Get your own secure link in 30 seconds",
    howTitle: "How it works",
    step1Strong: "The recipient creates an inbox",
    step1: " with a passkey: Face ID, fingerprint or device PIN. No account, no password.",
    step2Strong: "They share their secure link",
    step2: " with anyone who should be able to write to them.",
    step3Strong: "Messages travel as links in normal e-mails.",
    step3: " They are encrypted in your browser and only the recipient's passkey can open them.",
    nothingStored: "Nothing is stored on any server. ",
    wontOpen: "Have a message link that won't open?",
  },

  send: {
    title: "Send a secure message",
    lead: "To write securely, you need the recipient's secure link.",
    haveLink: "I have their secure link",
    pasteLabel: "Paste the link here",
    pasteHelp: "Or simply click the link in their e-mail.",
    notALink: "That doesn't look like a secure link. It should contain “#to=”.",
    noLinkYet: "They don't have one yet",
    noLinkText: "Send them a short invitation. They create their inbox in half a minute and send their link back to you.",
    theirEmail: "Their e-mail address",
    theirEmailPlaceholder: "their@email.com",
    yourEmailOptional: "Your e-mail address (optional)",
    yourEmailHelp: "So they can send their link straight back to you.",
    ask: "Ask by e-mail",
    copyInvitation: "Copy invitation",
    asked: "Your e-mail program should open with the invitation ready to send. When they reply with their secure link, just click it to write your message.",
  },

  compose: {
    title: (email?: string) => (email ? `Secure message to ${email}` : "Secure message to the owner of this link"),
    lead: "Write your message below. It is encrypted on this device before it leaves it.",
    messageLabel: "Message",
    placeholder: "Write your message…",
    sendEmail: "Send by e-mail",
    copyInstead: "Copy instead",
    encryptsAsYouType: "Your message is encrypted as you type.",
    encrypted: (email?: string) => (email ? `Encrypted. Only ${email} can read it.` : "Encrypted. Only the owner of this link can read it."),
    tooLongForMailto: "It's long, so it will be copied for you to paste into the e-mail.",
    sent: (email?: string) =>
      "Your e-mail program should open with the message ready. Just press Send. " +
      (email ? `Nothing opened? The message has been copied: paste it into a new e-mail to ${email}.` : "Nothing opened? The message has been copied: paste it into a new e-mail."),
    copiedForPaste: "Your message was copied. Paste it into the e-mail that opens (⌘V or Ctrl+V) and press Send.",
    codeHelp: (email?: string) =>
      `For extra certainty, ask ${email ?? "the recipient"} by phone or in person whether their inbox shows the same code. ` +
      "If it matches, nobody has swapped the link on the way.",
    replyOn: "Secure reply is on. ",
    replyAddress: "Replies go to",
    replyOnText: (email?: string) => `${email ?? "The recipient"} can answer with one click, and the reply is encrypted for your inbox. `,
    replyRemove: "Remove",
    replyAdd: "Let them reply securely",
    replyAddHelp: "Adds your secure inbox to the message, so their answer is encrypted too. You confirm with your passkey.",
    replyNoInbox: "No secure inbox yet? Create one now: it takes one passkey confirmation, and your message stays as it is. ",
    replyCreate: "Create my inbox",
    replyHaveInbox: "I already have an inbox",
    brokenTitle: "This secure link is incomplete",
    brokenText: "Part of the link seems to be missing. E-mail programs sometimes break long links. Ask the person to send their secure link again, or copy the whole link and paste it on the ",
    brokenSendPage: "Send page",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} would like to send you something securely. Create your inbox below and send them your link. It only takes a moment.`,
    setupTitle: "Create your secure inbox",
    setupLead: "Your inbox is protected by a passkey in your password manager. There's no account and no password to remember.",
    emailHelp: "It's added to your link so that messages are addressed to you automatically.",
    create: "Create my inbox",
    emailMissing: "Please enter your e-mail address first.",
    addAddress: "Add another address…",
    addTitle: "Add another address",
    backToLink: "Back to my link",
    unnamed: "Inbox without an address",
    forget: "Forget this inbox on this browser",
    unlock: "I already have an inbox: show my link",
    fact1: "You'll be asked to save a passkey. Confirm with Face ID, fingerprint or your device PIN.",
    fact2: "Your passkey syncs to your other devices (iCloud Keychain, Google Password Manager, 1Password…), so you can open messages anywhere.",
    fact3Strong: "Don't delete the passkey:",
    fact3: " messages sent to this inbox can only be opened with it.",
    factRemembered: "This browser remembers your secure link, so you can share it without your passkey. The key itself stays in the passkey.",
    readyTitle: "Your inbox is ready",
    linkTitle: "Your secure link",
    readyLead: "Anyone with this link can send you messages that only you can read. It's safe to share: it can't be used to read anything.",
    linkLabel: "Your secure link",
    sendLinkTo: (email: string) => `Send my link to ${email}`,
    shareLink: "Share my link by e-mail",
    copyLink: "Copy link",
    shared: "Your e-mail program should open with your link ready to send.",
    linkEmailHelp: "Added to the link so messages are addressed to you automatically.",
    codeHelp: "People who write to you see this code next to your name. If you read it out to each other and it matches, they know the link really is yours.",
    signatureTitle: "Add it to your e-mail signature",
    signatureLead: "Then everyone who gets an e-mail from you can write back securely with one click.",
    copySignature: "Copy signature",
    signatureHelp: "Paste it into your signature settings: in Gmail under Settings → Signature, in Outlook under Settings → Mail → Compose and reply, in Apple Mail under Settings → Signatures.",
  },

  open: {
    pasteTitle: "Open a secure message",
    pasteLead: "If clicking the link in the e-mail didn't work, copy the whole link and paste it here.",
    pasteLabel: "Paste the message link",
    notALink: "That doesn't look like a message link. It should contain “#m=”.",
    incompleteTitle: "This message link is incomplete",
    incomplete: "Part of the link seems to be missing. E-mail programs sometimes break long links. Copy the complete link from the e-mail and paste it below, or ask the sender to send it again.",
    damaged: "This message link is incomplete or damaged. E-mail programs sometimes break long links. Copy the complete link from the e-mail and paste it below, or ask the sender to send it again.",
    wrongInbox: "This message wasn't sent to the inbox you unlocked. If you have more than one Sigill passkey, try again and choose another one.",
    receivedTitle: "You've received a secure message",
    receivedLead: "It can only be opened with the passkey of your secure inbox.",
    instructions: "Click the button and confirm with Face ID, fingerprint or your device PIN.",
    openButton: "Open message",
    notForYou: "Don't have a secure inbox? Then this message wasn't meant for you, or the sender used the wrong link.",
    messageTitle: "Your secure message",
    from: (email: string) => `From ${email}`,
    reply: "Reply securely",
    copyText: "Copy text",
    noReply: "The sender didn't include a secure reply address. To answer securely, ask them for their secure link.",
    staysEncrypted: "This message stays encrypted in your e-mail. Open the link again whenever you want to read it. ",
    showMyLink: "Show my secure link",
  },

  passkey: {
    cancelled: "The passkey request was cancelled. Nothing has changed, so you can simply try again.",
    prfUnsupported:
      "Your browser or password manager can't hold a secure inbox yet. Try Safari, Chrome or Edge with your device's built-in passkeys, or a recent 1Password or Bitwarden.",
    unavailable: "This browser doesn't support passkeys. Please use an up-to-date Safari, Chrome, Edge or Firefox.",
    notSigill:
      "That passkey isn’t a Sigill inbox: it belongs to another site on the same address. Nothing has changed. Try again and pick the passkey named after your e-mail address.",
    failed: (details: string) => `Something went wrong with the passkey: ${details}`,
  },

  /** Texts that go into e-mails, in the language chosen for the recipient. */
  mail: {
    messageSubject: "A secure message for you",
    messageBody: (link: string) =>
      "Hi,\n\n" +
      "I've sent you a secure message. Click the link to open it with your passkey:\n\n" +
      `${link}\n\n` +
      "Only you can read it: it is encrypted, and the key never leaves your password manager.",
    inviteSubject: "Can I send you something securely?",
    inviteBody: (link: string) =>
      "Hi,\n\n" +
      "I'd like to send you something confidential. Please create a free secure inbox. " +
      "It takes half a minute, needs no account, and only you will be able to read what I send:\n\n" +
      `${link}\n\n` +
      "When you're done, send me your secure link.\n\n" +
      "Thanks!",
    linkSubject: "My secure link",
    linkBody: (link: string) =>
      "Hi,\n\n" +
      "Here is my secure link. Use it to send me confidential messages that only I can read:\n\n" +
      `${link}\n\n` +
      "Thanks!",
    signature: "Send me a secure message",
    signatureTagline: "Encrypted end to end with Sigill",
  },
};

type Shape<T> = { [K in keyof T]: T[K] extends (...args: infer A) => string ? (...args: A) => string : T[K] extends string ? string : Shape<T[K]> };

export type Messages = Shape<typeof en>;
