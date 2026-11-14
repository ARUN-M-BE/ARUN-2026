/**
 * Push Worker secrets to Cloudflare with `wrangler secret bulk`.
 *
 * Reads a dotenv-style file (.dev.vars or .env.local) and forwards ONLY the
 * allow-listed sensitive keys, so non-secret config stays in wrangler.jsonc
 * `vars` and real secrets never need to be committed.
 *
 * Usage:
 *   npm run secrets:push -- [--file .dev.vars] [--dry-run]
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parse as parseEnv } from "dotenv";

const SECRET_KEYS = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "ADMIN_PASSWORD",
  "API_MANAGEMENT_KEY",
  "MONKEYTYPE_APE_KEY",
  "IPSTACK_API_KEY",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEON_REALTIME_SECRET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "RESEND_API_KEY",
  "RESEND_WEBHOOK_SECRET",
] as const;

const PLACEHOLDER_PATTERN =
  /your_|change_?me|dev-secret|generate-a-random-secret|^$/i;

function resolveSource(explicit?: string): string {
  const candidates = explicit ? [explicit] : [".dev.vars", ".env.local"];
  for (const candidate of candidates) {
    const path = resolve(candidate);
    if (existsSync(path)) return path;
  }
  throw new Error(
    `No secrets file found. Looked for: ${candidates.join(", ")}. Create .dev.vars from .dev.vars.example.`
  );
}

function main(argv: string[]): void {
  const dryRun = argv.includes("--dry-run");
  const fileFlagIndex = argv.indexOf("--file");
  const explicitFile = fileFlagIndex >= 0 ? argv[fileFlagIndex + 1] : undefined;

  const source = resolveSource(explicitFile);
  const parsed = parseEnv(readFileSync(source, "utf8"));

  const payload: Record<string, string> = {};
  const skipped: string[] = [];

  for (const key of SECRET_KEYS) {
    const value = parsed[key];
    if (!value) continue;
    if (PLACEHOLDER_PATTERN.test(value.trim())) {
      skipped.push(key);
      continue;
    }
    payload[key] = value;
  }

  const keys = Object.keys(payload);
  if (!keys.length) {
    console.log(`No valid secrets to push from ${source}.`);
    if (skipped.length) console.log(`Skipped placeholders: ${skipped.join(", ")}`);
    return;
  }

  console.log(`Source: ${source}`);
  console.log(`Keys:   ${keys.join(", ")}`);
  if (skipped.length) console.log(`Skipped placeholders: ${skipped.join(", ")}`);

  if (dryRun) {
    console.log("Dry run — nothing was uploaded.");
    return;
  }

  const tmpDir = resolve(".wrangler");
  mkdirSync(tmpDir, { recursive: true });
  const tmpFile = resolve(tmpDir, "secrets.bulk.json");
  writeFileSync(tmpFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  try {
    const result = spawnSync("npx", ["wrangler", "secret", "bulk", tmpFile], {
      stdio: "inherit",
      shell: true,
    });
    if (result.status !== 0) {
      throw new Error(`wrangler secret bulk failed with exit code ${result.status ?? "unknown"}.`);
    }
  } finally {
    rmSync(tmpFile, { force: true });
  }

  console.log(`Pushed ${keys.length} secrets to Cloudflare.`);
}

main(process.argv.slice(2));
