import { checkSupport } from "./support";

const status = document.getElementById("status");
if (status) {
  const missing = await checkSupport();
  status.textContent =
    missing.length === 0
      ? "This browser supports the required cryptography."
      : `This browser is missing: ${missing.join(", ")}.`;
}
