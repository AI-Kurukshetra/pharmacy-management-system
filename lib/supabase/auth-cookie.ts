type CookieShape = { name: string; value: string };

function decodeBase64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
  if (typeof atob === "function") {
    return atob(padded);
  }
  return Buffer.from(padded, "base64").toString("utf8");
}

export function getSupabaseAccessToken(cookies: CookieShape[]): string | null {
  const authCookies = cookies.filter((cookie) => /-auth-token(?:\.\d+)?$/.test(cookie.name));
  if (authCookies.length === 0) return null;

  const serialized = authCookies.length === 1
    ? authCookies[0].value
    : authCookies
        .sort((a, b) => {
          const aMatch = a.name.match(/\.([0-9]+)$/);
          const bMatch = b.name.match(/\.([0-9]+)$/);
          const aIndex = aMatch ? Number(aMatch[1]) : 0;
          const bIndex = bMatch ? Number(bMatch[1]) : 0;
          return aIndex - bIndex;
        })
        .map((cookie) => cookie.value)
        .join("");

  try {
    const raw = serialized.startsWith("base64-")
      ? decodeBase64(serialized.slice("base64-".length))
      : serialized;
    const parsed = JSON.parse(raw) as { access_token?: string };
    return parsed.access_token ?? null;
  } catch {
    return null;
  }
}
