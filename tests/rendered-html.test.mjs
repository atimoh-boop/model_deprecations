import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("shows the saved deprecated model and fallback notice when backend reports a fallback", async () => {
  const response = await render("/?state=fallback");
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /<title>Basic settings · ASU AI<\/title>/i);
  assert.match(html, /GPT-4\.1 Mini — Deprecated/);
  assert.match(html, /Your selected model has been deprecated/);
  assert.match(html, /still shows[\s\S]*GPT-4\.1 Mini/);
  assert.match(html, /running on[\s\S]*GPT-5\.4 Nano/);
  assert.match(html, /Gemma4 31B IT/);
  assert.match(html, /GPT-5\.5/);
  assert.match(html, /Deep Thinking/);
  assert.match(html, /role="status"/);
});

test("does not show the fallback notice for unaffected projects", async () => {
  const response = await render("/?state=active");
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /Prototype state:[\s\S]{0,80}active model/);
  assert.match(html, /Choose a model/);
  assert.match(html, /GPT-5\.4 Nano/);
  assert.doesNotMatch(html, /Your selected model has been deprecated/);
});
