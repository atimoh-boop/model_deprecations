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
  assert.match(html, /<title>Model settings · Northstar AI<\/title>/i);
  assert.match(html, /Atlas 2 — Deprecated/);
  assert.match(html, /Your project is using a fallback model/);
  assert.match(html, /Atlas 2 has been deprecated/);
  assert.match(html, /continuing on[\s\S]*Nimbus 4\.1/);
  assert.match(html, /role="status"/);
});

test("does not show the fallback notice for unaffected projects", async () => {
  const response = await render("/?state=active");
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /Backend state: active selection/);
  assert.match(html, /Selected model/);
  assert.match(html, /Nimbus 4\.1/);
  assert.doesNotMatch(html, /Your project is using a fallback model/);
  assert.doesNotMatch(html, /has been deprecated/);
});
