// Shared page chrome for the public RedLeaf site. build.mjs wraps every page body in it, once per
// language. Chrome text comes from i18n.mjs; {{root}} links are resolved by build.mjs (pages go to
// the page's language, assets to the site root) and {{site}} is always the site root.
import { locales, strings } from "./i18n.mjs";

export const DISCORD_URL = "https://discord.gg/FWMQtGzw3y";
export const GITHUB_URL = "https://github.com/RedBamboo-Interactive/redleaf-releases";

/** Cookbook use cases, in reading order. Titles and summaries live in i18n.mjs under `recipes`. */
export const recipes = [
  { slug: "build", icon: "game-controller", tone: "blue" },
  { slug: "create", icon: "sparkle", tone: "rose" },
  { slug: "organize", icon: "folder-simple", tone: "green" },
  { slug: "plan", icon: "calendar-check", tone: "amber" },
  { slug: "automate", icon: "heartbeat", tone: "rose" },
  { slug: "learn", icon: "chat-circle", tone: "green" },
  { slug: "ship", icon: "git-pull-request", tone: "blue", group: "work", featured: true },
  { slug: "support", icon: "chats-circle", tone: "violet", group: "work" },
  { slug: "inbox", icon: "envelope-simple", tone: "teal", group: "work" },
  { slug: "report", icon: "chart-line-up", tone: "amber", group: "work" },
  { slug: "customers", icon: "handshake", tone: "green", group: "work", featured: true },
  { slug: "sprints", icon: "kanban", tone: "orange", group: "work", featured: true },
].map((r) => ({ group: "personal", featured: ["build", "create", "plan"].includes(r.slug), ...r }));

/**
 * Cookbook videos, in episode order. Titles live in i18n.mjs under `videos`. An episode with a poster
 * has its own page at cookbook/videos/<slug>/ and appears in the sidebar; the others are listed as
 * coming soon. `youtube` stays empty until the video is public, which keeps its player a disabled poster.
 */
export const videos = [
  { slug: "talking-to-nova", number: "00", icon: "chats-circle", tone: "blue", duration: "2:18", poster: "videos/00-talking-to-nova.webp", youtube: "" },
  { slug: "nova-workspace", number: "01", icon: "star", tone: "rose", duration: "3:16", poster: "videos/01-nova-workspace.webp", youtube: "" },
  { slug: "your-workspace", number: "02", icon: "folder-simple", tone: "green", duration: "2:34", poster: "videos/02-your-workspace.webp", youtube: "" },
  { slug: "projects", number: "03", icon: "calendar-check", tone: "amber", duration: "2:07", poster: "videos/03-projects.webp", youtube: "" },
  { slug: "while-away", number: "04", icon: "heartbeat", tone: "violet", duration: "2:31", poster: "videos/04-while-away.webp", youtube: "" },
];

/** Cookbook sections, in order. Their labels live in i18n.mjs under `cookbook.groups`. */
export const recipeGroups = ["personal", "work"];

/** Documentation, in reading order: from installing to expert topics. Titles live in i18n.mjs under `docTitles`. */
export const docs = [
  { group: "start", pages: ["", "install-windows", "install-linux", "first-run", "first-conversation"] },
  { group: "everyday", pages: ["chat", "voice", "agents", "memory", "code", "branches", "create", "automations"] },
  { group: "further", pages: ["providers", "access-levels", "skills", "extensions", "database", "remote-access", "backups", "updates", "api"] },
  { group: "help", pages: ["troubleshooting", "shortcuts", "uninstall"] },
];
const docsFlat = docs.flatMap((g) => g.pages);

export const legalPages = [
  { href: "legal/privacy/", key: "privacy" },
  { href: "legal/terms/", key: "terms" },
  { href: "legal/notice/", key: "notice" },
  { href: "legal/security/", key: "security" },
];

export const icon = (name, cls = "") => `<svg class="i${cls ? ` ${cls}` : ""}" aria-hidden="true"><use href="{{root}}icons.svg#${name}"></use></svg>`;

const discordPath = "M19.54 5.34A16.3 16.3 0 0 0 15.44 4l-.5 1.02a15.1 15.1 0 0 0-5.88 0L8.56 4a16.4 16.4 0 0 0-4.1 1.35C1.86 9.2 1.16 12.94 1.5 16.62a16.6 16.6 0 0 0 5.03 2.55l1.23-1.69a10.7 10.7 0 0 1-1.94-.93l.48-.37c3.74 1.73 7.8 1.73 11.49 0l.48.37c-.62.37-1.27.68-1.95.93l1.23 1.69a16.5 16.5 0 0 0 5.03-2.55c.4-4.27-.68-7.98-3.04-11.28ZM8.7 14.37c-1.13 0-2.05-1.04-2.05-2.31s.9-2.31 2.05-2.31 2.07 1.04 2.05 2.31c0 1.27-.91 2.31-2.05 2.31Zm6.6 0c-1.13 0-2.05-1.04-2.05-2.31s.9-2.31 2.05-2.31 2.07 1.04 2.05 2.31c0 1.27-.9 2.31-2.05 2.31Z";
const githubPath = "M12 2.75a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.67c-2.67.58-3.23-1.13-3.23-1.13-.44-1.11-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.46 2.24 1.04 2.79.8.09-.62.34-1.04.61-1.28-2.13-.24-4.37-1.06-4.37-4.75 0-1.05.38-1.91.99-2.58-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.61.98A9.1 9.1 0 0 1 12 7.35a9.1 9.1 0 0 1 2.38.32c1.81-1.24 2.61-.98 2.61-.98.52 1.32.19 2.3.09 2.54.62.67.99 1.53.99 2.58 0 3.69-2.24 4.5-4.38 4.74.35.3.65.88.65 1.78v2.47c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.75Z";

const escapeAttr = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

/**
 * Language menu: every language, each named in itself and linking to this page's counterpart, the
 * current one ticked. A native <details> so it opens without JavaScript; site.js adds outside-click,
 * Escape and arrow keys. `place` is "down" in the header and "up" in the footer.
 */
function languageMenu(ctx, place) {
  const current = ctx.alternates.find((a) => a.code === ctx.locale);
  const items = ctx.alternates.map((a) => {
    const here = a.code === ctx.locale;
    return `<li><a href="${a.rel}" hreflang="${a.code}" lang="${a.code}" data-lang-choice="${a.code}"${here ? ' aria-current="true"' : ""}><span>${a.name}</span><small>${a.code.toUpperCase()}</small>${here ? icon("check", "lang-tick") : ""}</a></li>`;
  }).join("");
  return `<details class="lang-menu lang-menu-${place}" data-lang-menu>
      <summary aria-label="${ctx.t.language}: ${current.name}">${icon("globe-simple")}<span class="lang-name">${current.name}</span><span class="lang-code">${current.code.toUpperCase()}</span>${icon("caret-down", "lang-caret")}</summary>
      <div class="lang-panel"><p>${ctx.t.language}</p><ul>${items}</ul></div>
    </details>`;
}

/** Hidden offers to switch language, each written in its own language; site.js shows one when the browser prefers it. */
function languageSuggestions(ctx) {
  return ctx.alternates.filter((a) => a.code !== ctx.locale).map((a) => {
    const s = strings[a.code].suggest;
    return `<aside class="lang-suggest" data-lang-suggest="${a.code}" lang="${a.code}" hidden><div class="page-width"><p>${s.text}</p><a href="${a.rel}" hreflang="${a.code}" data-lang-choice="${a.code}">${s.action}</a><button type="button" data-lang-dismiss aria-label="${s.dismiss}">${icon("x")}</button></div></aside>`;
  }).join("");
}

function header(page, ctx) {
  const { t } = ctx;
  const current = (section) => (page.section === section ? ' aria-current="page"' : "");
  return `<a class="skip-link" href="#main">${t.skip}</a>
${languageSuggestions(ctx)}
<header class="topbar${page.layout === "landing" ? " topbar-over" : ""}">
  <div class="page-width topbar-inner">
    <a class="brand" href="{{root}}" aria-label="${t.homeLabel}"><img src="{{root}}favicon.svg" alt="" width="28" height="28" /><span>Red<span>Leaf</span></span></a>
    <nav class="site-nav" aria-label="${t.navLabel}">
      <a href="{{root}}#demo"${current("product")}>${t.nav.product}</a>
      <a href="{{root}}cookbook/"${current("cookbook")}>${t.nav.cookbook}</a>
      <a href="{{root}}docs/"${current("docs")}>${t.nav.docs}</a>
    </nav>
    <div class="header-links">
      ${languageMenu(ctx, "down")}
      <a class="header-link" href="${DISCORD_URL}" aria-label="${t.discordLabel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${discordPath}" /></svg><span>Discord</span></a>
      <a class="header-link" href="${GITHUB_URL}" aria-label="${t.githubLabel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${githubPath}" /></svg><span>GitHub</span></a>
      <a class="header-cta" href="{{root}}#download"${current("download")}>${icon("download-simple")}<span>${t.nav.download}</span></a>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { t } = ctx;
  const f = t.footer;
  return `<footer class="site-footer">
  <div class="page-width footer-grid">
    <div class="footer-brand">
      <a class="brand" href="{{root}}"><img src="{{root}}favicon.svg" alt="" width="28" height="28" /><span>Red<span>Leaf</span></span></a>
      <p>${f.tagline}</p>
    </div>
    <nav aria-label="${f.product}"><h2>${f.product}</h2><a href="{{root}}#download">${f.download}</a><a href="{{root}}cookbook/">${f.cookbook}</a><a href="{{root}}docs/">${f.docs}</a><a href="${GITHUB_URL}/releases">${f.releases}</a></nav>
    <nav aria-label="${f.community}"><h2>${f.community}</h2><a href="${DISCORD_URL}">${f.discord}</a><a href="${GITHUB_URL}">${f.github}</a><a href="{{root}}legal/security/">${f.vulnerability}</a></nav>
    <nav aria-label="${f.legal}"><h2>${f.legal}</h2>${legalPages.map((l) => `<a href="{{root}}${l.href}">${t.legal[l.key]}</a>`).join("")}<a href="{{root}}privacy/usage-sharing/">${f.usageNotice}</a></nav>
  </div>
  <div class="page-width footer-base"><span>${f.copyright}</span>${languageMenu(ctx, "up")}<span id="footer-version">${f.version}</span></div>
</footer>`;
}

function cookbookNav(page, { t }) {
  return `<nav class="doc-nav" aria-label="${t.cookbook.navLabel}">
  <a class="doc-nav-home${page.slug === "" ? " active" : ""}" href="{{root}}cookbook/">${icon("book-open")}<span>${t.cookbook.overview}</span></a>
  <p>${t.cookbook.groups.videos}</p>
  ${videos.filter((v) => v.poster).map((v) => `<a href="{{root}}cookbook/videos/${v.slug}/"${page.slug === `videos/${v.slug}` ? ' class="active" aria-current="page"' : ""}><span class="tone tone-${v.tone} video-tone">${icon(v.icon)}<span class="play-badge">${icon("play-fill")}</span></span><span><b>${t.videos[v.slug].title}</b><small>${t.cookbook.episode} ${v.number} · ${v.duration}</small></span></a>`).join("\n  ")}
  ${recipeGroups.map((group) => `<p>${t.cookbook.groups[group]}</p>
  ${recipes.filter((r) => r.group === group).map((r) => `<a href="{{root}}cookbook/${r.slug}/"${r.slug === page.slug ? ' class="active" aria-current="page"' : ""}><span class="tone tone-${r.tone}">${icon(r.icon)}</span><span><b>${t.recipes[r.slug].title}</b><small>${t.recipes[r.slug].headline}</small></span></a>`).join("\n  ")}`).join("\n  ")}
</nav>`;
}

function recipePager(slug, { t }) {
  const index = recipes.findIndex((r) => r.slug === slug);
  if (index < 0) return "";
  const prev = recipes[index - 1];
  const next = recipes[index + 1];
  return `<nav class="pager" aria-label="${t.cookbook.pagerLabel}">
  ${prev ? `<a class="prev" href="{{root}}cookbook/${prev.slug}/"><small>${t.pager.previous}</small><b>${t.recipes[prev.slug].title}</b></a>` : "<span></span>"}
  ${next ? `<a class="next" href="{{root}}cookbook/${next.slug}/"><small>${t.pager.next}</small><b>${t.recipes[next.slug].title}</b></a>` : `<a class="next" href="{{root}}#download"><small>${t.cookbook.ready}</small><b>${t.cookbook.download}</b></a>`}
</nav>`;
}

/** A video's click-to-load player, placed with {{video:slug}}. site.js swaps in YouTube on click. */
export function videoPlayer({ t }, slug) {
  const v = videos.find((x) => x.slug === slug);
  if (!v?.poster) throw new Error(`No published video "${slug}" for {{video:${slug}}}`);
  return `<button type="button" class="video-player" data-youtube="${v.youtube}" data-title="${escapeAttr(t.videos[slug].title)}" aria-label="${t.cookbook.play}" disabled>`
    + `<img src="{{site}}${v.poster}" alt="" width="1280" height="720" /><span class="video-play">${icon("play-fill")}</span><span class="video-soon">${t.cookbook.soon}</span></button>`;
}

/** The cookbook overview's video block, placed with {{videos}}: the whole series in order, starting at 00. */
export function videoSeries({ t }) {
  return `<section class="video-series" aria-labelledby="video-series-title">
  <h2 class="recipe-group" id="video-series-title">${t.cookbook.groups.videos}</h2>
  <p class="video-intro">${t.cookbook.seriesIntro}</p>
  <ol class="video-grid">
    ${videos.map((v, i) => v.poster
      ? `<li><a class="video-card" href="{{root}}cookbook/videos/${v.slug}/"><span class="video-thumb"><img src="{{site}}${v.poster}" alt="" width="1280" height="720" loading="lazy" /><span class="video-num">${v.number}</span><span class="video-dur">${v.duration}</span>${i === 0 ? `<span class="video-start">${t.cookbook.startHere}</span>` : ""}</span><b>${t.videos[v.slug].title}</b><p>${t.videos[v.slug].summary}</p></a></li>`
      : `<li><div class="video-card soon"><span class="video-thumb"><span class="video-num">${v.number}</span><span class="video-dur">${t.cookbook.soon}</span></span><b>${t.videos[v.slug].title}</b></div></li>`).join("\n    ")}
  </ol>
</section>`;
}

/** The recipe grid that pages place with {{recipes}} (every use case), {{recipes:featured}}, {{recipes:personal}} or {{recipes:work}}. */
export function recipeCards({ t }, filter = "") {
  const shown = !filter ? recipes : filter === "featured" ? recipes.filter((r) => r.featured) : recipes.filter((r) => r.group === filter);
  if (!shown.length) throw new Error(`No recipes match {{recipes:${filter}}}`);
  return shown.map((r) => {
    const c = t.recipes[r.slug];
    return `<a class="recipe-card" href="{{root}}cookbook/${r.slug}/"><span class="tone tone-${r.tone}">${icon(r.icon)}</span><small>${c.title}</small><b>${c.headline}</b><p>${c.summary}</p><em>${t.cookbook.seeHow} ${icon("arrow-right")}</em></a>`;
  }).join("\n");
}

const docHref = (slug) => `{{root}}docs/${slug ? `${slug}/` : ""}`;

function docsNav(page, { t }) {
  return `<nav class="doc-nav docs-nav" aria-label="${t.docsChrome.navLabel}">
  ${docs.map((g) => `<p>${t.docGroups[g.group]}</p>
  ${g.pages.map((slug) => `<a href="${docHref(slug)}"${slug === page.slug ? ' class="active" aria-current="page"' : ""}><span><b>${t.docTitles[slug]}</b></span></a>`).join("\n  ")}`).join("\n  ")}
</nav>`;
}

function docsPager(slug, { t }) {
  const index = docsFlat.indexOf(slug);
  if (index < 0) return "";
  const prev = docsFlat[index - 1];
  const next = docsFlat[index + 1];
  return `<nav class="pager" aria-label="${t.docsChrome.pagerLabel}">
  ${prev !== undefined ? `<a class="prev" href="${docHref(prev)}"><small>${t.pager.previous}</small><b>${t.docTitles[prev]}</b></a>` : "<span></span>"}
  ${next !== undefined ? `<a class="next" href="${docHref(next)}"><small>${t.pager.next}</small><b>${t.docTitles[next]}</b></a>` : `<a class="next" href="{{root}}cookbook/"><small>${t.docsChrome.ideas}</small><b>${t.docsChrome.browseCookbook}</b></a>`}
</nav>`;
}

/**
 * Wraps one page body. `ctx` is { locale, t, alternates: [{ code, name, og, abs, rel }], fallback }:
 * `fallback` is true when the body is the English original standing in for a missing translation.
 */
export function render(page, body, ctx) {
  const { t } = ctx;
  if (ctx.fallback) body = `<p class="untranslated" lang="${ctx.locale}">${t.untranslated}</p><div lang="en">${body}</div>`;
  let main;
  if (page.layout === "doc") {
    main = `<div class="doc-shell page-width">${cookbookNav(page, ctx)}<main id="main" class="doc-main">${body}${recipePager(page.slug, ctx)}</main></div>`;
  } else if (page.layout === "docs") {
    main = `<div class="doc-shell page-width">${docsNav(page, ctx)}<main id="main" class="doc-main docs-main">${body}${docsPager(page.slug, ctx)}</main></div>`;
  } else if (page.layout === "legal") {
    main = `<div class="legal-shell page-width"><nav class="legal-nav" aria-label="${t.legal.navLabel}">${legalPages.map((l) => `<a href="{{root}}${l.href}"${page.path === l.href ? ' aria-current="page"' : ""}>${t.legal[l.key]}</a>`).join("")}<a href="{{root}}privacy/usage-sharing/"${page.path === "privacy/usage-sharing/" ? ' aria-current="page"' : ""}>${t.legal.usage}</a></nav><main id="main" class="legal">${body}</main></div>`;
  } else {
    main = `<main id="main">${body}</main>`;
  }
  const self = ctx.alternates.find((a) => a.code === ctx.locale);
  const og = locales.find((l) => l.code === ctx.locale).og;
  const alternateLinks = [
    ...ctx.alternates.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${a.abs}" />`),
    `<link rel="alternate" hreflang="x-default" href="${ctx.alternates[0].abs}" />`,
  ].join("\n    ");
  const runtime = JSON.stringify(t.runtime).replaceAll("<", "\\u003c");
  const scripts = (page.scripts ?? ["site.js"]).map((s) => `<script src="{{root}}${s}" defer></script>`).join("\n    ");
  return `<!doctype html>
<html lang="${ctx.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${page.title}</title>
    <meta name="description" content="${escapeAttr(page.description)}" />
    <meta name="theme-color" content="#1d1f25" />
    <link rel="canonical" href="${self.abs}" />
    ${alternateLinks}
    <meta property="og:title" content="${escapeAttr(page.title)}" />
    <meta property="og:description" content="${escapeAttr(page.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${self.abs}" />
    <meta property="og:locale" content="${og}" />
    ${ctx.alternates.filter((a) => a.code !== ctx.locale).map((a) => `<meta property="og:locale:alternate" content="${a.og}" />`).join("\n    ")}
    <link rel="icon" href="{{root}}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="{{root}}styles.css" />
    <script type="application/json" id="site-strings">${runtime}</script>
    ${scripts}
  </head>
  <body class="layout-${page.layout ?? "page"}">
    ${header(page, ctx)}
    ${main}
    ${footer(ctx)}
  </body>
</html>
`;
}
