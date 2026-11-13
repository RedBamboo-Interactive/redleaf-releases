// Builds the public site into _site/ (or the directory given as the first argument).
//
// Pages live in site/pages/<locale>/, one tree per language; English (the default) is the source
// of truth and is served at the site root, other languages under /<code>/. A page links to its
// translations by sharing the same relative path. A missing translation falls back to the English
// page with a notice, and the build lists it.
//
// Each page starts with <!--page {json}--> naming its title, description and layout. Bodies may use
// {{root}} (resolved to the page's language for pages, to the site root for files in static/),
// {{site}} (always the site root), {{icon:name}} and {{recipes}}.
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { icon, recipeCards, render } from "./layout.mjs";
import { SITE_URL, checkStrings, defaultLocale, localePrefix, locales, strings } from "./i18n.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..", process.argv[2] ?? "_site");
const pagesDir = path.join(here, "pages");
const staticDir = path.join(here, "static");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

function parse(file, source) {
  const match = source.match(/^<!--page\s+(\{[\s\S]*?\})\s*-->\s*/);
  if (!match) throw new Error(`${path.relative(here, file)} has no <!--page {...}--> header.`);
  return { meta: JSON.parse(match[1]), body: source.slice(match[0].length) };
}

/**
 * French spacing and apostrophes, applied to text only (never inside tags, attributes, scripts or
 * code): a no-break space before ":" and inside « », a narrow no-break space before ; ! ?, and ’.
 */
function frenchTypography(html) {
  const skip = new Set(["script", "style", "pre", "code", "kbd", "textarea"]);
  let depth = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) {
      const tag = part.match(/^<\/?([a-z0-9]+)/i)?.[1]?.toLowerCase();
      if (tag && skip.has(tag) && !part.endsWith("/>")) depth += part.startsWith("</") ? -1 : 1;
      return part;
    }
    if (depth > 0 || !part.trim()) return part;
    const entities = [];
    return part
      .replace(/&#?\w+;/g, (m) => `\u0000${entities.push(m) - 1}\u0000`)
      .replace(/(\p{L})'(\p{L})/gu, "$1\u2019$2")
      .replace(/([^\s\u00a0\u202f])[ \u00a0\u202f]?([;!?])(?=[\s)&]|$)/g, "$1\u202f$2")
      .replace(/([\p{L}\d)\u00bb*])[ \u00a0]?:(?=\s|$)/gu, "$1\u00a0:")
      .replace(/^[ \u00a0]?:(?=\s|$)/, "\u00a0:") // a colon right after inline markup: "</b> :"
      .replace(/^[ \u00a0\u202f]?([;!?])(?=[\s)&]|$)/, "\u202f$1")
      .replace(/\u00ab ?/g, "\u00ab\u00a0")
      .replace(/ ?\u00bb/g, "\u00a0\u00bb")
      .replace(/\u0000(\d+)\u0000/g, (_, i) => entities[i]);
  }).join("");
}

checkStrings();

// Empty the output directory rather than removing it, so a preview server rooted there keeps working.
await mkdir(out, { recursive: true });
for (const entry of await readdir(out)) await rm(path.join(out, entry), { recursive: true, force: true });
await cp(staticDir, out, { recursive: true });
const assetNames = new Set(await readdir(staticDir));

// The English tree defines which pages exist.
const sourceDir = path.join(pagesDir, defaultLocale);
const pagePaths = [];
for await (const file of walk(sourceDir)) pagePaths.push(path.relative(sourceDir, file).split(path.sep).join("/"));
pagePaths.sort();

for (const { code } of locales.slice(1)) {
  const dir = path.join(pagesDir, code);
  if (!existsSync(dir)) continue;
  for await (const file of walk(dir)) {
    const relative = path.relative(dir, file).split(path.sep).join("/");
    if (!pagePaths.includes(relative)) throw new Error(`pages/${code}/${relative} has no English original in pages/${defaultLocale}/.`);
  }
}

const urlPath = (relative) => (relative === "index.html" ? "" : relative.replace(/index\.html$/, ""));
const missing = Object.fromEntries(locales.map((l) => [l.code, []]));
const sitemap = [];
let count = 0;

for (const relative of pagePaths) {
  const pagePath = urlPath(relative);
  const alternatesAbs = locales.map((l) => ({ ...l, abs: `${SITE_URL}${localePrefix(l.code)}${pagePath}` }));
  sitemap.push(alternatesAbs);

  for (const locale of locales) {
    const own = path.join(pagesDir, locale.code, relative);
    const fallback = !existsSync(own);
    if (fallback) missing[locale.code].push(relative);
    const file = fallback ? path.join(sourceDir, relative) : own;
    const { meta, body } = parse(file, await readFile(file, "utf8"));

    const outRelative = `${localePrefix(locale.code)}${relative}`;
    const depth = outRelative.split("/").length - 1;
    const siteRoot = depth ? "../".repeat(depth) : "./";
    const localeRoot = `${siteRoot}${localePrefix(locale.code)}`;
    const alternates = alternatesAbs.map((a) => ({ ...a, rel: `${siteRoot}${localePrefix(a.code)}${pagePath}` || "./" }));
    const ctx = { locale: locale.code, t: strings[locale.code], alternates, fallback };
    const page = { ...meta, path: pagePath };

    let html = render(page, body, ctx)
      .replaceAll("{{recipes}}", recipeCards(ctx))
      .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name))
      .replace(/\{\{root\}\}([^"'\s)<>]*)/g, (_, rest) => {
        const first = rest.split(/[/#?]/)[0];
        return `${first && assetNames.has(first) ? siteRoot : localeRoot}${rest}` || "./";
      })
      .replaceAll("{{site}}", siteRoot);
    const unresolved = html.match(/\{\{[^}]*\}\}/);
    if (unresolved) throw new Error(`${outRelative}: unresolved placeholder ${unresolved[0]}`);
    if (locale.code === "fr" && !fallback) html = frenchTypography(html);

    const target = path.join(out, outRelative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
    count += 1;
  }
}

// One sitemap entry per page, listing every language version so search engines pair them.
await writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.flatMap((alts) => alts.map((a) => `  <url><loc>${a.abs}</loc>${alts.map((b) => `<xhtml:link rel="alternate" hreflang="${b.code}" href="${b.abs}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${alts[0].abs}"/></url>`)).join("\n")}
</urlset>
`);
await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);

console.log(`Built ${count} pages (${pagePaths.length} × ${locales.length} languages) into ${path.relative(process.cwd(), out) || "."}`);
for (const { code } of locales.slice(1)) {
  if (missing[code].length) console.log(`  ${code}: ${missing[code].length} page(s) fall back to English: ${missing[code].join(", ")}`);
}
