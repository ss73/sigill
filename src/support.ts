/**
 * Returns the names of required WebCrypto features this environment lacks.
 * An empty array means everything needed is available.
 */
export async function checkSupport(): Promise<string[]> {
  const missing: string[] = [];
  if (!globalThis.crypto?.subtle) {
    return ["WebCrypto (crypto.subtle)"];
  }
  try {
    await crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveBits"]);
  } catch {
    missing.push("X25519");
  }
  return missing;
}
