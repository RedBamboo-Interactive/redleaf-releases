# RedLeaf releases

Public downloads and the signed component feed for RedLeaf.

The public website (landing page, cookbook and legal pages) is published through GitHub Pages from
`main`. Its source lives in `site/`: page bodies in `site/pages`, shared header and footer in
`site/layout.mjs`, assets in `site/static`. Build it with `node site/build.mjs` (no dependencies) and
preview `_site/` with any static server; the Pages workflow runs the same build. Immutable release
records and signed channel pointers live on the `release-feed` branch. Do not hand-edit that branch;
the RedLeaf central publisher owns it.
