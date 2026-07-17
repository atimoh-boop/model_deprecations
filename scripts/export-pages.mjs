import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const output = new URL("../pages-dist/", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);
const basePath = "/model_deprecations";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(client, output, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(path) {
  const response = await worker.fetch(
    new Request(`https://atimoh-boop.github.io${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  if (!response.ok) throw new Error(`Static render failed for ${path}: ${response.status}`);
  return rewrite(await response.text());
}

function rewrite(value) {
  return value
    .replaceAll('"/assets/', `"${basePath}/assets/`)
    .replaceAll("'/assets/", `'${basePath}/assets/`)
    .replaceAll("url(/assets/", `url(${basePath}/assets/`)
    .replaceAll('href="/favicon.svg"', `href="${basePath}/favicon.svg"`)
    .replaceAll('href="/?state=active"', `href="${basePath}/active/"`)
    .replaceAll('href="/?state=fallback"', `href="${basePath}/"`);
}

const fallbackHtml = await render("/?state=fallback");
const activeHtml = await render("/?state=active");
await writeFile(new URL("index.html", output), fallbackHtml);
await mkdir(new URL("active/", output), { recursive: true });
await writeFile(new URL("active/index.html", output), activeHtml);
await writeFile(new URL(".nojekyll", output), "");

async function patchAsset(path) {
  const extension = extname(path);
  if (extension !== ".css" && extension !== ".js") return;
  const contents = await readFile(path, "utf8");
  const rewritten = rewrite(contents);
  if (rewritten !== contents) await writeFile(path, rewritten);
}

const { readdir } = await import("node:fs/promises");
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else await patchAsset(path);
  }
}
await walk(fileURLToPath(new URL("assets/", output)));
