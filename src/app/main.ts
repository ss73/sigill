import { lang, preferredLang, setLang, storedLang, t, isLang } from "./i18n";
import { langHint, parseRoute } from "./links";
import { initTheme } from "./theme";
import { backLink, languageSelect, notice, settingsMenu } from "./ui";
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

/** Back on the left (except on the home page); language and settings on the right. */
function topBar(): HTMLElement {
  const select = languageSelect(lang(), (code) => void switchLanguage(code), "ui-language");
  select.setAttribute("aria-label", t.common.language);
  const tools = document.createElement("div");
  tools.className = "tools";
  tools.append(select, settingsMenu());
  const bar = document.createElement("nav");
  bar.className = "topbar";
  if (parseRoute(location.hash).name !== "home") {
    bar.append(backLink());
  }
  bar.append(tools);
  return bar;
}

function render(): void {
  app.replaceChildren(topBar(), view());
  window.scrollTo(0, 0);
  app.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
}

/** Re-renders in another language, keeping whatever the user has typed. */
async function switchLanguage(code: Parameters<typeof setLang>[0]): Promise<void> {
  const drafts = new Map<string, string>();
  for (const el of app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[data-testid]:not([readonly]), textarea[data-testid]")) {
    if (el.value) {
      drafts.set(el.dataset.testid!, el.value);
    }
  }
  await setLang(code, true);
  render();
  for (const [id, value] of drafts) {
    const el = app.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-testid="${id}"]`);
    if (el && !el.value) {
      el.value = value;
      el.dispatchEvent(new Event("input"));
    }
  }
  app.querySelector<HTMLElement>('[data-testid="ui-language"]')?.focus();
}

/** A link written in another language (l=) opens in that language, unless the user picked one. */
async function onNavigate(): Promise<void> {
  const hint = langHint(location.hash);
  if (!storedLang() && isLang(hint) && hint !== lang()) {
    await setLang(hint);
  }
  render();
}

initTheme();
await setLang(preferredLang(langHint(location.hash)));
if (await browserSupported()) {
  window.addEventListener("hashchange", () => void onNavigate());
  render();
} else {
  app.replaceChildren(notice("error", t.common.tooOld));
}
