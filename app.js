const feedBase = "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed";
// Switch this single public-page preference to "stable" only after the Stable pointer exists.
const channels = ["nightly"];

const downloadButton = document.querySelector("#download-button");
const downloadLabel = document.querySelector("#download-label");
const downloadMeta = document.querySelector("#download-meta");
const releaseNote = document.querySelector("#release-note");
const hashToggle = document.querySelector("#hash-toggle");
const releaseHash = document.querySelector("#release-hash");
const footerVersion = document.querySelector("#footer-version");
const trustNote = document.querySelector("#trust-note");

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function resolveRelease() {
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

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}

resolveRelease()
  .then(({ channel, release }) => {
    const channelName = channel[0].toUpperCase() + channel.slice(1);
    downloadButton.href = release.artifact.url;
    downloadButton.download = "RedLeaf-Setup.exe";
    downloadButton.removeAttribute("aria-disabled");
    downloadButton.classList.remove("is-loading");
    downloadLabel.textContent = `Download ${channelName} for Windows`;
    downloadMeta.textContent = `v${release.version} · ${formatBytes(release.artifact.sizeBytes)}`;
    releaseNote.textContent = `${channelName} · Windows x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
    releaseHash.textContent = release.artifact.sha256;
    hashToggle.hidden = false;
    footerVersion.textContent = `RedLeaf Setup ${release.version} · ${channelName}`;
    if (channel === "stable") {
      trustNote.querySelector("p").innerHTML = "<strong>Verified release.</strong> The installer and every downloaded component are checked against RedLeaf’s signed release feed.";
    }
  })
  .catch(() => {
    downloadButton.removeAttribute("href");
    downloadButton.setAttribute("aria-disabled", "true");
    downloadLabel.textContent = "Download temporarily unavailable";
    downloadMeta.textContent = "Try again later";
    releaseNote.textContent = "The release feed could not be reached. No unverified fallback will be offered.";
  });

hashToggle.addEventListener("click", () => {
  const willShow = releaseHash.hidden;
  releaseHash.hidden = !willShow;
  hashToggle.textContent = willShow ? "Hide SHA-256" : "Show SHA-256";
});

const demo = document.querySelector("#product-demo");
const demoRegion = document.querySelector("#product");
const demoTabs = Array.from(document.querySelectorAll("[data-demo-phase]"));
const demoScenes = Array.from(document.querySelectorAll("[data-scene]"));
const phases = demoTabs.map((tab) => tab.dataset.demoPhase);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activePhase = phases[0];
let autoplayTimer = null;
let interactionPaused = false;

function setAutoplayState(enabled) {
  const state = enabled ? "on" : "off";
  demo.dataset.autoplay = state;
  document.querySelector(".demo-tabs").dataset.autoplay = state;
}

function setDemoPhase(phase, moveFocus = false) {
  if (!phases.includes(phase)) return;
  activePhase = phase;
  demo.dataset.phase = phase;

  demoTabs.forEach((tab) => {
    const selected = tab.dataset.demoPhase === phase;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) tab.focus();
  });

  demoScenes.forEach((scene) => {
    const selected = scene.dataset.scene === phase;
    scene.classList.toggle("active", selected);
    scene.setAttribute("aria-hidden", String(!selected));
  });
}

function stopAutoplay() {
  if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
  autoplayTimer = null;
  setAutoplayState(false);
}

function startAutoplay() {
  if (reducedMotion.matches || interactionPaused || document.hidden) {
    stopAutoplay();
    return;
  }
  if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
  setAutoplayState(true);
  autoplayTimer = window.setInterval(() => {
    const nextIndex = (phases.indexOf(activePhase) + 1) % phases.length;
    setDemoPhase(phases[nextIndex]);
  }, 5200);
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setDemoPhase(tab.dataset.demoPhase);
    startAutoplay();
  });
  tab.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = phases.indexOf(activePhase);
    let next = current;
    if (event.key === 'ArrowLeft') next = (current - 1 + phases.length) % phases.length;
    if (event.key === 'ArrowRight') next = (current + 1) % phases.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = phases.length - 1;
    setDemoPhase(phases[next], true);
  });
});

demoRegion.addEventListener("pointerenter", () => {
  interactionPaused = true;
  stopAutoplay();
});
demoRegion.addEventListener("pointerleave", () => {
  interactionPaused = false;
  startAutoplay();
});
demoRegion.addEventListener("focusin", () => {
  interactionPaused = true;
  stopAutoplay();
});
demoRegion.addEventListener("focusout", (event) => {
  if (demoRegion.contains(event.relatedTarget)) return;
  interactionPaused = false;
  startAutoplay();
});
reducedMotion.addEventListener("change", startAutoplay);
document.addEventListener("visibilitychange", startAutoplay);

setDemoPhase(activePhase);
startAutoplay();
