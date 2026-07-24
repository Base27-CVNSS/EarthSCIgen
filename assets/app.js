(() => {
  "use strict";

  const APP_VERSION = "0.1.0";
  const SYNTHETIC_WARNING =
    "SYNTHETIC DRAFT — AUTOMATICALLY GENERATED — NOT PEER REVIEWED — NOT SCIENTIFIC EVIDENCE";

  const TOPICS = {
    remote_sensing: {
      name: "Remote Sensing",
      task: "land-surface classification",
      area: "a fictional monsoon-influenced upland catchment",
      data: "multispectral reflectance, terrain derivatives, and synthetic land-cover labels",
      method: "a stratified Random Forest workflow with spatially separated validation blocks",
      units: ["Forest", "Cropland", "Bare ground", "Water"],
      keywords: ["remote sensing", "land cover", "spatial validation"],
    },
    geology: {
      name: "Geology",
      task: "lithological mapping",
      area: "a fictional fault-bounded sedimentary basin",
      data: "synthetic lithological contacts, spectral ratios, and generalized terrain attributes",
      method: "rule-guided contact interpretation followed by uncertainty-aware classification",
      units: ["Granite", "Basalt", "Sandstone", "Limestone"],
      keywords: ["geology", "lithology", "geological mapping"],
    },
    hydrology: {
      name: "Hydrology",
      task: "runoff-response prototyping",
      area: "a fictional headwater catchment with arbitrary coordinates",
      data: "synthetic rainfall pulses, terrain indices, drainage density, and land-cover fractions",
      method: "a conceptual rainfall–runoff scaffold with blocked event validation",
      units: ["Upper reach", "Mid-catchment", "Floodplain", "Outlet"],
      keywords: ["hydrology", "runoff", "catchment modelling"],
    },
    climate: {
      name: "Climate Science",
      task: "climate-indicator reporting",
      area: "a fictional coastal-to-montane climate transect",
      data: "synthetic temperature, precipitation, and anomaly time series",
      method: "time-blocked trend estimation with sensitivity and uncertainty summaries",
      units: ["Coastal", "Lowland", "Upland", "Montane"],
      keywords: ["climate", "indicators", "uncertainty"],
    },
    geomorphology: {
      name: "Geomorphology",
      task: "landform classification",
      area: "a fictional dissected plateau and adjoining alluvial plain",
      data: "synthetic elevation, slope, curvature, roughness, and drainage metrics",
      method: "terrain segmentation followed by reproducible landform attribution",
      units: ["Ridge", "Hillslope", "Valley", "Alluvial plain"],
      keywords: ["geomorphology", "terrain", "landforms"],
    },
    geophysics: {
      name: "Geophysics",
      task: "subsurface interpretation prototyping",
      area: "a fictional basin crossed by three generalized geophysical profiles",
      data: "synthetic gravity, magnetic, and travel-time response curves",
      method: "profile-held-out inversion checks with parameter sensitivity reporting",
      units: ["Basement", "Sediment", "Fault zone", "Intrusion"],
      keywords: ["geophysics", "inversion", "subsurface"],
    },
  };

  const REFERENCES = [
    "M. Drusch et al., “Sentinel-2: ESA’s Optical High-Resolution Mission for GMES Operational Services,” Remote Sensing of Environment, vol. 120, pp. 25–36, 2012.",
    "T. G. Farr et al., “The Shuttle Radar Topography Mission,” Reviews of Geophysics, vol. 45, RG2004, 2007.",
    "L. Breiman, “Random Forests,” Machine Learning, vol. 45, pp. 5–32, 2001.",
  ];

  const BUILD_STAGES = [
    ["VALIDATE", "Đã xác thực metadata, giới hạn trang và cảnh báo synthetic."],
    ["GRAMMAR", "Đã mở rộng grammar chuyên ngành theo seed xác định."],
    ["LAYOUT", "Đã phân bổ outline IEEE, bảng và hình minh họa vào các trang A4."],
    ["INTEGRITY", "Đã kiểm tra nguồn tham khảo, privacy và dấu synthetic ở mọi đầu ra."],
    ["PACKAGE", "Gói HTML, LaTeX, manifest JSON và bản in đã sẵn sàng."],
  ];

  const form = document.querySelector("#generator-form");
  const paperStack = document.querySelector("#paper-stack");
  const topicInput = document.querySelector("#topic");
  const pagesInput = document.querySelector("#pages");
  const progressBar = document.querySelector("#progress-bar");
  const progressValue = document.querySelector("#progress-value");
  const progressLog = document.querySelector("#progress-log");
  const buildStatus = document.querySelector("#build-status");
  const buildHeading = document.querySelector("#build-heading");

  let buildRunning = false;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeTex(value) {
    return String(value)
      .replaceAll("\\", "\\textbackslash{}")
      .replaceAll("&", "\\&")
      .replaceAll("%", "\\%")
      .replaceAll("$", "\\$")
      .replaceAll("#", "\\#")
      .replaceAll("_", "\\_")
      .replaceAll("{", "\\{")
      .replaceAll("}", "\\}")
      .replaceAll("~", "\\textasciitilde{}")
      .replaceAll("^", "\\textasciicircum{}");
  }

  function slugify(value) {
    return (
      String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 64) || "earthscigen-preprint"
    );
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createPrng(seed, salt = "") {
    let state = (Number(seed) ^ hashString(salt)) >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(list, random) {
    return list[Math.floor(random() * list.length)];
  }

  function getState() {
    const data = new FormData(form);
    return {
      title: String(data.get("title") || "").trim(),
      author: String(data.get("author") || "").trim(),
      email: String(data.get("email") || "").trim(),
      affiliation: String(data.get("affiliation") || "").trim(),
      topicKey: String(data.get("topic") || "remote_sensing"),
      pages: Number(data.get("pages") || 7),
      seed: Number(data.get("seed") || 1),
    };
  }

  function validate(state) {
    const checks = {
      title: state.title.length >= 8 && state.author.length >= 2 && state.affiliation.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email),
      seed: Number.isSafeInteger(state.seed) && state.seed >= 1 && state.seed <= 2147483647,
      pages: Number.isInteger(state.pages) && state.pages >= 6 && state.pages <= 8,
      warning: SYNTHETIC_WARNING.includes("NOT SCIENTIFIC EVIDENCE"),
      references: REFERENCES.every((item) => !/\bdoi\s*:/i.test(item)),
      privacy: true,
    };
    return {
      checks,
      passed: Object.values(checks).filter(Boolean).length,
      valid: Object.values(checks).every(Boolean),
    };
  }

  function makeParagraphs(topic, random) {
    const framing = [
      `The workflow frames ${topic.task} as a document-engineering exercise rather than an empirical finding.`,
      `The generated narrative uses controlled vocabulary for ${topic.name} while preserving an explicit boundary between layout testing and scientific interpretation.`,
      `Every numeric value, spatial relation, class label, and performance indicator in this draft is synthetic.`,
      `A data-backed study must replace the demonstration inputs with traceable observations and document collection dates, units, uncertainty, licensing, and coordinate reference systems.`,
    ];
    const study = [
      `The study area is ${topic.area}; its coordinates, boundaries, communities, and environmental conditions are intentionally fictitious.`,
      `The area is divided into four arbitrary analysis blocks to demonstrate spatially explicit validation and page composition.`,
      `Topographic and thematic contrasts are generated from the seed and do not describe any real jurisdiction or physical site.`,
      `The map-like figure is an automatically generated illustration and must not be reused as geographic evidence.`,
    ];
    const methods = [
      `The illustrative input stack contains ${topic.data}.`,
      `The method is described as ${topic.method}; this selection demonstrates domain phrasing and does not establish methodological suitability.`,
      `Pre-processing records a synthetic provenance entry for each layer, then applies deterministic normalization and seeded partitioning.`,
      `Validation blocks are kept separate in the scaffold to illustrate leakage-aware reporting.`,
      `Sensitivity checks vary one synthetic parameter at a time and retain the seed in the manifest for reproducibility.`,
      `No external API, hidden model, analytics service, or server-side calculation participates in document generation.`,
      `The browser constructs the article object, typesets the preview, and exports all files locally.`,
      `Human reviewers must verify assumptions, domain terminology, equations, units, and ethical implications before research use.`,
    ];
    const results = [
      `The generated layout reports an illustrative agreement value of ${(0.72 + random() * 0.16).toFixed(2)} and an uncertainty interval of ±${(0.04 + random() * 0.05).toFixed(2)}; both values are artificial.`,
      `Class summaries are intentionally plausible-looking to test tables, yet they encode no measurement or model output.`,
      `The seed produces stable ordering, captions, synthetic proportions, and paragraph variants across repeated exports.`,
      `Integrity checks confirm that the warning is present in the interface, every printable page, HTML metadata, LaTeX title block, and JSON manifest.`,
      `The two-column composition remains readable from six through eight target pages without depending on a remote stylesheet.`,
      `Export tests preserve Unicode metadata and escape user-provided text before HTML or LaTeX serialization.`,
      `The illustration exercises map, chart, table, caption, declaration, and reference placements expected in an academic scaffold.`,
      `These observations concern software behavior only and must not be interpreted as Earth-science results.`,
    ];
    const discussion = [
      `The principal design trade-off is transparency versus realism: a useful scaffold should resemble a paper while remaining unmistakably synthetic.`,
      `Deterministic grammar supports teaching and regression testing, but it cannot replace hypothesis formation, field knowledge, calibration, or peer review.`,
      `Verified bibliography metadata is kept separate from generated prose, and the application never invents a DOI.`,
      `Future versions may accept user-supplied open datasets, provenance records, and validated reference metadata without weakening the synthetic boundary.`,
      `The static architecture is auditable and portable because the complete runtime is HTML, CSS, and JavaScript served by GitHub Pages.`,
      `Any scientific reuse requires an accountable author to replace artificial evidence and independently verify every claim.`,
    ];
    const conclusion = [
      `EarthSCIgen demonstrates a browser-only route from structured metadata and a seed to an IEEE-style Earth-science preprint scaffold.`,
      `The result is appropriate for education, interface evaluation, reproducibility exercises, and early manuscript planning.`,
      `It is not a research result; domain review and real evidence remain mandatory before communication or submission.`,
    ];
    return {
      introduction: framing,
      study,
      methodology: methods,
      results,
      discussion,
      conclusion,
      acknowledgments: [
        "Acknowledgment—This software demonstration does not claim institutional endorsement or external contribution.",
      ],
      declarations: [
        "Conflict of interest—The generated draft declares no conflict on behalf of any real person; the author must provide an accurate statement.",
        "Funding—No external funding is claimed by the synthetic generator.",
        "Data availability—No observational dataset was used. Demonstration values are generated locally from the stated seed.",
      ],
    };
  }

  function makeArticle(state) {
    const topic = TOPICS[state.topicKey] || TOPICS.remote_sensing;
    const random = createPrng(state.seed, state.topicKey);
    const paragraphs = makeParagraphs(topic, random);
    const percentages = topic.units.map(() => 12 + Math.floor(random() * 28));
    const total = percentages.reduce((sum, value) => sum + value, 0);
    const normalized = percentages.map((value) => Math.round((value / total) * 100));
    normalized[normalized.length - 1] += 100 - normalized.reduce((sum, value) => sum + value, 0);

    return {
      ...state,
      topic,
      warning: SYNTHETIC_WARNING,
      abstract:
        `EarthSCIgen is a deterministic, browser-based system for composing transparent ` +
        `${topic.name} preprint scaffolds. This demonstration applies a context-free grammar to ` +
        `${topic.task}, generates an IEEE-style two-column layout, and preserves explicit synthetic ` +
        `labels in every output. Seed ${state.seed} controls illustrative text, tables, and figures. ` +
        `No observational evidence is used and no scientific claim is made.`,
      keywords: [...topic.keywords, "context-free grammar", "synthetic preprint"],
      paragraphs,
      classRows: topic.units.map((unit, index) => ({
        unit,
        share: normalized[index],
        confidence: (0.61 + random() * 0.29).toFixed(2),
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  function sectionHtml(title, paragraphs) {
    return `<h3>${escapeHtml(title)}</h3>${paragraphs
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("")}`;
  }

  function figureHtml(number, label) {
    return (
      `<div class="paper-figure" role="img" aria-label="${escapeHtml(label)}"></div>` +
      `<p class="paper-caption"><b>Fig. ${number}.</b> ${escapeHtml(label)} ` +
      `Automatically generated illustration; not a map, measurement, or analytical result.</p>`
    );
  }

  function tableHtml(article) {
    return `<table class="paper-table">
      <caption>TABLE I · SEEDED SYNTHETIC CLASS SUMMARY</caption>
      <thead><tr><th>Illustrative unit</th><th>Share (%)</th><th>Score</th></tr></thead>
      <tbody>${article.classRows
        .map(
          (row) =>
            `<tr><td>${escapeHtml(row.unit)}</td><td>${row.share}</td><td>${row.confidence}</td></tr>`,
        )
        .join("")}</tbody>
    </table>`;
  }

  function referencesHtml() {
    return `<h3>References</h3><ol>${REFERENCES.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
  }

  function buildPageBody(article, pageNumber) {
    const p = article.paragraphs;
    const total = article.pages;
    const ratio = (pageNumber - 1) / Math.max(total - 1, 1);

    if (pageNumber === 1) {
      return (
        sectionHtml("I. Introduction", p.introduction) +
        sectionHtml("II. Study Area", p.study.slice(0, 2)) +
        figureHtml(1, `Synthetic study-area composition for ${article.topic.name}.`)
      );
    }

    if (pageNumber === total) {
      return (
        sectionHtml("V. Discussion", p.discussion.slice(-3)) +
        sectionHtml("VI. Conclusion", p.conclusion) +
        sectionHtml("Acknowledgment", p.acknowledgments) +
        sectionHtml("Declarations", p.declarations) +
        referencesHtml()
      );
    }

    if (ratio < 0.32) {
      return (
        sectionHtml("II. Study Area", p.study) +
        sectionHtml("III. Data and Methodology", p.methodology.slice(0, 4)) +
        figureHtml(2, `Seeded terrain and thematic layers for ${article.topic.task}.`)
      );
    }

    if (ratio < 0.58) {
      return (
        sectionHtml("III. Data and Methodology", p.methodology) +
        tableHtml(article) +
        figureHtml(3, "Illustrative processing and spatial-validation workflow.")
      );
    }

    if (ratio < 0.82) {
      return (
        sectionHtml("IV. Results", p.results) +
        tableHtml(article) +
        figureHtml(4, "Synthetic diagnostic profile generated solely for layout testing.")
      );
    }

    return (
      sectionHtml("IV. Results", p.results.slice(3)) +
      sectionHtml("V. Discussion", p.discussion) +
      figureHtml(5, "Integrity coverage across browser-generated output formats.")
    );
  }

  function renderPaperPage(article, pageNumber) {
    const firstPage = pageNumber === 1;
    return `<article class="paper-page" data-paper-page="${pageNumber}">
      <div class="paper-warning">${escapeHtml(article.warning)}</div>
      <div class="paper-journal-line">
        <span>EarthSCIgen Preprint Scaffold · v${APP_VERSION}</span>
        <span>${escapeHtml(article.topic.name)} · Seed ${article.seed}</span>
      </div>
      ${
        firstPage
          ? `<h1 class="paper-title">${escapeHtml(article.title)}</h1>
            <p class="paper-byline">${escapeHtml(article.author)}</p>
            <p class="paper-affiliation">${escapeHtml(article.affiliation)} · ${escapeHtml(article.email)}</p>
            <div class="paper-abstract"><b>Abstract—</b> ${escapeHtml(article.abstract)}
              <span class="paper-keywords"><b>Index Terms—</b> ${escapeHtml(article.keywords.join(", "))}.</span>
            </div>`
          : ""
      }
      <div class="paper-columns">${buildPageBody(article, pageNumber)}</div>
      <div class="paper-page-number">Page ${pageNumber} of ${article.pages}</div>
    </article>`;
  }

  function renderPreview() {
    const state = getState();
    const article = makeArticle(state);
    const validation = validate(state);
    paperStack.innerHTML = Array.from({ length: article.pages }, (_, index) =>
      renderPaperPage(article, index + 1),
    ).join("");
    document.querySelector("#page-count-label").textContent = `${article.pages} trang · A4`;
    document.querySelector("#seed-label").textContent = `Seed ${article.seed}`;
    document.querySelector("#topic-state").textContent = article.topic.name;
    updateIntegrity(validation);
  }

  function updateIntegrity(validation) {
    Object.entries(validation.checks).forEach(([name, passed]) => {
      const item = document.querySelector(`[data-check="${name}"]`);
      if (!item) return;
      item.classList.toggle("has-error", !passed);
      item.querySelector("span").textContent = passed ? "✓" : "!";
    });
    const score = document.querySelector("#integrity-score");
    score.textContent = `${validation.passed}/7 ${validation.valid ? "PASS" : "CHECK"}`;
    score.classList.toggle("has-error", !validation.valid);
    document.querySelectorAll('[data-action="generate"]').forEach((button) => {
      button.disabled = !validation.valid || buildRunning;
    });
  }

  function setProgress(percent, label) {
    progressBar.style.width = `${percent}%`;
    progressValue.textContent = `${percent}%`;
    if (label) buildStatus.textContent = label;
  }

  function addLog(code, message) {
    const item = document.createElement("li");
    const time = document.createElement("time");
    const text = document.createElement("span");
    time.textContent = code;
    text.textContent = message;
    item.append(time, text);
    progressLog.append(item);
    progressLog.scrollTop = progressLog.scrollHeight;
  }

  function pause(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  async function runBuild() {
    const state = getState();
    const validation = validate(state);
    if (!validation.valid || buildRunning) {
      addLog("BLOCK", "Vui lòng sửa các trường đang được đánh dấu trước khi tạo.");
      return;
    }

    buildRunning = true;
    updateIntegrity(validation);
    progressLog.innerHTML = "";
    buildHeading.textContent = "Đang tạo bản nháp";
    setProgress(0, "Khởi tạo pipeline cục bộ…");

    for (let index = 0; index < BUILD_STAGES.length; index += 1) {
      const [code, message] = BUILD_STAGES[index];
      await pause(230);
      const percent = Math.round(((index + 1) / BUILD_STAGES.length) * 100);
      addLog(code, message);
      setProgress(percent, message);
    }

    renderPreview();
    buildRunning = false;
    buildHeading.textContent = "Bản nháp đã sẵn sàng";
    buildStatus.textContent = "Integrity checks hoàn tất; có thể xuất tệp hoặc in PDF.";
    updateIntegrity(validate(getState()));
    document.querySelector("#paper-viewport").scrollTo({ top: 0, behavior: "smooth" });
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportPaperCss() {
    return `
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#e8ebef;color:#182139;font-family:"Times New Roman",serif}
.paper-page{background:#fff;height:297mm;margin:8mm auto;overflow:hidden;padding:13mm 14mm 11mm;position:relative;width:210mm;break-after:page}
.paper-warning{border:1.6px solid #e95d2a;color:#b83d14;font:800 8pt Arial;letter-spacing:.08em;margin-bottom:5mm;padding:2mm;text-align:center}
.paper-journal-line{border-bottom:1px solid #b9c0cb;color:#697386;display:flex;font:7pt Arial;justify-content:space-between;margin-bottom:5mm;padding-bottom:2mm}
.paper-title{font-size:18pt;line-height:1.12;margin:0 auto 3mm;max-width:175mm;text-align:center}.paper-byline,.paper-affiliation{font-size:9pt;margin:0;text-align:center}.paper-affiliation{color:#505b6d;font-size:8pt;margin:1mm 0 4mm}
.paper-abstract{border-block:1px solid #c8cdd5;font-size:8.5pt;line-height:1.35;margin-bottom:4mm;padding:2.5mm 0;text-align:justify}.paper-keywords{display:block;margin-top:1mm}
.paper-columns{column-count:2;column-gap:7mm;column-rule:1px solid #edf0f3;font-size:8.1pt;line-height:1.34;text-align:justify}.paper-columns h3{break-after:avoid;font:700 8.6pt Arial;letter-spacing:.04em;margin:3mm 0 1.4mm;text-align:center;text-transform:uppercase}.paper-columns h3:first-child{margin-top:0}.paper-columns p{margin:0 0 2mm}.paper-columns p+p{text-indent:3mm}
.paper-figure{background:linear-gradient(150deg,#e5ebf2,#f6f7f9 40%,#dce8e8 41%,#eef2ee 70%,#e0e4e8);border:1px solid #aeb7c2;break-inside:avoid;height:32mm;margin:3mm 0 1mm}.paper-caption{break-inside:avoid;font-size:7pt;line-height:1.25;margin:0 0 2.5mm}
.paper-table{border-collapse:collapse;break-inside:avoid;font:6.7pt Arial;margin:2.5mm 0;width:100%}.paper-table caption{font-weight:700;margin-bottom:1mm;text-transform:uppercase}.paper-table th,.paper-table td{border-bottom:1px solid #aeb7c2;padding:1mm;text-align:left}.paper-table th{border-top:1px solid #aeb7c2}
.paper-page-number{bottom:5mm;color:#717b8b;font:7pt Arial;left:0;position:absolute;text-align:center;width:100%}.paper-page-number:before{color:#ba4319;content:"EARTHSCIGEN SYNTHETIC DRAFT · ";font-weight:700}
@media print{body{background:#fff}.paper-page{margin:0}}`;
  }

  function buildStandaloneHtml(article) {
    const pages = Array.from({ length: article.pages }, (_, index) =>
      renderPaperPage(article, index + 1),
    ).join("");
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="generator" content="EarthSCIgen v${APP_VERSION}">
  <meta name="earthscigen-synthetic" content="true">
  <title>${escapeHtml(article.title)}</title>
  <style>${exportPaperCss()}</style>
</head>
<body data-synthetic="true">
${pages}
</body>
</html>`;
  }

  function buildLatex(article) {
    return String.raw`\documentclass[10pt,a4paper,conference]{IEEEtran}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{xcolor}
\usepackage{booktabs}
\usepackage{graphicx}
\definecolor{synthetic}{RGB}{184,61,20}
\title{\color{synthetic}\fbox{\parbox{0.92\linewidth}{\centering\bfseries ${escapeTex(article.warning)}}}\\[1.2ex]${escapeTex(article.title)}}
\author{\IEEEauthorblockN{${escapeTex(article.author)}}\IEEEauthorblockA{${escapeTex(article.affiliation)}\\${escapeTex(article.email)}}}
\begin{document}
\maketitle
\begin{abstract}
${escapeTex(article.abstract)}
\end{abstract}
\begin{IEEEkeywords}
${escapeTex(article.keywords.join(", "))}
\end{IEEEkeywords}
\section{Introduction}
${article.paragraphs.introduction.map(escapeTex).join("\n\n")}
\section{Study Area}
${article.paragraphs.study.map(escapeTex).join("\n\n")}
\section{Data and Methodology}
${article.paragraphs.methodology.map(escapeTex).join("\n\n")}
\begin{table}[t]
\caption{Seeded synthetic class summary (not observed data)}
\centering
\begin{tabular}{lrr}
\toprule
Illustrative unit & Share (\%) & Score\\
\midrule
${article.classRows.map((row) => `${escapeTex(row.unit)} & ${row.share} & ${row.confidence}\\\\`).join("\n")}
\bottomrule
\end{tabular}
\end{table}
\section{Results}
${article.paragraphs.results.map(escapeTex).join("\n\n")}
\section{Discussion}
${article.paragraphs.discussion.map(escapeTex).join("\n\n")}
\section{Conclusion}
${article.paragraphs.conclusion.map(escapeTex).join("\n\n")}
\section*{Acknowledgment}
${article.paragraphs.acknowledgments.map(escapeTex).join("\n\n")}
\section*{Conflict of Interest}
The generated draft makes no declaration on behalf of a real author. Replace this statement after accountable review.
\section*{Funding}
No external funding is claimed by the synthetic generator.
\section*{Data Availability}
No observational dataset was used. Demonstration values were generated locally from seed ${article.seed}.
\begin{thebibliography}{3}
\bibitem{drusch2012} M. Drusch et al., ``Sentinel-2: ESA's Optical High-Resolution Mission for GMES Operational Services,'' \emph{Remote Sensing of Environment}, vol. 120, pp. 25--36, 2012.
\bibitem{farr2007} T. G. Farr et al., ``The Shuttle Radar Topography Mission,'' \emph{Reviews of Geophysics}, vol. 45, RG2004, 2007.
\bibitem{breiman2001} L. Breiman, ``Random Forests,'' \emph{Machine Learning}, vol. 45, pp. 5--32, 2001.
\end{thebibliography}
\clearpage
\begin{center}\color{synthetic}\bfseries ${escapeTex(article.warning)}\end{center}
\end{document}
`;
  }

  async function sha256(value) {
    if (window.crypto?.subtle) {
      const bytes = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    return `fnv1a-${hashString(value).toString(16).padStart(8, "0")}`;
  }

  async function buildManifest(article) {
    const html = buildStandaloneHtml(article);
    return {
      schema: "https://earthscigen.github.io/schema/manifest-v0.1.json",
      generator: {
        name: "EarthSCIgen",
        version: APP_VERSION,
        runtime: "browser-only",
      },
      document: {
        title: article.title,
        author: article.author,
        email: article.email,
        affiliation: article.affiliation,
        topic: article.topic.name,
        seed: article.seed,
        target_pages: article.pages,
        format: "IEEE-style two-column A4 preprint scaffold",
      },
      integrity: {
        synthetic: true,
        peer_reviewed: false,
        scientific_evidence: false,
        warning: article.warning,
        observational_data_used: false,
        fabricated_doi_allowed: false,
        html_sha256: await sha256(html),
      },
      exports: ["html", "tex", "json", "browser-print-pdf"],
      generated_at: article.generatedAt,
    };
  }

  async function exportDocument(format) {
    const state = getState();
    const validation = validate(state);
    if (!validation.valid) {
      addLog("BLOCK", "Không thể xuất: metadata hoặc cấu hình chưa vượt qua integrity checks.");
      return;
    }
    const article = makeArticle(state);
    const stem = slugify(article.title);
    if (format === "html") {
      downloadFile(`${stem}.html`, buildStandaloneHtml(article), "text/html;charset=utf-8");
    } else if (format === "tex") {
      downloadFile(`${stem}.tex`, buildLatex(article), "application/x-tex;charset=utf-8");
    } else {
      const manifest = await buildManifest(article);
      downloadFile(
        `${stem}.manifest.json`,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "application/json;charset=utf-8",
      );
    }
    addLog("EXPORT", `Đã tạo ${format.toUpperCase()} trong trình duyệt; không tải dữ liệu lên máy chủ.`);
  }

  function setTopic(key) {
    topicInput.value = key;
    document.querySelectorAll("[data-topic]").forEach((button) => {
      const selected = button.dataset.topic === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });
    renderPreview();
  }

  function setPages(value) {
    pagesInput.value = String(value);
    document.querySelectorAll("[data-pages]").forEach((button) => {
      const selected = Number(button.dataset.pages) === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });
    renderPreview();
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-value]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeValue === theme);
    });
    try {
      localStorage.setItem("earthscigen-theme", theme);
    } catch {
      // Theme persistence is optional; the app remains fully functional without storage.
    }
  }

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => setTopic(button.dataset.topic));
  });

  document.querySelectorAll("[data-pages]").forEach((button) => {
    button.addEventListener("click", () => setPages(Number(button.dataset.pages)));
  });

  document.querySelectorAll("[data-action='generate']").forEach((button) => {
    button.addEventListener("click", runBuild);
  });

  document.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => exportDocument(button.dataset.export));
  });

  document.querySelectorAll("[data-theme-value]").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeValue));
  });

  document.querySelector("#randomize-seed").addEventListener("click", () => {
    const nextSeed = window.crypto?.getRandomValues
      ? window.crypto.getRandomValues(new Uint32Array(1))[0] % 2147483646 + 1
      : Math.floor(Math.random() * 2147483646) + 1;
    document.querySelector("#seed").value = String(nextSeed);
    renderPreview();
  });

  document.querySelector("#reset-button").addEventListener("click", () => {
    progressLog.innerHTML =
      "<li><time>READY</time><span>Log đã đặt lại; preview vẫn giữ cấu hình hiện tại.</span></li>";
    buildHeading.textContent = "Sẵn sàng tạo bản nháp";
    setProgress(0, "Preview đang cập nhật theo thời gian thực.");
  });

  document.querySelector("#print-button").addEventListener("click", () => {
    const validation = validate(getState());
    if (!validation.valid) {
      addLog("BLOCK", "Không thể in: vui lòng hoàn tất integrity checks.");
      return;
    }
    renderPreview();
    window.print();
  });

  form.addEventListener("input", (event) => {
    if (event.target.matches("input")) renderPreview();
  });

  const storedTheme = (() => {
    try {
      return localStorage.getItem("earthscigen-theme");
    } catch {
      return null;
    }
  })();
  if (["editorial", "atlas", "strata"].includes(storedTheme)) setTheme(storedTheme);
  renderPreview();
})();
