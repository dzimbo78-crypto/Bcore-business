import path from "node:path";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "../artifacts/api-server/node_modules/esbuild/lib/main.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "artifacts/sales-platform");
const built = path.join(app, "dist/public/assets");
const cssFiles = (await readdir(built)).filter((file) => file.endsWith(".css"));
let css = (
  await Promise.all(
    cssFiles.map((file) => readFile(path.join(built, file), "utf8")),
  )
).join("\n");
for (const file of await readdir(path.join(app, "public/fonts"))) {
  if (!file.endsWith(".woff")) continue;
  const data = await readFile(path.join(app, "public/fonts", file));
  css = css.replaceAll(
    `/fonts/${file}`,
    `data:font/woff;base64,${data.toString("base64")}`,
  );
}
const images = {};
for (const file of await readdir(path.join(app, "public/images/advisory"))) {
  if (!file.endsWith(".webp")) continue;
  images[file] =
    `data:image/webp;base64,${(await readFile(path.join(app, "public/images/advisory", file))).toString("base64")}`;
}
const result = await build({
  absWorkingDir: root,
  entryPoints: [path.join(app, "src/main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  minify: true,
  target: "es2020",
  jsx: "automatic",
  alias: { "@": path.join(app, "src") },
  tsconfig: path.join(app, "tsconfig.json"),
  loader: { ".css": "empty" },
  define: {
    "import.meta.env.BASE_URL": '"/"',
    "import.meta.env.VITE_STANDALONE_PREVIEW": '"true"',
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
    "process.env.NODE_ENV": '"production"',
  },
});
const js = result.outputFiles[0].text.replaceAll("</script", "<\\/script");
const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#101415"><title>B-CORE — podgląd projektu</title><style>${css.replaceAll("</style", "<\\/style")}</style></head><body><div id="root"></div><script>window.__BCORE_ASSETS__=${JSON.stringify(images)};<\/script><script>${js}<\/script></body></html>`;
const output = path.resolve(
  process.argv[2] || path.join(root, "deliverables/BCORE-preview.html"),
);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, html);
console.log(
  `Standalone preview: ${output} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`,
);
