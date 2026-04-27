import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/icon.svg");
const svg = readFileSync(svgPath, "utf8");

async function rasterize(size, outFile) {
	const sharp = (await import("sharp")).default;
	await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer().then((buf) => {
		writeFileSync(resolve(__dirname, "../public", outFile), buf);
		console.log(`wrote public/${outFile} (${size}x${size})`);
	});
}

await rasterize(192, "icon-192.png");
await rasterize(512, "icon-512.png");
await rasterize(180, "apple-touch-icon.png");
await rasterize(32, "favicon-32.png");
