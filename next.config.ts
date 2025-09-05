import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		authInterrupts: true
	},
	images: {
		remotePatterns: [{ hostname: "lh3.googleusercontent.com" }]
	}
};

export default nextConfig;
