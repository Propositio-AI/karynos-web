/**
 * Fetches the remote OpenAPI spec and compares it against the committed
 * openapi.json to detect breaking changes before code generation.
 *
 * Breaking changes (→ build fails):
 *   - Removed paths
 *   - Removed HTTP methods on existing paths
 *   - New required request body / query parameters on existing operations
 *
 * Non-breaking changes (→ openapi.json updated, build continues):
 *   - Added paths / methods
 *   - Added optional parameters
 *   - info.version bump
 *
 * Type-level compatibility (changed response shapes, etc.) is caught
 * downstream by TypeScript compilation inside `next build`.
 */

import { readFileSync, existsSync, writeFileSync } from "fs";

// Load .env.local without relying on dotenv (works in any environment)
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([^#\s][^=]*?)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined)
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const OPENAPI_URL =
  process.env.OPENAPI_URL ??
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/openapi.json`;

const LOCAL_PATH = "./openapi.json";

// ── helpers ──────────────────────────────────────────────────────────────────

const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "head", "options"];

/** Returns { path → Set<method> } for every operation in a spec. */
function buildOperationMap(spec) {
  const map = {};
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    map[path] = new Set(
      Object.keys(item).filter((k) => HTTP_METHODS.includes(k))
    );
  }
  return map;
}

/** Returns required parameter names for a given operation object. */
function requiredParams(operation) {
  return new Set(
    (operation.parameters ?? [])
      .filter((p) => p.required)
      .map((p) => `${p.in}:${p.name}`)
  );
}

// ── core diff ────────────────────────────────────────────────────────────────

function detectBreakingChanges(base, head) {
  const breaking = [];
  const baseOps = buildOperationMap(base);
  const headOps = buildOperationMap(head);

  for (const [path, baseMethods] of Object.entries(baseOps)) {
    if (!headOps[path]) {
      breaking.push(`Removed path: ${path}`);
      continue;
    }

    for (const method of baseMethods) {
      if (!headOps[path].has(method)) {
        breaking.push(`Removed method: ${method.toUpperCase()} ${path}`);
        continue;
      }

      // New required parameters on an existing operation
      const baseParams = requiredParams(base.paths[path][method]);
      const headParams = requiredParams(head.paths[path][method]);
      for (const p of headParams) {
        if (!baseParams.has(p)) {
          breaking.push(
            `New required parameter '${p}' on ${method.toUpperCase()} ${path}`
          );
        }
      }
    }
  }

  return breaking;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nFetching OpenAPI spec from ${OPENAPI_URL} …`);

  let remoteSpec;
  try {
    const res = await fetch(OPENAPI_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    remoteSpec = await res.json();
  } catch (err) {
    console.error(`❌  Could not fetch OpenAPI spec: ${err.message}`);
    process.exit(1);
  }

  const remoteVersion = remoteSpec.info?.version ?? "(unknown)";

  // No baseline yet → save and continue
  if (!existsSync(LOCAL_PATH)) {
    writeFileSync(LOCAL_PATH, JSON.stringify(remoteSpec, null, 2) + "\n");
    console.log(`✅  API v${remoteVersion} — saved as baseline (first run)\n`);
    return;
  }

  const localSpec = JSON.parse(readFileSync(LOCAL_PATH, "utf8"));
  const localVersion = localSpec.info?.version ?? "(unknown)";

  if (localVersion !== remoteVersion) {
    console.log(`ℹ️   Version: ${localVersion} → ${remoteVersion}`);
  }

  const breaking = detectBreakingChanges(localSpec, remoteSpec);

  if (breaking.length > 0) {
    console.error("❌  Breaking API changes detected:\n");
    breaking.forEach((c) => console.error(`  • ${c}`));
    console.error(
      "\nResolve the incompatibilities, update openapi.json, and commit it.\n"
    );
    process.exit(1);
  }

  // Non-breaking → update baseline
  writeFileSync(LOCAL_PATH, JSON.stringify(remoteSpec, null, 2) + "\n");
  console.log(`✅  API v${remoteVersion} — compatible, openapi.json updated\n`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
