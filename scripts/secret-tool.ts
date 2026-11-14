/**
 * Offline AES-256-GCM text encryption / decryption tool.
 *
 * The master key is read from the SECRET_ENCRYPTION_KEY environment variable
 * (or from .env.local if not exported). It must decode to 32 bytes and must
 * NEVER be committed to git — store it in a password manager or a Cloudflare
 * secret, separately from any ciphertext.
 *
 * Usage:
 *   npm run secret -- genkey
 *   npm run secret -- encrypt "hello world"
 *   npm run secret -- decrypt "v1.<iv>.<tag>.<cipher>"
 *   npm run secret -- encrypt-env [.env.local] [config/secrets.enc.json]
 *   npm run secret -- decrypt-env [config/secrets.enc.json] [.env.decrypted]
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseEnv } from "dotenv";

const ALGORITHM = "aes-256-gcm";
const VERSION = "v1";
const IV_BYTES = 12;
const KEY_BYTES = 32;

function ensureKeyLoaded(): void {
  if (process.env.SECRET_ENCRYPTION_KEY) return;
  const envPath = resolve(".env.local");
  if (!existsSync(envPath)) return;
  const parsed = parseEnv(readFileSync(envPath, "utf8"));
  if (parsed.SECRET_ENCRYPTION_KEY) {
    process.env.SECRET_ENCRYPTION_KEY = parsed.SECRET_ENCRYPTION_KEY;
  }
}

function getKey(): Buffer {
  ensureKeyLoaded();
  const raw = (process.env.SECRET_ENCRYPTION_KEY || "").trim();
  if (!raw) {
    throw new Error(
      "SECRET_ENCRYPTION_KEY is not set. Run `npm run secret -- genkey` and add it to .env.local (never commit it)."
    );
  }
  const key = /^[0-9a-fA-F]{64}$/.test(raw)
    ? Buffer.from(raw, "hex")
    : Buffer.from(raw, "base64");
  if (key.length !== KEY_BYTES) {
    throw new Error(`SECRET_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${key.length}).`);
  }
  return key;
}

function toB64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(value: string): Buffer {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, toB64url(iv), toB64url(tag), toB64url(ciphertext)].join(".");
}

function decrypt(payload: string): string {
  const [version, ivEnc, tagEnc, dataEnc] = payload.trim().split(".");
  if (version !== VERSION || !ivEnc || !tagEnc || !dataEnc) {
    throw new Error("Malformed ciphertext. Expected format v1.<iv>.<tag>.<cipher>.");
  }
  const decipher = createDecipheriv(ALGORITHM, getKey(), fromB64url(ivEnc));
  decipher.setAuthTag(fromB64url(tagEnc));
  return Buffer.concat([decipher.update(fromB64url(dataEnc)), decipher.final()]).toString("utf8");
}

function genkey(): string {
  return randomBytes(KEY_BYTES).toString("base64");
}

function usage(): void {
  console.log(
    [
      "Usage:",
      '  npm run secret -- genkey',
      '  npm run secret -- encrypt "<text>"',
      '  npm run secret -- decrypt "<v1.iv.tag.cipher>"',
      "  npm run secret -- encrypt-env [.env.local] [config/secrets.enc.json]",
      "  npm run secret -- decrypt-env [config/secrets.enc.json] [.env.decrypted]",
      "",
      "Set SECRET_ENCRYPTION_KEY (32 bytes, base64 or hex) before encrypt/decrypt.",
    ].join("\n")
  );
}

function encryptEnv(inputPath: string, outputPath: string): void {
  const source = resolve(inputPath);
  if (!existsSync(source)) throw new Error(`Env file not found: ${source}`);
  const parsed = parseEnv(readFileSync(source, "utf8"));
  const encrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    encrypted[key] = encrypt(value);
  }
  const out = resolve(outputPath);
  writeFileSync(out, `${JSON.stringify(encrypted, null, 2)}\n`, "utf8");
  console.log(`Encrypted ${Object.keys(encrypted).length} values -> ${out}`);
}

function decryptEnv(inputPath: string, outputPath: string): void {
  const source = resolve(inputPath);
  if (!existsSync(source)) throw new Error(`Vault file not found: ${source}`);
  const parsed = JSON.parse(readFileSync(source, "utf8")) as Record<string, string>;
  const lines = Object.entries(parsed).map(([key, value]) => `${key}=${decrypt(value)}`);
  const out = resolve(outputPath);
  writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
  console.log(`Decrypted ${lines.length} values -> ${out}`);
}

function main(argv: string[]): void {
  const [command, ...rest] = argv;
  switch (command) {
    case "genkey":
      console.log(genkey());
      break;
    case "encrypt":
      if (!rest.length) throw new Error("Missing text to encrypt.");
      console.log(encrypt(rest.join(" ")));
      break;
    case "decrypt":
      if (!rest.length) throw new Error("Missing ciphertext to decrypt.");
      console.log(decrypt(rest.join(" ")));
      break;
    case "encrypt-env":
      encryptEnv(rest[0] || ".env.local", rest[1] || "config/secrets.enc.json");
      break;
    case "decrypt-env":
      decryptEnv(rest[0] || "config/secrets.enc.json", rest[1] || ".env.decrypted");
      break;
    default:
      usage();
      process.exitCode = 1;
  }
}

main(process.argv.slice(2));
