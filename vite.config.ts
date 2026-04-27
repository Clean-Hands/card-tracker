import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	base: "/card-tracker/",
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: [
				"favicon-32.png",
				"apple-touch-icon.png",
				"icon.svg",
			],
			manifest: {
				name: "Card Tracker",
				short_name: "Cards",
				description:
					"Track credit card multipliers and benefits to maximize value.",
				theme_color: "#4f46e5",
				background_color: "#f9fafb",
				display: "standalone",
				orientation: "portrait",
				scope: "/card-tracker/",
				start_url: "/card-tracker/",
				icons: [
					{
						src: "icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "icon-512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
			},
		}),
	],
});
