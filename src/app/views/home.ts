import { h, icon } from "../dom";
import { page } from "../ui";
import sigillUrl from "../sigill.svg";
import { t } from "../i18n";

function choice(href: string, iconName: "send" | "inbox", heading: string, text: string, testId: string): HTMLElement {
  return h(
    "a",
    { class: "choice", href, "data-testid": testId },
    h("span", { class: "choice-icon" }, icon(iconName)),
    h("span", { class: "choice-text" }, h("strong", null, heading), h("span", null, text)),
  );
}

export function homeView(): HTMLElement {
  return page(
    h(
      "header",
      { class: "hero" },
      h("img", { class: "logo", src: sigillUrl, alt: "", width: 96, height: 96 }),
      h("h1", { tabIndex: -1 }, "Sigill"),
      h("p", { class: "lead" }, t.home.lead),
    ),
    h(
      "nav",
      { class: "choices", "aria-label": t.home.choicesLabel },
      choice("#send", "send", t.home.sendTitle, t.home.sendText, "choose-send"),
      choice("#inbox", "inbox", t.home.receiveTitle, t.home.receiveText, "choose-receive"),
    ),
    h(
      "section",
      { class: "how", "aria-labelledby": "how-title" },
      h("h2", { id: "how-title" }, t.home.howTitle),
      h(
        "ol",
        { class: "steps" },
        h("li", null, h("strong", null, t.home.step1Strong), t.home.step1),
        h("li", null, h("strong", null, t.home.step2Strong), t.home.step2),
        h("li", null, h("strong", null, t.home.step3Strong), t.home.step3),
      ),
    ),
    h(
      "p",
      { class: "fineprint" },
      t.home.nothingStored,
      h("a", { href: "#open" }, t.home.wontOpen),
    ),
  );
}
