// Build the answer pages.
// Run: node build/build-answers.mjs   (from the repo root)
//
// Reads build/answers.json and writes answers/<slug>/index.html plus a shared
// stylesheet. Same design tokens and same doctrine as the landing page:
// bottom line first, capped line length, no pure black on white.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const SITE = 'https://wireddifferently.co';
const LITE = 'https://github.com/cybermonster7769/neurodivergent-navigator-lite';

const pages = JSON.parse(readFileSync(join(here, 'answers.json'), 'utf8'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const attr = (s) => esc(s).replace(/"/g, '&quot;');

const CSS = `:root{
  --bg:#faf7f2; --bg-alt:#f3eee6; --surface:#fffdfa; --border:#e2dace;
  --text:#23201c; --text-soft:#574f45; --text-mute:#6d6459;
  --accent:#0d6560; --accent-lo:#e3f1ef; --accent-tx:#0b4f4b;
  --warn:#8a5a12; --warn-lo:#fbf1de;
  --btn-bg:#0d6560; --btn-tx:#ffffff;
  --shadow:0 1px 2px rgba(35,32,28,.05), 0 8px 24px -12px rgba(35,32,28,.16);
  --radius:14px; --measure:64ch;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#171512; --bg-alt:#1e1b17; --surface:#211e1a; --border:#363029;
  --text:#f2ede5; --text-soft:#cdc4b8; --text-mute:#a89e92;
  --accent:#5eead4; --accent-lo:#16302e; --accent-tx:#7ff0dc;
  --warn:#e8bd7a; --warn-lo:#2e2517;
  --btn-bg:#5eead4; --btn-tx:#10302c;
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px -12px rgba(0,0,0,.6);
}}
:root[data-theme="dark"]{
  --bg:#171512; --bg-alt:#1e1b17; --surface:#211e1a; --border:#363029;
  --text:#f2ede5; --text-soft:#cdc4b8; --text-mute:#a89e92;
  --accent:#5eead4; --accent-lo:#16302e; --accent-tx:#7ff0dc;
  --warn:#e8bd7a; --warn-lo:#2e2517;
  --btn-bg:#5eead4; --btn-tx:#10302c;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--bg); color:var(--text);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:17px; line-height:1.7; letter-spacing:.01em; text-align:left;
  -webkit-font-smoothing:antialiased;
}
.wrap{width:100%; max-width:760px; margin:0 auto; padding:0 22px}
.measure{max-width:var(--measure)}
h1,h2{line-height:1.22; letter-spacing:-.015em; margin:0 0 .5em; text-wrap:balance}
h1{font-size:clamp(1.8rem,4.6vw,2.7rem); font-weight:800}
h2{font-size:clamp(1.25rem,2.6vw,1.6rem); font-weight:750; margin-top:2.2em}
p{margin:0 0 1.05em}
a{color:var(--accent-tx)}
:focus-visible{outline:3px solid var(--accent); outline-offset:3px; border-radius:6px}
.skip{position:absolute; left:-9999px; top:0; background:var(--surface); color:var(--text);
  padding:12px 18px; z-index:100; border-radius:0 0 10px 0; font-weight:700}
.skip:focus{left:0}
header.bar{border-bottom:1px solid var(--border); background:var(--bg)}
.bar-in{display:flex; align-items:center; gap:10px; padding:13px 0; font-weight:800;
  letter-spacing:-.02em; text-decoration:none; color:var(--text)}
.mark{width:30px; height:30px; border-radius:9px; flex:none; background:var(--accent-lo);
  border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);
  display:grid; place-items:center; color:var(--accent-tx); font-weight:900; font-size:.92rem}
main{padding:38px 0 10px}
.eyebrow{font-size:.78rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
  color:var(--accent-tx); margin-bottom:.8em}
.short{background:var(--accent-lo); border-radius:var(--radius); padding:20px 22px;
  font-size:1.1rem; font-weight:650; color:var(--text); margin:0 0 1.6em}
.short b{display:block; font-size:.76rem; letter-spacing:.12em; text-transform:uppercase;
  color:var(--accent-tx); margin-bottom:.5em; font-weight:800}
pre{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
  padding:20px 22px; overflow-x:auto; font-size:.95rem; line-height:1.62;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color:var(--text-soft); white-space:pre-wrap; box-shadow:var(--shadow)}
figure{margin:2em 0}
figure img{width:100%; height:auto; border:1px solid var(--border); border-radius:var(--radius);
  box-shadow:var(--shadow)}
figcaption{font-size:.9rem; color:var(--text-mute); margin-top:.7em}
.note{background:var(--warn-lo); border-radius:var(--radius); padding:16px 20px;
  font-size:.96rem; color:var(--text-soft)}
.cta{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
  padding:26px 24px; box-shadow:var(--shadow); margin:2.4em 0 1em}
.cta h2{margin-top:0}
.btn{display:inline-block; background:var(--btn-bg); color:var(--btn-tx); font-weight:700;
  padding:13px 22px; border-radius:10px; text-decoration:none; margin:.4em .5em .4em 0}
.btn-2{background:transparent; color:var(--accent-tx); border:1px solid var(--border)}
footer{border-top:1px solid var(--border); margin-top:3em; padding:24px 0 46px;
  font-size:.9rem; color:var(--text-mute)}
footer a{color:var(--text-mute)}
`;

function page(p) {
  const url = `${SITE}/answers/${p.slug}/`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${attr(p.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${attr(p.title)}">
<meta property="og:description" content="${attr(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/answers/img/${p.card}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/answers/answers.css">
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>

<header class="bar">
  <div class="wrap">
    <a class="bar-in" href="/">
      <span class="mark" aria-hidden="true">N</span>
      <span>Neurodivergent&nbsp;Navigator</span>
    </a>
  </div>
</header>

<main id="main">
  <div class="wrap">
    <p class="eyebrow">${esc(p.searchPhrase)}</p>
    <h1>${esc(p.title)}</h1>

    <div class="short">
      <b>Short answer</b>
      ${esc(p.shortAnswer)}
    </div>

    <div class="measure">
      <h2>Why it happens</h2>
      ${p.why.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}

      <h2>The fix</h2>
      <p>${esc(p.fixIntro)}</p>
    </div>

    <pre>${esc(p.prompt)}</pre>

    <figure>
      <img src="/answers/img/${p.card}" alt="${attr(p.cardAlt)}" width="1080" height="1350" loading="lazy">
      <figcaption>The same question, answered two ways.</figcaption>
    </figure>

    <div class="measure">
      <h2>${esc(p.catchTitle)}</h2>
      ${p.catch.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
    </div>

    <div class="cta">
      <h2>${esc(p.closer)}</h2>
      <p class="measure">Neurodivergent Navigator is a Claude skill for ADHD and dyslexic minds.
      The free tier installs answer-first output, a one-question-max rule, and detection for
      two of the eight states. The full version covers all eight, across seven areas of life.</p>
      <a class="btn" href="/">Get the full skill &middot; $47</a>
      <a class="btn btn-2" href="${LITE}">Try the free version</a>
    </div>

    <p class="note measure">Not a medical or mental-health tool. It changes how an AI assistant
    communicates; it does not diagnose or treat. In a crisis in the US: call or text
    <strong>988</strong> (veterans press 1), or text <strong>HOME</strong> to <strong>741741</strong>.</p>
  </div>
</main>

<footer>
  <div class="wrap">
    <a href="/">Neurodivergent Navigator</a> &mdash; built for ADHD &amp; dyslexic minds.
  </div>
</footer>
</body>
</html>
`;
}

// Shared stylesheet + card images
mkdirSync(join(ROOT, 'answers', 'img'), { recursive: true });
writeFileSync(join(ROOT, 'answers', 'answers.css'), CSS, 'utf8');

const CARDS = join(
  ROOT, '..', 'neurodivergent-navigator-product', 'marketing', 'cards', 'out'
);

for (const p of pages) {
  const dir = join(ROOT, 'answers', p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p), 'utf8');

  const src = join(CARDS, p.card);
  if (existsSync(src)) {
    copyFileSync(src, join(ROOT, 'answers', 'img', p.card));
  } else {
    console.warn(`  ! missing card image: ${p.card}`);
  }
  console.log(`  answers/${p.slug}/`);
}

// Sitemap + robots, so the answer pages are discoverable rather than orphaned.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, priority: '1.0' },
  ...pages.map((p) => ({ loc: `${SITE}/answers/${p.slug}/`, priority: '0.8' })),
];

writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`,
  'utf8'
);

writeFileSync(
  join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8'
);

console.log(`  sitemap.xml (${urls.length} urls)`);
console.log(`  robots.txt`);
console.log(`\n${pages.length} answer pages written`);
