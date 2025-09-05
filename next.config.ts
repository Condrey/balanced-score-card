import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		authInterrupts: true
	},
	images: {
		remotePatterns: [{ hostname: "lh3.googleusercontent.com" }]
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
};

export default nextConfig;
