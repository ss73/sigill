# Send Me Safe

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

## Layout

- `src/crypto/` – encoding, X25519 inbox keys, v1 message envelope (no DOM)
- `src/passkey.ts` – passkey creation/unlock and PRF evaluation
- `src/config.ts` – relying party ID
- `src/main.ts`, `index.html` – proof-of-concept page
- `e2e/` – Playwright tests

## Device test matrix

Passkeys created on `localhost` only work on that machine. Phones need the
site served over HTTPS from a real domain.

For each combination: create (or unlock) an inbox, encrypt, decrypt, then
unlock on another device with the same synced passkey and compare the
fingerprint. Paste the page's test report into notes.

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
