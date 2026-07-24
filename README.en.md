# 🇬🇧 EarthSCIgen — English guide

[Main README](./README.md) · [Tiếng Việt](./README.vi.md) ·
[Live application](https://base27-cvnss.github.io/EarthSCIgen/)

## Introduction

**EarthSCIgen v0.1.0** is a static application for generating transparent
Earth Science preprint scaffolds with an IEEE-style two-column layout.
Everything runs in the browser: no account, API, application server, analytics,
or environment variable is required.

> **Warning:** Generated content is synthetic, unreviewed, and not scientific
> evidence. The application supports teaching, software testing, layout
> validation, and early outlining; it must not be used to deceive peer review.

## Six disciplines

| Module | Illustrative scope |
| --- | --- |
| 🛰️ Remote Sensing | Multispectral imagery, land-surface classes, spatial validation |
| 🪨 Geology | Lithology, stratigraphy, and geological contacts |
| 💧 Hydrology | Catchments, rainfall–runoff, and drainage networks |
| 🌡️ Climate Science | Climate indicators, time series, and uncertainty |
| ⛰️ Geomorphology | Terrain, landforms, and surface classification |
| 🌐 Geophysics | Potential fields, profiles, and subsurface interpretation |

## Workflow

1. Select a discipline.
2. Enter the title, author, email, and affiliation.
3. Choose 6–8 A4 pages and a reproducible seed.
4. Inspect the live IEEE-style outline.
5. Select **Generate controlled draft** and review the progress log.
6. Export HTML, LaTeX, or manifest JSON; use **Print / PDF** for a PDF copy.

## Integrity design

The application checks metadata, email structure, seed bounds, page limits,
synthetic labelling, reference policy, and privacy. The safety warning remains
present in:

- the interface and every preview page;
- standalone HTML and its `earthscigen-synthetic` metadata;
- the LaTeX title block and final page;
- the JSON manifest's `integrity.synthetic` field;
- every printed or browser-saved PDF page.

## Local use

Open `index.html` in a modern browser. No command is required.

To verify the source with Node.js:

```bash
npm run check
npm test
```

No `npm install` step is needed because tests use Node.js built-ins only.

## GitHub Pages

`.github/workflows/pages.yml` runs syntax and integrity tests before every
deployment from `main`. In **Settings → Pages**, set the publishing source to
**GitHub Actions**.

## License

Released under the [MIT License](./LICENSE). Developed by **Long Ngo**.
