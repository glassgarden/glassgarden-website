// Writes feed.xml (RSS 2.0) from data/notes.js: every published note, newest first.
// Run it after adding or changing a note:  node tools/feed.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const SITE = "https://glassgarden.cc";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "data/notes.js"), "utf8"), sandbox);
const notes = (sandbox.window.NOTES || []).filter((n) => !n.draft);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const abs = (html) => html.replace(/(href|src)="\//g, `$1="${SITE}/`);
const date = (d) => new Date(d + "T12:00:00Z").toUTCString();

function content(n) {
  const parts = [];
  if (n.photo) parts.push(`<p><img src="${SITE}${n.photo.src}" alt="${esc(n.photo.alt || "")}"></p>`);
  (n.body || []).forEach((p) => parts.push(`<p>${abs(p)}</p>`));
  if (n.widget) parts.push(`<p><a href="${SITE}/notes.html#${n.slug}">There's something to play in this note: open it on the site.</a></p>`);
  (n.after || []).forEach((p) => parts.push(`<p>${abs(p)}</p>`));
  if (n.links && n.links.length) {
    const url = (u) => (u.startsWith("/") ? SITE + u : u);
    parts.push("<p>" + n.links.map((l) => `<a href="${esc(url(l.url))}">${esc(l.label)}</a>`).join(" · ") + "</p>");
  }
  return parts.join("\n").replace(/]]>/g, "]]&gt;");
}

const items = notes.map((n) => `    <item>
      <title>${esc(n.title)}</title>
      <link>${SITE}/notes.html#${n.slug}</link>
      <guid isPermaLink="false">glassgarden-note-${n.slug}</guid>
      <pubDate>${date(n.date)}</pubDate>${n.tag ? `\n      <category>${esc(n.tag)}</category>` : ""}
      <description><![CDATA[${content(n)}]]></description>
    </item>`);

const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>glassgarden notes</title>
    <link>${SITE}/notes.html</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Field notes from glassgarden: generative ambient music, grown in small sealed worlds.</description>
    <language>en</language>
    <lastBuildDate>${notes.length ? date(notes[0].date) : new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;
writeFileSync(join(root, "feed.xml"), xml);
console.log(`feed.xml: ${notes.length} notes`);
