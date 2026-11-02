/* Renders window.RELEASES into any element with [data-releases].
   data-limit="1" shows only the newest few; data-status="out" filters by status. */
(function () {
  "use strict";
  var GG = window.Glassgarden, list = window.RELEASES || [];
  var current = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function art(seed) {
    var c = el("canvas", "release-art");
    var COLS = 28, ROWS = 36, scale = 8;
    c.width = COLS * scale; c.height = ROWS * scale;
    c.setAttribute("aria-hidden", "true");
    var ctx = c.getContext("2d");
    var R = GG.rng(seed);
    var j = GG.jar({ w: 24, h: 31, neck: 12, seed: seed, plants: 3, glow: R.int(2, 4), radius: 4, lid: 2 });
    GG.draw(ctx, j.grid, 2, 3, scale, GG.QUIET);
    return c;
  }

  function player(item) {
    var wrap = el("div", "player");
    var audio = new Audio();
    audio.preload = "none";
    audio.src = item.audio;
    var btn = el("button", "play");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play " + item.title);
    btn.innerHTML = '<span class="glyph" aria-hidden="true"></span>';
    var time = el("span", "player-time", item.duration || "0:00");
    function sync() {
      var on = !audio.paused;
      btn.classList.toggle("is-playing", on);
      btn.setAttribute("aria-label", (on ? "Pause " : "Play ") + item.title);
    }
    btn.addEventListener("click", function () {
      if (audio.paused) {
        if (current && current !== audio) current.pause();
        current = audio; audio.play();
      } else { audio.pause(); }
    });
    ["play", "pause", "ended"].forEach(function (ev) { audio.addEventListener(ev, sync); });
    audio.addEventListener("timeupdate", function () {
      var t = Math.floor(audio.currentTime);
      time.textContent = Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0") + (item.duration ? " / " + item.duration : "");
    });
    wrap.appendChild(btn); wrap.appendChild(time);
    return wrap;
  }

  function card(item) {
    var a = el("article", "release" + (item.status === "growing" ? " is-growing" : ""));
    a.id = item.slug;
    a.appendChild(art(item.seed));
    var body = el("div", "release-body");
    var head = el("div", "release-head");
    head.appendChild(el("h3", null, item.title));
    head.appendChild(el("span", "status" + (item.status === "growing" ? " growing" : ""), item.status === "growing" ? "growing" : "out now"));
    body.appendChild(head);
    body.appendChild(el("p", "meta", [item.year, item.kind, item.seed && "seed " + item.seed].filter(Boolean).join(" · ")));
    body.appendChild(el("p", null, item.summary));
    if (item.audio) body.appendChild(player(item));
    if (item.links && item.links.length) {
      var acts = el("div", "release-actions");
      item.links.forEach(function (l, i) {
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

  document.querySelectorAll("[data-releases]").forEach(function (host) {
    var status = host.getAttribute("data-status");
    var items = list.filter(function (r) { return !status || r.status === status; });
    var limit = parseInt(host.getAttribute("data-limit"), 10) || items.length;
    items.slice(0, limit).forEach(function (item) { host.appendChild(card(item)); });
    if (!items.length) host.appendChild(el("p", "muted", "Nothing here yet."));
  });

  // the cards arrive after load, so jump to a linked one once it exists
  var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
})();
