// Local preview: builds the site into _site/, serves it, and rebuilds when content, pages or assets change.
// Open http://localhost:8000 (or: node tools/dev.mjs 3000).  Pages reload themselves after a rebuild.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, normalize } from "node:path";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(repo, "_site"); // what gets served: the built site
const port = Number(process.argv[2]) || 8000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".txt": "text/plain; charset=utf-8",
};

function build() {
  const r = spawnSync(process.execPath, [join(repo, "tools/build.mjs")], { cwd: repo, encoding: "utf8" });
  const out = (r.stdout + r.stderr).trim();
  console.log(r.status === 0 ? out : `build failed:\n${out}`);
  return r.status === 0;
}

// Small script added to every HTML page: reloads it when the server says the site was rebuilt.
const RELOAD = `<script>new EventSource("/__reload").onmessage=function(){location.reload()}</script>`;
const clients = new Set();

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/__reload") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  let file = join(root, normalize(decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end("forbidden");
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    await stat(file);
  } catch {
    // like GitHub Pages: /notes serves /notes.html, anything else gets 404.html
    const alt = file + ".html";
    file = await stat(alt).then(() => alt, () => null);
    if (!file) {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      return res.end(await readFile(join(root, "404.html"), "utf8").catch(() => "not found"));
    }
  }
  let body = await readFile(file);
  const type = TYPES[extname(file)] || "application/octet-stream";
  if (extname(file) === ".html") body = body.toString("utf8").replace("</body>", RELOAD + "</body>");
  res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
  res.end(body);
}).listen(port, () => console.log(`serving http://localhost:${port}  (watching content/, tools/, pages, assets/ and audio/)`));

build();
let timer;
const onChange = (what) => (_, name) => {
  if (what === "." && !(name || "").endsWith(".html")) return; // root: only the pages
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`changed: ${what}/${name || ""}`);
    if (build()) clients.forEach((c) => c.write("data: reload\n\n"));
  }, 150);
};
for (const dir of ["content", "tools", "assets", "audio"]) watch(join(repo, dir), { recursive: true }, onChange(dir));
watch(repo, onChange(".")); // the pages in the repository root
