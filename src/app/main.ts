import { parseRoute } from "./links";
import { notice } from "./ui";
import { brokenLinkView, composeView } from "./views/compose";
import { homeView } from "./views/home";
import { inboxView } from "./views/inbox";
import { openView } from "./views/open";
import { sendView } from "./views/send";

const app = document.getElementById("app")!;

function view(): HTMLElement {
  const route = parseRoute(location.hash);
  switch (route.name) {
    case "home":
      return homeView();
    case "send":
      return sendView();
    case "compose":
      return composeView(route.to, route.email);
    case "broken-link":
      return brokenLinkView();
    case "inbox":
      return inboxView(route);
    case "open":
      return openView(route.envelope);
  }
}

async function browserSupported(): Promise<boolean> {
  try {
    await crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveBits"]);
    return typeof CompressionStream === "function";
  } catch {
    return false;
  }
}

function render(): void {
  app.replaceChildren(view());
  window.scrollTo(0, 0);
  app.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
}

if (await browserSupported()) {
  window.addEventListener("hashchange", render);
  render();
} else {
  app.replaceChildren(
    notice("error", "This browser is too old for Sigill. Please update it, or use a current Safari, Chrome, Edge or Firefox."),
  );
}
