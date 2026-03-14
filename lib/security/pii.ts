import crypto from "node:crypto";

const PREFIX = "enc:v1:";
const IV_LEN = 12;

function getKey() {
  const raw = process.env.APP_ENCRYPTION_KEY || "";
  if (!raw) return null;
  return crypto.createHash("sha256").update(raw).digest();
}

export function encryptPII(value: unknown) {
  if (value === null || value === undefined || value === "") return value;
  const text = String(value);
  if (text.startsWith(PREFIX)) return text;
  const key = getKey();
  if (!key) return value;
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${Buffer.concat([iv, tag, encrypted]).toString("base64url")}`;
}

export function decryptPII(value: unknown) {
  if (value === null || value === undefined || value === "") return value;
  const text = String(value);
  if (!text.startsWith(PREFIX)) return value;
  const key = getKey();
  if (!key) return value;
  try {
    const buf = Buffer.from(text.slice(PREFIX.length), "base64url");
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + 16);
    const data = buf.subarray(IV_LEN + 16);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return value;
  }
}

export function encryptPatientPayload<T extends Record<string, any>>(payload: T): T {
  const fields = ["email", "phone", "address_line1", "address_line2", "city", "state", "zip"] as const;
  type PiiField = (typeof fields)[number];
  const next = { ...payload } as T & Record<PiiField, unknown>;
  for (const field of fields) next[field] = encryptPII(next[field]);
  return next as T;
}

export function decryptPatientPayload<T extends Record<string, any>>(payload: T): T {
  const fields = ["email", "phone", "address_line1", "address_line2", "city", "state", "zip"] as const;
  type PiiField = (typeof fields)[number];
  const next = { ...payload } as T & Record<PiiField, unknown>;
  for (const field of fields) next[field] = decryptPII(next[field]);
  return next as T;
}
