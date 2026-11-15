import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

// Strict Content Security Policy for production builds: only our own scripts,
// styles and assets, no third-party origins. Not applied in dev, where Vite
// needs inline styles and a websocket for hot reload.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

function contentSecurityPolicy(): Plugin {
  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="utf-8">',
        `<meta charset="utf-8">\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`,
      );
    },
  };
}

export default defineConfig({
  // Sub-path the site is served from, e.g. "/sigill/" on GitHub Pages
  // without a custom domain. Defaults to the root.
  base: process.env.BASE_PATH ?? "/",
  plugins: [contentSecurityPolicy()],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        app: "index.html",
        // Passkey diagnostics page for the device test matrix.
        poc: "poc.html",
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
