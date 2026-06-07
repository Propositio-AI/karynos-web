import { defineConfig } from "orval";

export default defineConfig({
	api: {
		input: {
			// Sharing strategy for this file is intentionally kept pending.
			target: "./openapi.config.sjon",
		},
		output: {
			mode: "tags-split",
			target: "./src/app/gen/endpoints.ts",
			schemas: "./src/app/gen/schema",
			client: "axios",
			clean: true,
			override: {
				mutator: {
					path: "./src/app/api/mutator/ky.ts",
					name: "customInstance",
				},
			},
		},
	},
});
