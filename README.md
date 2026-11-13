# RedLeaf releases

Public downloads and the signed component feed for RedLeaf.

The public website (landing page, cookbook, documentation and legal pages, in English and French) is
published through GitHub Pages from `main`. Its source lives in `site/`: page bodies in
`site/pages/<language>/`, shared header and footer in `site/layout.mjs`, chrome strings and the list
of languages in `site/i18n.mjs`, assets in `site/static`. English (`site/pages/en`) defines the pages
and is served at the site root; a translation sits at the same path under its language folder and is
served under `/<language>/`, with `hreflang` links between versions. A page without a translation falls
back to English with a notice, and the build lists it. Build with `node site/build.mjs` (no
dependencies) and preview `_site/` with any static server; the Pages workflow runs the same build. Immutable release
records and signed channel pointers live on the `release-feed` branch. Do not hand-edit that branch;
the RedLeaf central publisher owns it.
