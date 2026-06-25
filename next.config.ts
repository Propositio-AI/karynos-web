import type { NextConfig } from "next";

const apiBaseUrl = (
	process.env.INTERNAL_API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://localhost:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.karynos.com",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: `${apiBaseUrl}/api/v1/:path*`,
			},
		];
	},
};

export default nextConfig;
