// Shared page chrome for the public RedLeaf site. build.mjs wraps every page body in it.

export const DISCORD_URL = "https://discord.gg/FWMQtGzw3y";
export const GITHUB_URL = "https://github.com/RedBamboo-Interactive/redleaf-releases";

/** Cookbook use cases, in reading order. The sidebar, the grids and the prev/next links all read this. */
export const recipes = [
  { slug: "build", title: "Build", headline: "Ship software with a coding team", icon: "code", tone: "blue", summary: "Describe the change. Nova hands it to a Code session that works in your repository, runs the tests and reports back." },
  { slug: "create", title: "Create", headline: "Images, voices and sound on your own GPU", icon: "sparkle", tone: "rose", summary: "Cover art, characters, narration and music, generated from a conversation and kept with the project." },
  { slug: "organize", title: "Organize", headline: "A memory you can open and edit", icon: "folder-simple", tone: "green", summary: "Notes, decisions and documents become pages in the agent's workspace, and a real folder on your disk." },
  { slug: "plan", title: "Plan", headline: "From a vague idea to a plan that holds", icon: "calendar-check", tone: "amber", summary: "Trips, launches and busy weeks: think it through together, then keep the plan where both of you can find it." },
  { slug: "automate", title: "Automate", headline: "Things that happen while you're away", icon: "heartbeat", tone: "rose", summary: "Heartbeats and schedules check on builds, inboxes and deadlines, and tell you only what changed." },
  { slug: "learn", title: "Learn", headline: "Agents with a personality and a purpose", icon: "chat-circle", tone: "green", summary: "Create a tutor, a coach or a sparring partner with its own voice, skills and memory of your progress." },
];

export const legalPages = [
  { href: "legal/privacy/", label: "Privacy" },
  { href: "legal/terms/", label: "Terms of use" },
  { href: "legal/notice/", label: "Legal notice" },
  { href: "legal/security/", label: "Security" },
];

export const icon = (name, cls = "") => `<svg class="i${cls ? ` ${cls}` : ""}" aria-hidden="true"><use href="{{root}}icons.svg#${name}"></use></svg>`;

const discordPath = "M19.54 5.34A16.3 16.3 0 0 0 15.44 4l-.5 1.02a15.1 15.1 0 0 0-5.88 0L8.56 4a16.4 16.4 0 0 0-4.1 1.35C1.86 9.2 1.16 12.94 1.5 16.62a16.6 16.6 0 0 0 5.03 2.55l1.23-1.69a10.7 10.7 0 0 1-1.94-.93l.48-.37c3.74 1.73 7.8 1.73 11.49 0l.48.37c-.62.37-1.27.68-1.95.93l1.23 1.69a16.5 16.5 0 0 0 5.03-2.55c.4-4.27-.68-7.98-3.04-11.28ZM8.7 14.37c-1.13 0-2.05-1.04-2.05-2.31s.9-2.31 2.05-2.31 2.07 1.04 2.05 2.31c0 1.27-.91 2.31-2.05 2.31Zm6.6 0c-1.13 0-2.05-1.04-2.05-2.31s.9-2.31 2.05-2.31 2.07 1.04 2.05 2.31c0 1.27-.9 2.31-2.05 2.31Z";
const githubPath = "M12 2.75a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.67c-2.67.58-3.23-1.13-3.23-1.13-.44-1.11-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.46 2.24 1.04 2.79.8.09-.62.34-1.04.61-1.28-2.13-.24-4.37-1.06-4.37-4.75 0-1.05.38-1.91.99-2.58-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.61.98A9.1 9.1 0 0 1 12 7.35a9.1 9.1 0 0 1 2.38.32c1.81-1.24 2.61-.98 2.61-.98.52 1.32.19 2.3.09 2.54.62.67.99 1.53.99 2.58 0 3.69-2.24 4.5-4.38 4.74.35.3.65.88.65 1.78v2.47c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.75Z";

function header(page) {
  const current = (section) => (page.section === section ? ' aria-current="page"' : "");
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar${page.layout === "landing" ? " topbar-over" : ""}">
  <div class="page-width topbar-inner">
    <a class="brand" href="{{root}}" aria-label="RedLeaf home"><img src="{{root}}favicon.svg" alt="" width="28" height="28" /><span>Red<span>Leaf</span></span></a>
    <nav class="site-nav" aria-label="Site">
      <a href="{{root}}#demo"${current("product")}>Product</a>
      <a href="{{root}}cookbook/"${current("cookbook")}>Cookbook</a>
      <a href="{{root}}#download"${current("download")}>Download</a>
    </nav>
    <div class="header-links">
      <a class="header-link" href="${DISCORD_URL}" aria-label="Join the Leaf Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${discordPath}" /></svg><span>Discord</span></a>
      <a class="header-link" href="${GITHUB_URL}" aria-label="RedLeaf Releases on GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${githubPath}" /></svg><span>GitHub</span></a>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="page-width footer-grid">
    <div class="footer-brand">
      <a class="brand" href="{{root}}"><img src="{{root}}favicon.svg" alt="" width="28" height="28" /><span>Red<span>Leaf</span></span></a>
      <p>A local home for AI agents, their conversations, their code sessions and their memory. Made by RedBamboo Interactive.</p>
    </div>
    <nav aria-label="Product"><h2>Product</h2><a href="{{root}}#download">Download</a><a href="{{root}}cookbook/">Cookbook</a><a href="${GITHUB_URL}/releases">Release history</a></nav>
    <nav aria-label="Community"><h2>Community</h2><a href="${DISCORD_URL}">Leaf Discord</a><a href="${GITHUB_URL}">GitHub</a><a href="{{root}}legal/security/">Report a vulnerability</a></nav>
    <nav aria-label="Legal"><h2>Legal</h2>${legalPages.map((l) => `<a href="{{root}}${l.href}">${l.label}</a>`).join("")}<a href="{{root}}privacy/usage-sharing/">Usage sharing notice</a></nav>
  </div>
  <div class="page-width footer-base"><span>© 2026 RedBamboo Interactive</span><span id="footer-version">Nightly preview</span></div>
</footer>`;
}

function cookbookNav(page) {
  return `<nav class="doc-nav" aria-label="Cookbook">
  <a class="doc-nav-home${page.slug === "" ? " active" : ""}" href="{{root}}cookbook/">${icon("book-open")}<span>Overview</span></a>
  <p>Use cases</p>
  ${recipes.map((r) => `<a href="{{root}}cookbook/${r.slug}/"${r.slug === page.slug ? ' class="active" aria-current="page"' : ""}><span class="tone tone-${r.tone}">${icon(r.icon)}</span><span><b>${r.title}</b><small>${r.headline}</small></span></a>`).join("\n  ")}
</nav>`;
}

function recipePager(slug) {
  const index = recipes.findIndex((r) => r.slug === slug);
  if (index < 0) return "";
  const prev = recipes[index - 1];
  const next = recipes[index + 1];
  return `<nav class="pager" aria-label="More use cases">
  ${prev ? `<a class="prev" href="{{root}}cookbook/${prev.slug}/"><small>Previous</small><b>${prev.title}</b></a>` : "<span></span>"}
  ${next ? `<a class="next" href="{{root}}cookbook/${next.slug}/"><small>Next</small><b>${next.title}</b></a>` : `<a class="next" href="{{root}}#download"><small>Ready?</small><b>Download RedLeaf</b></a>`}
</nav>`;
}

export function render(page, body) {
  let main;
  if (page.layout === "doc") {
    main = `<div class="doc-shell page-width">${cookbookNav(page)}<main id="main" class="doc-main">${body}${recipePager(page.slug)}</main></div>`;
  } else if (page.layout === "legal") {
    main = `<div class="legal-shell page-width"><nav class="legal-nav" aria-label="Legal pages">${legalPages.map((l) => `<a href="{{root}}${l.href}"${page.path === l.href ? ' aria-current="page"' : ""}>${l.label}</a>`).join("")}<a href="{{root}}privacy/usage-sharing/"${page.path === "privacy/usage-sharing/" ? ' aria-current="page"' : ""}>Usage sharing</a></nav><main id="main" class="legal">${body}</main></div>`;
  } else {
    main = `<main id="main">${body}</main>`;
  }
  const scripts = (page.scripts ?? ["site.js"]).map((s) => `<script src="{{root}}${s}" defer></script>`).join("\n    ");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="theme-color" content="#1d1f25" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:type" content="website" />
    <link rel="icon" href="{{root}}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="{{root}}styles.css" />
    ${scripts}
  </head>
  <body class="layout-${page.layout ?? "page"}">
    ${header(page)}
    ${main}
    ${footer()}
  </body>
</html>
`;
}
