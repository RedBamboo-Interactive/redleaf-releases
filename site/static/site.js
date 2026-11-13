// RedLeaf public site: release feed resolution, install controls, and the scripted product demos.

/* ───────────────────────── Release feed ───────────────────────── */

// Each platform has its own signed release feed; its launcher record names the version and hash.
const feedRoots = {
  windows: "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed",
  linux: "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed-linux-x64",
};
const channels = ["nightly"];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function resolveRelease(feedBase) {
  for (const channel of channels) {
    try {
      const pointer = await fetchJson(`${feedBase}/components/redleaf-launcher/channels/${channel}.json`);
      const record = await fetchJson(pointer.payload.record.url);
      return { channel, release: record.payload };
    } catch (error) {
      if (channel === channels.at(-1)) throw error;
    }
  }
  throw new Error("No release channel is available.");
}

/** The visitor's platform: Linux on a Linux desktop, Windows otherwise (including Android and ChromeOS). */
function detectPlatform() {
  const agent = (navigator.userAgent || "").toLowerCase();
  const hint = (navigator.userAgentData?.platform || navigator.platform || agent).toLowerCase();
  if (agent.includes("android") || agent.includes("cros")) return "windows";
  return hint.includes("linux") || hint.includes("x11") ? "linux" : "windows";
}

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;
const titleCase = (channel) => channel[0].toUpperCase() + channel.slice(1);
const footerVersion = $("#footer-version");
const footers = { windows: "Nightly preview", linux: "Nightly preview" };
let platform = detectPlatform();

function showPlatform(next) {
  platform = next;
  $$("[data-platform]").forEach((tab) => {
    const selected = tab.dataset.platform === next;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  $$("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== next; });
  $$("[data-platform-label]").forEach((label) => { label.textContent = next === "linux" ? "Linux" : "Windows"; });
  if (footerVersion) footerVersion.textContent = footers[next];
}

function failDownload(button, label, meta, note, message) {
  button.removeAttribute("href");
  button.setAttribute("aria-disabled", "true");
  label.textContent = message.label;
  meta.textContent = "Try again later";
  note.textContent = message.note;
}

function wireHashToggle(toggle, hash) {
  toggle?.addEventListener("click", () => {
    const show = hash.hidden;
    hash.hidden = !show;
    toggle.textContent = show ? "Hide SHA-256" : "Show SHA-256";
  });
}

if ($("#download-button")) {
  const win = { button: $("#download-button"), label: $("#download-label"), meta: $("#download-meta"), note: $("#release-note"), toggle: $("#hash-toggle"), hash: $("#release-hash") };
  const lin = { button: $("#linux-download"), label: $("#linux-label"), meta: $("#linux-meta"), note: $("#linux-note"), toggle: $("#linux-hash-toggle"), hash: $("#linux-hash"), command: $("#linux-command"), copy: $("#linux-copy") };

  resolveRelease(feedRoots.windows).then(({ channel, release }) => {
    const channelName = titleCase(channel);
    win.button.href = release.artifact.url;
    win.button.download = "RedLeaf-Setup.exe";
    win.button.removeAttribute("aria-disabled");
    win.button.classList.remove("is-loading");
    win.label.textContent = `Download ${channelName}`;
    win.meta.textContent = `v${release.version} · ${formatBytes(release.artifact.sizeBytes)}`;
    win.note.textContent = `${channelName} · Windows x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
    win.hash.textContent = release.artifact.sha256;
    win.toggle.hidden = false;
    footers.windows = `RedLeaf Setup ${release.version} · ${channelName}`;
    if (platform === "windows" && footerVersion) footerVersion.textContent = footers.windows;
  }).catch(() => failDownload(win.button, win.label, win.meta, win.note, {
    label: "Download temporarily unavailable",
    note: "The signed release feed could not be reached. No unverified fallback is offered.",
  }));

  // The Linux launcher ships as redleaf-linux-x64.tar.gz with install.sh in the same release; the
  // signed record names the launcher inside the archive, which install.sh checks before running it.
  resolveRelease(feedRoots.linux).then(({ channel, release }) => {
    if (release.targetPlatform?.operatingSystem !== "linux") throw new Error("The Linux feed names no Linux launcher.");
    const channelName = titleCase(channel);
    const releaseBase = release.artifact.url.slice(0, release.artifact.url.lastIndexOf("/"));
    lin.button.href = `${releaseBase}/redleaf-linux-x64.tar.gz`;
    lin.button.download = "redleaf-linux-x64.tar.gz";
    lin.button.removeAttribute("aria-disabled");
    lin.button.classList.remove("is-loading");
    lin.label.textContent = `Download ${channelName}`;
    lin.meta.textContent = `v${release.version}`;
    lin.command.textContent = `curl -fsSL ${releaseBase}/install.sh | sh`;
    lin.copy.disabled = false;
    lin.note.textContent = `${channelName} · Linux x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
    lin.hash.textContent = `${release.artifact.sha256}  redleaf-launcher`;
    lin.toggle.hidden = false;
    footers.linux = `RedLeaf ${release.version} for Linux · ${channelName}`;
    if (platform === "linux" && footerVersion) footerVersion.textContent = footers.linux;
  }).catch(() => {
    failDownload(lin.button, lin.label, lin.meta, lin.note, {
      label: "Linux download not available yet",
      note: "The signed Linux release feed could not be reached. No unverified fallback is offered.",
    });
    lin.command.textContent = "The Linux release is not published yet.";
  });

  wireHashToggle(win.toggle, win.hash);
  wireHashToggle(lin.toggle, lin.hash);

  lin.copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lin.command.textContent);
      lin.copy.textContent = "Copied";
    } catch {
      window.getSelection().selectAllChildren(lin.command);
      lin.copy.textContent = "Press Ctrl+C";
    }
    setTimeout(() => { lin.copy.textContent = "Copy"; }, 2000);
  });
}

$$("[data-platform]").forEach((tab) => {
  tab.addEventListener("click", () => showPlatform(tab.dataset.platform));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    showPlatform(platform === "linux" ? "windows" : "linux");
    $(`[data-platform="${platform}"]`)?.focus();
  });
});
showPlatform(platform);

/* ───────────────────────── Header ───────────────────────── */

const topbar = $(".topbar");
const onScroll = () => topbar?.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ───────────────────────── Scripted demos ─────────────────────────
   Every demo is a recreation, not the product. A [data-demo] holds a static scene inside
   [data-stage]; elements with data-step="n" form its timeline, played in ascending n
   (equal numbers fire together):
     default            hidden until reached, then revealed
     data-fx="type"     revealed, then its text is typed
     data-fx="stream"   revealed, then its words stream in
     data-fx="mark"     invisible; only applies data-add / data-remove
     data-add / data-remove="selector|class; selector|class"   scoped to the demo
     data-wait="ms"     pause before the step (default 900)
   [data-seek="n"] jumps to step n, [data-demo-toggle] pauses or resumes, [data-demo-replay]
   restarts. A demo plays while on screen; with reduced motion it shows its finished state. */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class Demo {
  constructor(root) {
    this.root = root;
    this.stage = $("[data-stage]", root) ?? root;
    this.initial = this.stage.innerHTML;
    this.loop = Number(root.dataset.loop || 0);
    this.token = 0;
    this.playing = false;
    this.userPaused = false;
    this.visible = false;
    this.reset();
    root.addEventListener("click", (event) => this.onClick(event));
    if (reducedMotion.matches) this.settle();
    new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && !this.userPaused && !reducedMotion.matches) this.play();
      else if (!this.visible) this.pause();
    }, { threshold: 0.3 }).observe(root);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.pause();
      else if (this.visible && !this.userPaused && !reducedMotion.matches) this.play();
    });
  }

  reset() {
    this.stage.innerHTML = this.initial;
    const groups = new Map();
    $$("[data-step]", this.stage).forEach((el) => {
      const n = Number(el.dataset.step);
      if (!groups.has(n)) groups.set(n, []);
      groups.get(n).push(el);
    });
    this.list = [...groups.entries()].sort((a, b) => a[0] - b[0]);
    this.index = 0;
    this.progress(-Infinity);
  }

  onClick(event) {
    const seek = event.target.closest("[data-seek]");
    const toggle = event.target.closest("[data-demo-toggle]");
    const replay = event.target.closest("[data-demo-replay]");
    if (seek) { this.userPaused = false; this.seek(Number(seek.dataset.seek)); }
    else if (toggle) {
      if (this.playing) { this.userPaused = true; this.pause(); }
      else { this.userPaused = false; if (this.index >= this.list.length) this.reset(); this.play(); }
    } else if (replay) { this.userPaused = false; this.token += 1; this.reset(); this.play(); }
  }

  setControls() {
    $$("[data-demo-toggle]", this.root).forEach((button) => {
      button.setAttribute("aria-label", this.playing ? "Pause demo" : "Play demo");
      button.dataset.state = this.playing ? "playing" : "paused";
    });
    this.root.dataset.playing = String(this.playing);
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.setControls();
    this.run(++this.token);
  }

  pause() {
    this.playing = false;
    this.token += 1;
    this.setControls();
  }

  settle() {
    this.token += 1;
    this.reset();
    while (this.index < this.list.length) this.applyGroup(this.list[this.index++], true);
    this.progress(Infinity);
    this.playing = false;
    this.setControls();
  }

  seek(target) {
    this.token += 1;
    this.playing = false;
    this.reset();
    while (this.index < this.list.length && this.list[this.index][0] < target) this.applyGroup(this.list[this.index++], true);
    this.progress(target);
    if (reducedMotion.matches) this.setControls();
    else this.play();
  }

  sleep(ms, token) {
    return new Promise((resolve) => setTimeout(() => resolve(token === this.token), ms));
  }

  async run(token) {
    while (this.index < this.list.length) {
      const group = this.list[this.index];
      const wait = Math.max(...group[1].map((el) => Number(el.dataset.wait ?? 900)));
      if (!(await this.sleep(wait, token))) return;
      this.progress(group[0]);
      await this.applyGroup(group, false, token);
      if (token !== this.token) return;
      this.index += 1;
    }
    this.progress(Infinity);
    if (this.loop && (await this.sleep(this.loop, token))) {
      this.reset();
      this.run(token);
    } else if (token === this.token) {
      this.playing = false;
      this.setControls();
    }
  }

  applyGroup([, els], instant, token) {
    return Promise.all(els.map((el) => this.apply(el, instant, token)));
  }

  classOps(spec, method) {
    (spec || "").split(";").map((part) => part.trim()).filter(Boolean).forEach((part) => {
      const [selector, className] = part.split("|");
      $$(selector, this.stage).forEach((target) => target.classList[method](className));
    });
  }

  async apply(el, instant, token) {
    this.classOps(el.dataset.remove, "remove");
    this.classOps(el.dataset.add, "add");
    el.classList.add("on");
    const fx = el.dataset.fx;
    if (fx === "type") await this.type(el, instant, token);
    else if (fx === "stream") await this.stream(el, instant, token);
    if (fx !== "mark") this.follow(el, instant);
  }

  async type(el, instant, token) {
    const text = el.dataset.text ?? el.textContent;
    el.dataset.text = text;
    if (instant) { el.textContent = text; return; }
    el.textContent = "";
    el.classList.add("typing");
    for (let i = 1; i <= text.length; i += 1) {
      if (token !== this.token) { el.textContent = text; break; }
      el.textContent = text.slice(0, i);
      await new Promise((resolve) => setTimeout(resolve, text[i - 1] === " " ? 34 : 22 + Math.random() * 26));
    }
    el.classList.remove("typing");
  }

  async stream(el, instant, token) {
    if (instant) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const words = [];
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { fragment.append(part); return; }
        const span = document.createElement("span");
        span.className = "w";
        span.textContent = part;
        fragment.append(span);
        words.push(span);
      });
      node.replaceWith(fragment);
    });
    el.classList.add("streaming");
    for (const word of words) {
      if (token !== this.token) break;
      word.classList.add("on");
      await new Promise((resolve) => setTimeout(resolve, 38));
    }
    el.classList.remove("streaming");
    words.forEach((word) => word.classList.add("on"));
  }

  follow(el, instant) {
    const scroller = el.closest("[data-scroll]");
    if (!scroller) return;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: instant ? "auto" : "smooth" });
  }

  progress(step) {
    const chips = $$("[data-seek]", this.root);
    let current = null;
    chips.forEach((chip) => {
      const at = Number(chip.dataset.seek);
      chip.classList.toggle("done", at <= step);
      if (at <= step) current = chip;
      chip.removeAttribute("aria-current");
    });
    if (current && step !== Infinity) current.setAttribute("aria-current", "step");
    else if (step === Infinity && chips.length) chips.at(-1).setAttribute("aria-current", "step");
  }
}

$$("[data-demo]").forEach((root) => new Demo(root));
reducedMotion.addEventListener("change", () => window.location.reload());
