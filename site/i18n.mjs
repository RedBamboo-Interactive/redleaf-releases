// Languages of the public site, and every string of the page chrome (header, footer, navigation,
// pagers, scripts). Page bodies are translated as whole files: site/pages/<locale>/ mirrors
// site/pages/en/ path for path, and the path is what links a page to its translations.
//
// Adding a language: add it to `locales`, add its `strings` (every key in `en`), then translate
// pages into site/pages/<code>/. Missing pages fall back to English with a notice, and the build
// lists them.

export const SITE_URL = "https://redbamboo-interactive.github.io/redleaf-releases/";

/** The first locale is the default: it is served at the site root, the others under /<code>/. */
export const locales = [
  { code: "en", name: "English", og: "en_GB" },
  { code: "fr", name: "Français", og: "fr_FR" },
];
export const defaultLocale = locales[0].code;
export const localePrefix = (code) => (code === defaultLocale ? "" : `${code}/`);

const en = {
  skip: "Skip to content",
  homeLabel: "RedLeaf home",
  navLabel: "Site",
  nav: { product: "Product", cookbook: "Cookbook", docs: "Docs", download: "Download" },
  discordLabel: "Join the Leaf Discord",
  githubLabel: "RedLeaf Releases on GitHub",
  language: "Language",
  footer: {
    tagline: "A local home for AI agents, their conversations, their code sessions and their memory. Made by RedBamboo Interactive.",
    product: "Product", download: "Download", cookbook: "Cookbook", docs: "Documentation", releases: "Release history",
    community: "Community", discord: "Leaf Discord", github: "GitHub", vulnerability: "Report a vulnerability",
    legal: "Legal", usageNotice: "Usage statistics notice", copyright: "© 2026 RedBamboo Interactive", version: "Nightly preview",
  },
  legal: { privacy: "Privacy", terms: "Terms of use", notice: "Legal notice", security: "Security", usage: "Usage statistics", navLabel: "Legal pages" },
  cookbook: { navLabel: "Cookbook", overview: "Overview", useCases: "Use cases", seeHow: "See how", pagerLabel: "More use cases", ready: "Ready?", download: "Download RedLeaf" },
  docsChrome: { navLabel: "Documentation", pagerLabel: "More documentation", ideas: "Ideas", browseCookbook: "Browse the cookbook" },
  pager: { previous: "Previous", next: "Next" },
  untranslated: "",
  suggest: { text: "This site is also available in English.", action: "Switch to English", dismiss: "Dismiss" },
  recipes: {
    build: { title: "Build", headline: "Your game, app or website, with Nova", summary: "Say what the project needs next. Nova runs the work in parallel coding sessions, merges what works and keeps the roadmap." },
    create: { title: "Create", headline: "Images, voices and sound on your own GPU", summary: "Cover art, characters, narration and music, generated from a conversation and kept with the project." },
    organize: { title: "Organize", headline: "A memory you can open and edit", summary: "Notes, decisions and documents become pages in the agent's workspace, and a real folder on your disk." },
    plan: { title: "Plan", headline: "From a vague idea to a plan that holds", summary: "Trips, launches and busy weeks: think it through together, then keep the plan where both of you can find it." },
    automate: { title: "Automate", headline: "Things that happen while you're away", summary: "Heartbeats and schedules check on builds, inboxes and deadlines, and tell you only what changed." },
    learn: { title: "Learn", headline: "Agents with a personality and a purpose", summary: "Create a tutor, a coach or a sparring partner with its own voice, skills and memory of your progress." },
  },
  docGroups: { start: "Get started", everyday: "Everyday use", further: "Going further", help: "Help" },
  docTitles: {
    "": "Overview", "install-windows": "Install on Windows", "install-linux": "Install on Linux", "first-run": "Set up RedLeaf",
    "first-conversation": "Your first conversation", chat: "Discussions and step squares", voice: "Voice and Float Nova",
    agents: "Nova and your own agents", memory: "Memory and the workspace", code: "Coding sessions",
    branches: "Branches and parallel work", create: "Images, voices and music", automations: "Schedules and the heartbeat",
    providers: "AI providers and local models", "access-levels": "Access levels", skills: "Skills and protocols",
    extensions: "Extensions", database: "Database and views", "remote-access": "Remote access", backups: "Backups",
    updates: "Updates", api: "The local API", troubleshooting: "Troubleshooting and Doctor", shortcuts: "Keyboard shortcuts",
    uninstall: "Uninstall and your data",
  },
  // Strings site.js sets at run time. {name} placeholders are filled in by the script.
  runtime: {
    download: "Download {channel}",
    published: "{channel} · {platform} · Published {date}",
    unavailable: "Download temporarily unavailable",
    unavailableNote: "The signed release feed could not be reached. No unverified fallback is offered.",
    linuxUnavailable: "Linux download not available yet",
    linuxUnavailableNote: "The signed Linux release feed could not be reached. No unverified fallback is offered.",
    linuxNotPublished: "The Linux release is not published yet.",
    tryLater: "Try again later",
    showHash: "Show SHA-256", hideHash: "Hide SHA-256",
    copy: "Copy", copied: "Copied", pressCopy: "Press Ctrl+C",
    footerWindows: "RedLeaf Setup {version} · {channel}", footerLinux: "RedLeaf {version} for Linux · {channel}", footerDefault: "Nightly preview",
    pauseDemo: "Pause demo", playDemo: "Play demo",
  },
};

const fr = {
  skip: "Aller au contenu",
  homeLabel: "Accueil RedLeaf",
  navLabel: "Site",
  nav: { product: "Produit", cookbook: "Cas d’usage", docs: "Documentation", download: "Télécharger" },
  discordLabel: "Rejoindre le Discord de Leaf",
  githubLabel: "RedLeaf Releases sur GitHub",
  language: "Langue",
  footer: {
    tagline: "Un foyer local pour vos agents IA, leurs conversations, leurs sessions de code et leur mémoire. Conçu par RedBamboo Interactive.",
    product: "Produit", download: "Télécharger", cookbook: "Cas d’usage", docs: "Documentation", releases: "Historique des versions",
    community: "Communauté", discord: "Discord de Leaf", github: "GitHub", vulnerability: "Signaler une vulnérabilité",
    legal: "Juridique", usageNotice: "Notice des statistiques d’utilisation", copyright: "© 2026 RedBamboo Interactive", version: "Préversion Nightly",
  },
  legal: { privacy: "Confidentialité", terms: "Conditions d’utilisation", notice: "Mentions légales", security: "Sécurité", usage: "Statistiques d’utilisation", navLabel: "Pages juridiques" },
  cookbook: { navLabel: "Cas d’usage", overview: "Vue d’ensemble", useCases: "Cas d’usage", seeHow: "Voir comment", pagerLabel: "Autres cas d’usage", ready: "Prêt ?", download: "Télécharger RedLeaf" },
  docsChrome: { navLabel: "Documentation", pagerLabel: "Suite de la documentation", ideas: "Idées", browseCookbook: "Parcourir les cas d’usage" },
  pager: { previous: "Précédent", next: "Suivant" },
  untranslated: "Cette page n’est pas encore traduite : voici la version anglaise.",
  suggest: { text: "Ce site existe aussi en français.", action: "Passer au français", dismiss: "Fermer" },
  recipes: {
    build: { title: "Construire", headline: "Votre jeu, votre appli ou votre site, avec Nova", summary: "Dites ce dont le projet a besoin. Nova répartit le travail entre des sessions de code en parallèle, intègre ce qui marche et tient la feuille de route." },
    create: { title: "Créer", headline: "Images, voix et son sur votre propre GPU", summary: "Illustrations, personnages, narration et musique, générés au fil d’une conversation et rangés avec le projet." },
    organize: { title: "Organiser", headline: "Une mémoire que vous pouvez ouvrir et modifier", summary: "Notes, décisions et documents deviennent des pages dans l’espace de travail de l’agent, et un vrai dossier sur votre disque." },
    plan: { title: "Planifier", headline: "D’une idée vague à un plan qui tient", summary: "Voyages, lancements, semaines chargées : réfléchissez-y ensemble, puis gardez le plan là où vous le retrouverez tous les deux." },
    automate: { title: "Automatiser", headline: "Ce qui se passe pendant votre absence", summary: "Heartbeats et planifications surveillent builds, boîtes de réception et échéances, et ne vous signalent que ce qui a changé." },
    learn: { title: "Apprendre", headline: "Des agents avec une personnalité et un but", summary: "Créez un professeur, un coach ou un partenaire d’entraînement, avec sa voix, ses skills et la mémoire de vos progrès." },
  },
  docGroups: { start: "Premiers pas", everyday: "Au quotidien", further: "Pour aller plus loin", help: "Aide" },
  docTitles: {
    "": "Vue d’ensemble", "install-windows": "Installer sur Windows", "install-linux": "Installer sur Linux", "first-run": "Configurer RedLeaf",
    "first-conversation": "Votre première conversation", chat: "Discussions et carrés d’étapes", voice: "Voix et Float Nova",
    agents: "Nova et vos propres agents", memory: "Mémoire et espace de travail", code: "Sessions de code",
    branches: "Branches et travail en parallèle", create: "Images, voix et musique", automations: "Planifications et heartbeat",
    providers: "Fournisseurs d’IA et modèles locaux", "access-levels": "Niveaux d’accès", skills: "Skills et protocoles",
    extensions: "Extensions", database: "Base de données et vues", "remote-access": "Accès à distance", backups: "Sauvegardes",
    updates: "Mises à jour", api: "L’API locale", troubleshooting: "Dépannage et Doctor", shortcuts: "Raccourcis clavier",
    uninstall: "Désinstaller et vos données",
  },
  runtime: {
    download: "Télécharger la version {channel}",
    published: "{channel} · {platform} · Publiée le {date}",
    unavailable: "Téléchargement momentanément indisponible",
    unavailableNote: "Le flux de versions signé est injoignable. Aucune alternative non vérifiée n’est proposée.",
    linuxUnavailable: "Téléchargement Linux pas encore disponible",
    linuxUnavailableNote: "Le flux de versions Linux signé est injoignable. Aucune alternative non vérifiée n’est proposée.",
    linuxNotPublished: "La version Linux n’est pas encore publiée.",
    tryLater: "Réessayez plus tard",
    showHash: "Afficher le SHA-256", hideHash: "Masquer le SHA-256",
    copy: "Copier", copied: "Copié", pressCopy: "Appuyez sur Ctrl+C",
    footerWindows: "RedLeaf Setup {version} · {channel}", footerLinux: "RedLeaf {version} pour Linux · {channel}", footerDefault: "Préversion Nightly",
    pauseDemo: "Mettre la démo en pause", playDemo: "Lire la démo",
  },
};

export const strings = { en, fr };

/** Fails the build when a locale misses a key the default locale has, so no chrome string ships untranslated. */
export function checkStrings() {
  const missing = [];
  const walk = (ref, other, where) => {
    for (const [key, value] of Object.entries(ref)) {
      const path = where ? `${where}.${key}` : key;
      if (!(key in other)) missing.push(path);
      else if (value && typeof value === "object") walk(value, other[key], path);
    }
  };
  for (const { code } of locales.slice(1)) walk(en, strings[code], code);
  if (missing.length) throw new Error(`Missing chrome strings: ${missing.join(", ")}`);
}
