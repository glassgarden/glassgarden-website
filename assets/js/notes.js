/* Renders window.NOTES (published ones, newest first) into any element with [data-notes].
   On the notes page each note is a full entry; data-compact shows short rows linking to them,
   and data-limit="3" shows only the newest few. Note bodies are trusted HTML from data/notes.js. */
(function () {
  "use strict";
  var list = (window.NOTES || []).filter(function (n) { return !n.draft; });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function img(photo, lazy) {
    var i = el("img");
    i.src = photo.src; i.alt = photo.alt || ""; i.width = 1200; i.height = 1500;
    if (lazy) i.loading = "lazy";
    return i;
  }

  function meta(n) {
    return el("p", "meta", [n.date, n.tag].filter(Boolean).join(" · "));
  }

  function entry(n, i) {
    var a = el("article", "note" + (n.photo ? " has-photo" : ""));
    a.id = n.slug;
    if (n.photo) {
      var fig = el("figure", "photo");
      fig.appendChild(img(n.photo, i > 0));
      if (n.photo.caption) fig.appendChild(el("figcaption", null, n.photo.caption));
      a.appendChild(fig);
    }
    var body = el("div", "note-body");
    body.appendChild(meta(n));
    var h = el("h3"), link = el("a", null, n.title);
    link.href = "#" + n.slug;
    h.appendChild(link);
    body.appendChild(h);
    (n.body || []).forEach(function (html) {
      var p = el("p"); p.innerHTML = html; body.appendChild(p);
    });
    if (n.links && n.links.length) {
      var acts = el("div", "note-links");
      n.links.forEach(function (l, i) {
        var external = new URL(l.url, location.href).host !== location.host;
        var link = el("a", i === 0 ? "primary" : null, l.label + (external ? " ↗" : ""));
        link.href = l.url;
        if (external) { link.rel = "noopener"; }
        acts.appendChild(link);
      });
      body.appendChild(acts);
    }
    a.appendChild(body);
    return a;
  }

  function excerpt(n) {
    var p = el("p"); p.innerHTML = (n.body || [""])[0];
    var t = p.textContent;
    return t.length > 150 ? t.slice(0, t.lastIndexOf(" ", 150)) + "…" : t;
  }

  function row(n) {
    var a = el("a", "note-row" + (n.photo ? " has-photo" : ""));
    a.href = "/notes.html#" + n.slug;
    if (n.photo) a.appendChild(img(n.photo, true));
    var body = el("div", "note-body");
    body.appendChild(meta(n));
    body.appendChild(el("h3", null, n.title));
    body.appendChild(el("p", "muted", excerpt(n)));
    a.appendChild(body);
    return a;
  }

  document.querySelectorAll("[data-notes]").forEach(function (host) {
    var compact = host.hasAttribute("data-compact");
    var limit = parseInt(host.getAttribute("data-limit"), 10) || list.length;
    list.slice(0, limit).forEach(function (n, i) { host.appendChild(compact ? row(n) : entry(n, i)); });
    if (!list.length) host.appendChild(el("p", "muted", "Nothing here yet."));
  });

  // the notes arrive after load, so jump to a linked one once it exists
  var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
})();
