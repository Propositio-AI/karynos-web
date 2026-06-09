import { defineConfig } from "orval";
import { readFileSync, existsSync } from "fs";

// Load .env.local without relying on dotenv (works in any environment)
if (existsSync(".env.local")) {
	for (const line of readFileSync(".env.local", "utf8").split("\n")) {
		const m = line.match(/^\s*([^#\s][^=]*?)\s*=\s*(.*?)\s*$/);
		const key = m?.[1];
		const val = m?.[2];
		if (key !== undefined && val !== undefined && process.env[key] === undefined)
			process.env[key] = val.replace(/^["']|["']$/g, "");
	}
}

const openapiTarget =
	process.env.OPENAPI_URL ??
	`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/openapi.json`;

export default defineConfig({
	api: {
		input: {
			target: openapiTarget,
		},
		output: {
			mode: "tags-split",
			target: "./src/lib/api/gen/endpoints.ts",
			schemas: "./src/lib/api/gen/schema",
			client: "axios",
			clean: true,
			override: {
				mutator: {
					path: "./src/lib/api/mutator.ts",
					name: "customInstance",
				},
			},
		},
	},
});
