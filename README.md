# glassgarden.cc

The website for glassgarden: generative ambient music, grown in small sealed worlds. Plain HTML, CSS and a little JavaScript, no build step, hosted on GitHub Pages.

## Pages

| file | what |
| --- | --- |
| `index.html` | home: the name, one sentence, a pixel jar that grows from a new seed on every visit, the latest release and the newest notes |
| `releases.html` | everything out now, plus what's still growing |
| `notes.html` | the field journal, rendered from `data/notes.js` |
| `about.html` | the project, the approach, links |
| `404.html` | shown for missing pages |

## Adding or updating a release

Releases live in `data/releases.js`, newest first:

```js
{
  slug: "dewfall",                 // used as the #anchor
  title: "dewfall",
  status: "out",                   // "out" or "growing"
  year: "2026",
  kind: "eurorack and plinky · 14 min",
  summary: "One or two sentences about the piece.",
  links: [{ label: "listen on bandcamp", url: "https://..." }],  // first link is the main action
  audio: "/audio/dewfall-excerpt.mp3",  // optional excerpt with a player; null for none
  duration: "1:30",
  seed: 1618                       // any whole number; each one grows a different jar
}
```

When terrarium moves to this domain, change its `url` in `data/releases.js`. Nothing else needs touching.

Excerpt audio goes in `audio/` (MP3 or M4A at 192 to 256 kbps keeps it small).

## Adding a note

Notes live in `data/notes.js`, newest first. They show in full on `notes.html`, and the newest three appear on the home page under "from the notes".

```js
{
  slug: "2026-11-modular",         // used as the #anchor: notes.html#2026-11-modular
  date: "2026-11-02",
  title: "the modular",
  tag: "gear",                     // optional: field, patch, gear, release...
  draft: true,                     // optional: hides the note until you remove it
  body: [
    "One paragraph per string.",
    "Simple HTML works for links: <a href=\"/releases.html#terrarium\">terrarium</a>."
  ],
  links: [                         // optional, under the text; the first is the main one
    { label: "the rack on modulargrid", url: "https://www.modulargrid.net/e/racks/view/..." }
  ],
  photo: {                         // optional, one per note
    src: "/assets/img/photos/modular.webp",
    alt: "What's in the photo, plainly.",
    caption: "where and when, lowercase"
  }
}
```

To add a photo, grade it first (see "Photos" in `brand/README.md`) so it's 4:5 and has no GPS in it.

Two drafts are waiting with their photos already graded: the modular and the desert. Write their text and set `draft: false`, or delete the line. Drafts are hidden on the site but still sit in the public `data/notes.js`, so don't put anything there you wouldn't publish.

## Publishing on GitHub Pages

1. Create a repository (for example `glassgarden.cc`) and push this folder's contents to `main`.
2. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` and `/ (root)`.
3. The `CNAME` file already says `glassgarden.cc`. At your domain's DNS add:
   - four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - a `CNAME` record for `www` pointing to `<your-github-user>.github.io`
4. Back in **Settings → Pages**, wait for the DNS check to pass, then tick **Enforce HTTPS**.

If the domain is on Cloudflare, set those records to **DNS only** (grey cloud) until GitHub has issued the certificate.

## Previewing locally

Pages use root paths (`/assets/...`), so open them through a small server rather than double-clicking:

```sh
python -m http.server 8000
```

then visit http://localhost:8000.

## Brand

Colors, type and spacing live as CSS variables at the top of `assets/css/site.css`. Type is IBM Plex Mono and IBM Plex Sans from Google Fonts. `assets/js/jar.js` is the pixel jar generator that drew the logo; the site uses its quieter palette.

The icons and share image in `assets/img` come from the brand kit: `brand/generator/gen_brand.py` writes `favicon-32.png`, `apple-touch-icon.png` and `glassgarden-mark.svg` there, and `og-image.png` is a copy of `brand/social/quiet/glassgarden-og-1200x630.png`. See `brand/README.md`.
