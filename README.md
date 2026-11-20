# <img src="src/app/sigill.svg" width="40" height="40" alt="" align="top"> Sigill

**Private messages over ordinary e-mail.** Write in your browser, send the
encrypted message as a link by e-mail, and only the recipient can open it,
with their passkey (Face ID, fingerprint or device PIN).

### → [Open Sigill at sigill.x509.se](https://sigill.x509.se/)

No app to install, no account and no password. Messages are encrypted in
your browser and travel inside the e-mail itself, so there's no server that
stores them.

## How it works

- **Get your secure link.** Choose *Receive secure messages*, enter your
  e-mail address and confirm with your passkey. You get a link that lets
  people write to you securely. Share it by e-mail or add it to your e-mail
  signature.
- **Write to someone.** Click their secure link, write your message and
  choose *Send by e-mail*. Your mail program opens with the encrypted link
  ready to send. To write to someone who has no link yet, choose *Send a
  secure message* → *Ask by e-mail*: they're guided through setup and send
  their link back with one click.
- **Read a message.** Click the link in the e-mail and confirm with your
  passkey.
- **Reply.** *Reply securely* under the message. If you have a secure link
  yourself, it's included in your messages, so a conversation can go back
  and forth one click at a time.

## Good to know

- **Security codes.** Every secure link has a code and a small picture drawn
  from it. If you and the other person compare the code (by phone, say) and
  it matches, you know the link really is theirs. Sigill also remembers the
  links of people you write with and warns if someone's link suddenly
  changes.
- **Several addresses.** You can have one secure inbox per e-mail address
  and switch between them on your link page. Replies come from the address
  the message was sent to.
- **On a new device.** Passkeys synced by your password manager (iCloud
  Keychain, Google Password Manager and others) work on all your devices.
  A passkey that isn't synced works only on the device where it was made.
- **Settings.** The ⚙ menu at the top chooses light or dark mode and whether
  this browser remembers the people you write with.
- **Languages.** English, Danish, Dutch, Finnish, French, German, Italian,
  Norwegian, Polish, Portuguese, Spanish and Swedish. Each e-mail can be
  written in the recipient's language.

## Privacy and security

- Messages are encrypted in your browser (X25519 and AES-256-GCM). The key
  that opens them is derived from your passkey (the WebAuthn PRF extension)
  each time you unlock, and is never stored or sent anywhere.
- The page is a static site on GitHub Pages with no backend. Everything a
  link carries is in the part after `#`, which browsers never send to a
  server.
- The browser remembers only public things: your link and those of people
  you write with. Both can be cleared at any time.
- Anyone who can use your passkey can read your messages, so protect it as
  you would your e-mail account.

## Where it works

Sigill needs a passkey provider that supports the PRF extension. Tested so
far:

| Platform | Browser | Passkey saved in | |
|---|---|---|---|
| macOS | Safari | iCloud Keychain | ✅ |
| macOS | Chrome | iCloud Keychain | ✅ |
| macOS | Chrome | Google Password Manager | ✅ |
| macOS | Firefox | iCloud Keychain | ✅ |
| Windows | Chrome | Windows Hello | ✅ |
| Linux | Chrome | Google Password Manager | ✅ |
| iOS | Safari | iCloud Keychain | ✅ |

Not yet tested: Android, Edge, Firefox on Windows and Linux, third-party
password managers (1Password, Bitwarden and others), security keys such as
YubiKey, and using a phone via QR code.

If it doesn't work for you, please
[open an issue](https://github.com/ss73/sigill/issues) with your operating
system, browser, where the passkey is saved and the message you saw. The
diagnostics page at [sigill.x509.se/poc.html](https://sigill.x509.se/poc.html)
gives a report you can paste in.

## For developers

### Running it

```sh
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests (Vitest)
npm run test:e2e     # browser tests with a virtual passkey (Playwright)
npm run test:e2e:prod  # same, against the production build and its CSP
npm run build        # requires VITE_RP_ID, e.g. VITE_RP_ID=safe.example.com
```

First-time e2e setup: `npx playwright install chromium`.

`VITE_RP_ID` is the domain every inbox passkey is bound to. Choose it once:
changing it later makes existing inboxes unreachable. Passkeys created on
`localhost` only work on that machine; phones need the site served over
HTTPS from a real domain.

### Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: unit tests, e2e tests
against the production build, then a deploy to GitHub Pages at
https://sigill.x509.se/ (the repo's custom domain; DNS only, not proxied, so
nothing between GitHub and the browser can alter the code).

Sigill needs a domain of its own: every site on a domain can use its
passkeys and storage, and `*.github.io` is shared by all of an account's
Pages projects. To host your own copy, give it a subdomain and set
`VITE_RP_ID` to it.

### Links

All data travels in the URL fragment:

```
#to=<inbox public key>&e=<owner e-mail>             write to an inbox
#c=<checksum>&m=<envelope>&l=<lang>                 open a message
#inbox&reply=<asker e-mail>&e=<e-mail>&l=<lang>     create/show your inbox
```

`l` is the language the e-mail was written in, so the page opens in the
same language. `c` is a CRC-32 of the envelope and comes first, because mail
programs cut long links at the end: a damaged link is reported as such
before any passkey prompt, and a message that still won't open is known to
be for another inbox. Message links made before `c` existed still open.

### Details

- **Inboxes:** one passkey per e-mail address. Its user ID is
  `sigill:<e-mail>#<random>`, so unlocking on another device brings the
  address back, and passkeys made by other sites on the same domain aren't
  taken for inboxes. The browser keeps each inbox's public key and e-mail in
  localStorage (`sigill.inboxes`), so a revisit shows the link without a
  prompt.
- **People you write with** (`sigill.contacts`): links written to and reply
  links in opened messages, with the e-mail language last used. A link that
  claims a known address with a different key is held back with both
  security codes until the user picks one; a message whose reply link
  contradicts the known one is flagged.
- **Key pictures:** a mirrored 5×5 pattern from the code's first 15 bits in
  one of eight colours (18 bits in all). For recognition only; the code is
  what proves a link.
- **Languages:** texts live in `src/app/i18n/`; `en.ts` is the source and
  the others are type-checked and tested against it.

### Layout

- `src/crypto/` – encoding, X25519 inbox keys, v1 message envelope (no DOM)
- `src/passkey.ts` – passkey creation/unlock and PRF evaluation
- `src/config.ts` – relying party ID
- `src/app/` – the app: routing (`links.ts`), e-mail templates (`mail.ts`),
  compressed message payload (`payload.ts`), in-memory session, views
- `src/poc/`, `poc.html` – passkey diagnostics page, served at `/poc.html`
- `public/` – favicons and the e-mail signature image
- `e2e/` – Playwright tests

The original 2020 prototype is kept under the `prototype-2020` git tag.
