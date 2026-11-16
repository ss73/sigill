# Sigill

Encrypted messages over e-mail without S/MIME. Recipients hold an inbox key
derived from a passkey (WebAuthn PRF extension); senders need nothing.
Everything runs in the browser and nothing is stored by the page.

The original 2020 prototype is kept under the `prototype-2020` git tag.

## Development

```sh
npm install
npm run dev          # http://localhost:5173
npm test             # crypto unit tests (Vitest)
npm run test:e2e     # browser tests with a virtual passkey (Playwright)
npm run test:e2e:prod  # same, against the production build and its CSP
npm run build        # requires VITE_RP_ID, e.g. VITE_RP_ID=safe.example.com
```

First-time e2e setup: `npx playwright install chromium`.

`VITE_RP_ID` is the domain every inbox passkey is bound to. Choose it once:
changing it later makes existing inboxes unreachable.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: unit tests, e2e tests
against the production build, then a deploy to GitHub Pages at
https://sigill.x509.se/ (the repo's custom domain; DNS only, not proxied, so
nothing between GitHub and the browser can alter the code).

Sigill needs a domain of its own: every site on a domain can use its
passkeys and storage, and `*.github.io` is shared by all of an account's
Pages projects. To host your own copy, give it a subdomain and set
`VITE_RP_ID` to it.

## How it works for users

- **Receive:** Home → *Receive secure messages* → e-mail (required) →
  *Create my inbox* → passkey prompt → *Share my link*. The browser then
  remembers the inbox's public part (link key and e-mail, in localStorage),
  so a revisit shows the link without a prompt; *Forget this inbox on this
  browser* removes it. The e-mail is also stored in the passkey's user ID,
  so unlocking on another device brings it back.
- **Send:** click someone's secure link → write → *Send by e-mail* (the mail
  program opens with the encrypted link ready; long messages are copied for
  pasting instead).
- **Read:** click the link in the e-mail → *Open message* → passkey prompt.
- **Reply:** *Reply securely* under the message → write → *Send by e-mail*.
  Senders who have an inbox include it in the (encrypted) message; this is
  on by default whenever the browser knows their inbox, or added with one passkey
  confirmation, so a conversation can go back and forth one click at a time.
- **Signature:** *Copy signature* on your link page → paste into Gmail, Outlook
  or Apple Mail signature settings. The seal and text link to your inbox.
- **First contact:** Home → *Send a secure message* → *Ask by e-mail*. The
  invitation leads the recipient through setup and ends with a one-click
  *Send my link to …*.
- **Languages:** English, Danish, German, Spanish, French, Italian, Dutch,
  Norwegian, Polish, Portuguese, Finnish and Swedish. The UI follows the
  browser, can be switched at the top of every page (remembered in
  localStorage), and each e-mail can be written in the recipient's language.
  Links in those e-mails carry `l=<lang>`, so the page opens in the same
  language. Texts live in `src/app/i18n/`; `en.ts` is the source and the
  others are type-checked and tested against it.

All data travels in the URL fragment (`#to=…`, `#m=…`), which browsers
never send to the server.

## Layout

- `src/crypto/` – encoding, X25519 inbox keys, v1 message envelope (no DOM)
- `src/passkey.ts` – passkey creation/unlock and PRF evaluation
- `src/config.ts` – relying party ID
- `src/app/` – the app: routing (`links.ts`), e-mail templates (`mail.ts`),
  compressed message payload (`payload.ts`), in-memory session, views
- `src/poc/`, `poc.html` – passkey diagnostics page, served at `/poc.html`,
  used for the device test matrix below
- `e2e/` – Playwright tests

## Device test matrix

Passkeys created on `localhost` only work on that machine. Phones need the
site served over HTTPS from a real domain.

For each combination: create (or unlock) an inbox, encrypt, decrypt, then
unlock on another device with the same synced passkey and compare the
fingerprint. Use `/poc.html` and paste its test report into notes.

| Platform | Browser | Passkey provider | Result |
|---|---|---|---|
| macOS | Safari | iCloud Keychain | ✅ Safari 26.5, 2026-11-13: unlocked the passkey created in Firefox, same fingerprint (browser does not report PRF capability up front) |
| macOS | Chrome | Google Password Manager | |
| macOS | Chrome | iCloud Keychain | ✅ Chrome 156, 2026-11-13: unlocked the passkey created in Firefox, same fingerprint |
| macOS | Firefox | iCloud Keychain | ✅ Firefox 152, 2026-11-13: PRF at create (1 prompt); unlock after reload gives same fingerprint |
| Windows | Edge / Chrome | Windows Hello | |
| Windows | Firefox | Windows Hello | |
| Linux | Chrome | Google Password Manager | |
| Linux | Chrome / Firefox | 1Password / Bitwarden | |
| Linux | Chrome / Firefox | YubiKey | |
| iOS | Safari | iCloud Keychain | |
| Android | Chrome | Google Password Manager | |
| Any desktop | Chrome | Phone via QR code | |
