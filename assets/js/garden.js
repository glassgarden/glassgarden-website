/* Renders window.GARDEN on garden.html: a strip of the five stages, each a small pixel plant
   in the jar's palette, then every item under its stage. Item text is plain; nothing is HTML. */
(function () {
  "use strict";
  var GG = window.Glassgarden, data = window.GARDEN || { items: [] };

  // 12×12 plants, in jar.js's letters: s/S soil, m/M moss, a/A amber, d ember, O dry glass-grey
  var SOIL = ["ssssssmsssss", "sSsssssssSss", "ssSsssssSsss", "SSSSSSSSSSSS"];
  function plant(top, soil) { return top.concat(soil || SOIL).map(function (r) { return r.split(""); }); }

  var STAGES = [
    { id: "seed", name: "seed", says: "an idea, written down",
      art: plant(["............", "............", "............", "............", "............",
        "............", "............", "............"],
        ["ssssssssssss", "sSsssdasssSs", "ssSsssssSsss", "SSSSSSSSSSSS"]) },
    { id: "sprouting", name: "sprouting", says: "the first code, not played yet",
      art: plant(["............", "............", "............", "............", "............",
        "....MM.mm...", ".....Mmm....", "......m....."]) },
    { id: "growing", name: "growing", says: "it plays, still being shaped",
      art: plant(["............", ".....MM.....", "......m.....", "..MMm.m.....", "....mmm.mM..",
        "......mmm...", "......m.....", "......m....."]) },
    { id: "bloom", name: "in bloom", says: "out, for anyone to use",
      art: plant(["......A.....", ".....AaA....", "......d.....", "......m.MM..", "..MM..mm....",
        "...mmmm.....", "......m.....", "......m....."]) },
    { id: "resting", name: "resting", says: "set aside for now, not forgotten",
      art: plant(["............", "............", "...OO.......", "..O..O......", "..d..O......",
        "......O.....", "......O.....", "......O....."],
        ["ssssssOsssss", "sSsssssssSss", "ssSsssssSsss", "SSSSSSSSSSSS"]) },
  ];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function sprite(stage) {
    var c = el("canvas");
    c.width = 48; c.height = 48;
    c.setAttribute("aria-hidden", "true");
    GG.draw(c.getContext("2d"), stage.art, 0, 0, 4, GG.QUIET);
    return c;
  }

  function linkRow(links) {
    var acts = el("div", "release-actions");
    links.forEach(function (l, i) {
      var external = new URL(l.url, location.href).host !== location.host;
      var a = el("a", i === 0 ? "primary" : null, l.label + (external ? " ↗" : ""));
      a.href = l.url;
      if (external) a.rel = "noopener";
      acts.appendChild(a);
    });
    return acts;
  }

  function plot(item) {
    var art = el("article", "plot");
    var body = el("div", "plot-body");
    var h = el("h3");
    if (item.href) { var a = el("a", null, item.title); a.href = item.href; h.appendChild(a); }
    else h.textContent = item.title;
    body.appendChild(h);
    var meta = el("p", "meta", item.kind || "");
    if (item.home === "vfm") {
      meta.appendChild(document.createTextNode((item.kind ? " · " : "") + "with "));
      var v = el("a", null, "Voltage Foundry Modular"); v.href = "https://vfmod.com"; v.rel = "noopener";
      meta.appendChild(v);
    }
    body.appendChild(meta);
    if (item.summary) body.appendChild(el("p", null, item.summary));
    if (item.links && item.links.length) body.appendChild(linkRow(item.links));
    art.appendChild(body);
    if (item.checklist && item.checklist.length) {
      var ul = el("ul", "checklist");
      ul.setAttribute("aria-label", "done and next");
      item.checklist.forEach(function (c) {
        var li = el("li", c.done ? "done" : null, c.text);
        var sr = el("span", "sr-only", c.done ? " (done)" : " (next)");
        li.appendChild(sr);
        ul.appendChild(li);
      });
      art.appendChild(ul);
    }
    return art;
  }

  var strip = document.querySelector("[data-stages]");
  var beds = document.querySelector("[data-beds]");
  var tended = document.querySelector("[data-tended]");
  if (tended && data.tended) tended.textContent = "last tended " + data.tended;

  STAGES.forEach(function (stage) {
    var items = data.items.filter(function (i) { return i.stage === stage.id; });
    if (strip) {
      var li = el("li"), a = el("a");
      a.href = "#" + stage.id;
      a.appendChild(sprite(stage));
      a.appendChild(el("span", "stage-name", stage.name));
      a.appendChild(el("span", "stage-count", String(items.length)));
      a.setAttribute("aria-label", stage.name + ": " + items.length);
      li.appendChild(a);
      strip.appendChild(li);
    }
    if (beds) {
      var sec = el("section", "stage");
      sec.id = stage.id;
      var head = el("div", "stage-head");
      head.appendChild(sprite(stage));
      var t = el("div");
      t.appendChild(el("h2", null, stage.name));
      t.appendChild(el("p", null, stage.says));
      head.appendChild(t);
      sec.appendChild(head);
      items.forEach(function (i) { sec.appendChild(plot(i)); });
      if (!items.length) sec.appendChild(el("p", "empty", "Nothing here right now."));
      beds.appendChild(sec);
    }
  });

  var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
})();
