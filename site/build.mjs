// Builds the public site into _site/ (or the directory given as the first argument).
// Each page in site/pages starts with <!--page {json}--> naming its title, description and layout.
// Page bodies may use {{root}} (relative path to the site root), {{icon:name}} and {{recipes}}.
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { icon, recipes, render } from "./layout.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..", process.argv[2] ?? "_site");
const pagesDir = path.join(here, "pages");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

const recipeCards = () => recipes.map((r) => `<a class="recipe-card" href="{{root}}cookbook/${r.slug}/"><span class="tone tone-${r.tone}">${icon(r.icon)}</span><small>${r.title}</small><b>${r.headline}</b><p>${r.summary}</p><em>See how ${icon("arrow-right")}</em></a>`).join("\n");

// Empty the output directory rather than removing it, so a preview server rooted there keeps working.
await mkdir(out, { recursive: true });
for (const entry of await readdir(out)) await rm(path.join(out, entry), { recursive: true, force: true });
await cp(path.join(here, "static"), out, { recursive: true });

let count = 0;
for await (const file of walk(pagesDir)) {
  const source = await readFile(file, "utf8");
  const match = source.match(/^<!--page\s+(\{[\s\S]*?\})\s*-->\s*/);
  if (!match) throw new Error(`${path.relative(here, file)} has no <!--page {...}--> header.`);
  const relative = path.relative(pagesDir, file).split(path.sep).join("/");
  const pagePath = relative === "index.html" ? "" : relative.replace(/index\.html$/, "");
  const page = { ...JSON.parse(match[1]), path: pagePath };
  const depth = pagePath.split("/").filter(Boolean).length;
  const root = depth ? "../".repeat(depth) : "./";
  const html = render(page, source.slice(match[0].length))
    .replaceAll("{{recipes}}", recipeCards())
    .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name))
    .replaceAll("{{root}}", root);
  const unresolved = html.match(/\{\{[^}]*\}\}/);
  if (unresolved) throw new Error(`${relative}: unresolved placeholder ${unresolved[0]}`);
  const target = path.join(out, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
  count += 1;
}
console.log(`Built ${count} pages into ${path.relative(process.cwd(), out) || "."}`);
