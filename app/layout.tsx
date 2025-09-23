import { ThemeProvider } from "@/components/theme-provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import ReactQueryProvider from "../components/react-query-provider";

import "./globals.css";

export const metadata: Metadata = {
	title: "Balanced Score Card",
	description: "Generating a BSC for the staffs of the whole country."
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
			</head>
			<body suppressHydrationWarning>
				<ThemeProvider enableSystem defaultTheme="system" attribute="class" enableColorScheme>
					<ReactQueryProvider>
						<SessionProvider>{children}</SessionProvider>
						<Toaster richColors={true} expand />
					</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
