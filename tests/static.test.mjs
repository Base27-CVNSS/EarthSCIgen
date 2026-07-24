import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [html, css, js, manifest, workflow] = await Promise.all([
  read("index.html"),
  read("assets/styles.css"),
  read("assets/app.js"),
  read("manifest.webmanifest"),
  read(".github/workflows/pages.yml"),
]);

test("entry document is a responsive, local static application", () => {
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /src="\.\/assets\/app\.js"/);
  assert.match(html, /href="\.\/assets\/styles\.css"/);
  assert.doesNotMatch(html, /https?:\/\/[^"]+\.(?:js|css)(?:["?])/i);
});

test("exactly six Earth Science topic controls are exposed", () => {
  const topics = [...html.matchAll(/data-topic="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(topics, [
    "remote_sensing",
    "geology",
    "hydrology",
    "climate",
    "geomorphology",
    "geophysics",
  ]);
});

test("metadata, seed, and 6–8 page controls exist", () => {
  for (const id of ["title", "author", "email", "affiliation", "seed", "pages"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.deepEqual(
    [...html.matchAll(/data-pages="(\d)"/g)].map((match) => Number(match[1])),
    [6, 7, 8],
  );
});

test("all requested export routes and browser printing are implemented", () => {
  for (const format of ["html", "tex", "json"]) {
    assert.match(html, new RegExp(`data-export="${format}"`));
  }
  assert.match(js, /window\.print\(\)/);
  assert.match(js, /buildStandaloneHtml/);
  assert.match(js, /buildLatex/);
  assert.match(js, /buildManifest/);
});

test("synthetic safety labels survive UI and every serialized output", () => {
  assert.match(html, /SYNTHETIC DRAFT/);
  assert.match(js, /NOT PEER REVIEWED/);
  assert.match(js, /NOT SCIENTIFIC EVIDENCE/);
  assert.match(js, /earthscigen-synthetic/);
  assert.match(js, /synthetic:\s*true/);
  assert.match(js, /\\fbox/);
});

test("privacy and reference integrity rules are explicit", () => {
  assert.doesNotMatch(js, /\bfetch\s*\(/);
  assert.doesNotMatch(js, /XMLHttpRequest|WebSocket|sendBeacon/);
  assert.match(js, /fabricated_doi_allowed:\s*false/);
  assert.match(js, /observational_data_used:\s*false/);
});

test("three responsive visual designs and print-sized A4 pages exist", () => {
  for (const theme of ["editorial", "atlas", "strata"]) {
    assert.match(html + css, new RegExp(theme));
  }
  assert.match(css, /@page\s*\{[\s\S]*size:\s*A4/);
  assert.match(css, /column-count:\s*2/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /@media\s+print/);
});

test("web manifest and Pages workflow are valid deployment inputs", () => {
  const parsed = JSON.parse(manifest);
  assert.equal(parsed.start_url, "./");
  assert.equal(parsed.display, "standalone");
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /npm test/);
});
