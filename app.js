const feedBase = "https://raw.githubusercontent.com/RedBamboo-Interactive/redleaf-releases/release-feed";
// Switch this single public-page preference to "stable" only after the Stable pointer exists.
const channels = ["nightly"];

const button = document.querySelector("#download-button");
const label = document.querySelector("#download-label");
const meta = document.querySelector("#download-meta");
const note = document.querySelector("#release-note");
const hashToggle = document.querySelector("#hash-toggle");
const hash = document.querySelector("#release-hash");
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
      return { channel, pointer: pointer.payload, release: record.payload };
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
    button.href = release.artifact.url;
    button.download = "RedLeaf-Setup.exe";
    button.removeAttribute("aria-disabled");
    button.classList.remove("is-loading");
    label.textContent = `Download ${channelName} for Windows`;
    meta.textContent = `v${release.version} · ${formatBytes(release.artifact.sizeBytes)}`;
    note.textContent = `${channelName} · Windows x64 · Published ${new Date(release.publishedAt).toLocaleDateString()}`;
    hash.textContent = release.artifact.sha256;
    hashToggle.hidden = false;
    footerVersion.textContent = `RedLeaf Setup ${release.version} · ${channelName}`;
    if (channel === "stable") {
      trustNote.textContent = "The installer and every downloaded component are verified against RedLeaf’s signed release feed.";
    }
  })
  .catch(() => {
    button.removeAttribute("href");
    button.setAttribute("aria-disabled", "true");
    label.textContent = "Download temporarily unavailable";
    meta.textContent = "Try again later";
    note.textContent = "The release feed could not be reached. No unverified fallback will be offered.";
  });

hashToggle.addEventListener("click", () => {
  const willShow = hash.hidden;
  hash.hidden = !willShow;
  hashToggle.textContent = willShow ? "Hide SHA-256" : "Show SHA-256";
});
