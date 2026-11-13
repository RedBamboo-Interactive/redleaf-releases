// Each platform has its own signed release feed; its launcher record names the version and hash.
const roots = {
  windows: "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed",
  linux: "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed-linux-x64",
};
const channels = ["nightly"];

const downloadButton = document.querySelector("#download-button");
const downloadLabel = document.querySelector("#download-label");
const downloadMeta = document.querySelector("#download-meta");
const releaseNote = document.querySelector("#release-note");
const hashToggle = document.querySelector("#hash-toggle");
const releaseHash = document.querySelector("#release-hash");
const footerVersion = document.querySelector("#footer-version");
const trustNote = document.querySelector("#trust-note");
const cardTitle = document.querySelector("#release-card-title");
const linuxDownload = document.querySelector("#linux-download");
const linuxLabel = document.querySelector("#linux-label");
const linuxMeta = document.querySelector("#linux-meta");
const linuxNote = document.querySelector("#linux-note");
const linuxCommand = document.querySelector("#linux-command");
const linuxCopy = document.querySelector("#linux-copy");
const linuxHashToggle = document.querySelector("#linux-hash-toggle");
const linuxHash = document.querySelector("#linux-hash");
const platformTabs = [...document.querySelectorAll("[data-platform]")];
const footers = { windows: "Current Windows release", linux: "Current Linux release" };
let platform = detectPlatform();

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

function showPlatform(next) {
  platform = next;
  platformTabs.forEach((tab) => {
    const selected = tab.dataset.platform === next;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== next; });
  cardTitle.textContent = next === "linux" ? "Linux preview" : "Windows preview";
  footerVersion.textContent = footers[next];
}

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;
const titleCase = (channel) => channel[0].toUpperCase() + channel.slice(1);

resolveRelease(roots.windows).then(({ channel, release }) => {
  const channelName = titleCase(channel);
  downloadButton.href = release.artifact.url;
  downloadButton.download = "RedLeaf-Setup.exe";
  downloadButton.removeAttribute("aria-disabled");
  downloadButton.classList.remove("is-loading");
  downloadLabel.textContent = `Download ${channelName}`;
  downloadMeta.textContent = `v${release.version} · ${formatBytes(release.artifact.sizeBytes)}`;
  releaseNote.textContent = `${channelName} · Windows x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
  releaseHash.textContent = release.artifact.sha256;
  hashToggle.hidden = false;
  footers.windows = `RedLeaf Setup ${release.version} · ${channelName}`;
  if (platform === "windows") footerVersion.textContent = footers.windows;
  if (channel === "stable") trustNote.querySelector("p").innerHTML = "<strong>Verified release.</strong> The installer and downloaded components are checked against RedLeaf’s signed release feed.";
}).catch(() => {
  downloadButton.removeAttribute("href");
  downloadButton.setAttribute("aria-disabled", "true");
  downloadLabel.textContent = "Download temporarily unavailable";
  downloadMeta.textContent = "Try again later";
  releaseNote.textContent = "The signed release feed could not be reached. No unverified fallback is offered.";
});

// The Linux launcher ships as redleaf-linux-x64.tar.gz with install.sh in the same release; the
// signed record names the launcher inside the archive, which install.sh checks before running it.
resolveRelease(roots.linux).then(({ channel, release }) => {
  if (release.targetPlatform?.operatingSystem !== "linux") throw new Error("The Linux feed names no Linux launcher.");
  const channelName = titleCase(channel);
  const releaseBase = release.artifact.url.slice(0, release.artifact.url.lastIndexOf("/"));
  linuxDownload.href = `${releaseBase}/redleaf-linux-x64.tar.gz`;
  linuxDownload.download = "redleaf-linux-x64.tar.gz";
  linuxDownload.removeAttribute("aria-disabled");
  linuxDownload.classList.remove("is-loading");
  linuxLabel.textContent = `Download ${channelName}`;
  linuxMeta.textContent = `v${release.version}`;
  linuxCommand.textContent = `curl -fsSL ${releaseBase}/install.sh | sh`;
  linuxCopy.disabled = false;
  linuxNote.textContent = `${channelName} · Linux x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
  linuxHash.textContent = `${release.artifact.sha256}  redleaf-launcher`;
  linuxHashToggle.hidden = false;
  footers.linux = `RedLeaf ${release.version} for Linux · ${channelName}`;
  if (platform === "linux") footerVersion.textContent = footers.linux;
}).catch(() => {
  linuxDownload.removeAttribute("href");
  linuxDownload.setAttribute("aria-disabled", "true");
  linuxLabel.textContent = "Linux download not available yet";
  linuxMeta.textContent = "Try again later";
  linuxCommand.textContent = "The Linux release is not published yet.";
  linuxNote.textContent = "The signed Linux release feed could not be reached. No unverified fallback is offered.";
});

platformTabs.forEach((tab) => tab.addEventListener("click", () => showPlatform(tab.dataset.platform)));
showPlatform(platform);

linuxCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(linuxCommand.textContent);
    linuxCopy.textContent = "Copied";
  } catch {
    window.getSelection().selectAllChildren(linuxCommand);
    linuxCopy.textContent = "Press Ctrl+C";
  }
  setTimeout(() => { linuxCopy.textContent = "Copy"; }, 2000);
});

hashToggle.addEventListener("click", () => {
  const show = releaseHash.hidden;
  releaseHash.hidden = !show;
  hashToggle.textContent = show ? "Hide SHA-256" : "Show SHA-256";
});

linuxHashToggle.addEventListener("click", () => {
  const show = linuxHash.hidden;
  linuxHash.hidden = !show;
  linuxHashToggle.textContent = show ? "Hide SHA-256" : "Show SHA-256";
});

const demo = document.querySelector("#product-demo");
const demoRegion = document.querySelector("#inside");
const tabList = document.querySelector(".demo-tabs");
const tabs = [...document.querySelectorAll("[data-demo-phase]")];
const scenes = [...document.querySelectorAll("[data-scene]")];
const phases = tabs.map((tab) => tab.dataset.demoPhase);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activePhase = phases[0];
let autoplayTimer = null;
let interactionPaused = false;

function setAutoplayState(enabled) {
  const value = enabled ? "on" : "off";
  demo.dataset.autoplay = value;
  tabList.dataset.autoplay = value;
}

function setDemoPhase(phase, focus = false) {
  if (!phases.includes(phase)) return;
  activePhase = phase;
  demo.dataset.phase = phase;
  tabs.forEach((tab) => {
    const selected = tab.dataset.demoPhase === phase;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  scenes.forEach((scene) => {
    const selected = scene.dataset.scene === phase;
    scene.classList.toggle("active", selected);
    scene.setAttribute("aria-hidden", String(!selected));
  });
}

function stopAutoplay() {
  if (autoplayTimer !== null) clearInterval(autoplayTimer);
  autoplayTimer = null;
  setAutoplayState(false);
}

function startAutoplay() {
  if (reducedMotion.matches || interactionPaused || document.hidden) return stopAutoplay();
  if (autoplayTimer !== null) clearInterval(autoplayTimer);
  setAutoplayState(true);
  autoplayTimer = setInterval(() => setDemoPhase(phases[(phases.indexOf(activePhase) + 1) % phases.length]), 6400);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => { setDemoPhase(tab.dataset.demoPhase); startAutoplay(); });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = phases.indexOf(activePhase);
    const next = event.key === "Home" ? 0 : event.key === "End" ? phases.length - 1 : event.key === "ArrowLeft" ? (current - 1 + phases.length) % phases.length : (current + 1) % phases.length;
    setDemoPhase(phases[next], true);
  });
});

demoRegion.addEventListener("pointerenter", () => { interactionPaused = true; stopAutoplay(); });
demoRegion.addEventListener("pointerleave", () => { interactionPaused = false; startAutoplay(); });
demoRegion.addEventListener("focusin", () => { interactionPaused = true; stopAutoplay(); });
demoRegion.addEventListener("focusout", (event) => { if (!demoRegion.contains(event.relatedTarget)) { interactionPaused = false; startAutoplay(); } });
reducedMotion.addEventListener("change", startAutoplay);
document.addEventListener("visibilitychange", startAutoplay);

setDemoPhase(activePhase);
startAutoplay();
