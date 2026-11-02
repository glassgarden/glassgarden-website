/* glassgarden pixel jars: the same generator that drew the logo, in the browser.
   Every jar is a grid of single-letter cells; PALETTE maps letters to colors. */
(function (global) {
  "use strict";

  var PALETTE = {
    o: "#c9d0ca", // glass outline
    O: "#7d857f", // glass shade
    h: "#f4f5f1", // glass highlight
    g: "#1d221f", // glass interior
    l: "#a3aca5", // lid
    L: "#525a54", // lid shade
    s: "#3a2f1a", // soil
    S: "#2a2215", // soil dark
    m: "#7fa06a", // moss
    M: "#a9c98d", // moss light
    a: "#d9a441", // amber
    A: "#f0c96e", // honey
    d: "#9a6b16", // ember
    w: "#e3e6e1"  // ink (wordmark)
  };

  // the quieter palette used on the site: dimmer glass, darker moss, the same amber light
  var QUIET = {
    o: "#8d958f", O: "#596059", h: "#c9d0ca", g: "#141715",
    l: "#7d857f", L: "#3f4540", s: "#2e2616", S: "#221c11",
    m: "#55704a", M: "#7d9468", a: "#d9a441", A: "#f0c96e", d: "#9a6b16", w: "#e3e6e1"
  };

  // small seeded PRNG so a seed always grows the same jar
  function rng(seed) {
    var t = (seed >>> 0) || 1;
    function next() {
      t += 0x6d2b79f5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    }
    return {
      random: next,
      int: function (a, b) { return a + Math.floor(next() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle: function (arr) {
        for (var i = arr.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1)); var x = arr[i]; arr[i] = arr[j]; arr[j] = x;
        }
        return arr;
      }
    };
  }

  function blank(w, h) {
    var G = [];
    for (var y = 0; y < h; y++) { G.push(new Array(w).fill(".")); }
    return G;
  }

  /* jar(opts) -> { grid, plantCells }  plantCells lets callers animate growth */
  function jar(opts) {
    var w = opts.w, h = opts.h, neckW = opts.neck, lidH = opts.lid || 2;
    var R = rng(opts.seed || 1), plants = opts.plants || 3, glow = opts.glow == null ? 3 : opts.glow;
    var radius = opts.radius || 3;
    var G = blank(w, h);
    var nl = Math.floor((w - neckW) / 2), nr = nl + neckW - 1, bodyTop = lidH + 3;

    function inBody(x, y) {
      if (y < bodyTop || y > h - 1 || x < 0 || x > w - 1) return false;
      var r = radius;
      var corners = [[r, bodyTop + r], [w - 1 - r, bodyTop + r], [r, h - 1 - r], [w - 1 - r, h - 1 - r]];
      for (var i = 0; i < 4; i++) {
        var cx = corners[i][0], cy = corners[i][1];
        var inX = (x < r && cx === r) || (x > w - 1 - r && cx === w - 1 - r);
        var inY = (y < bodyTop + r && cy === bodyTop + r) || (y > h - 1 - r && cy === h - 1 - r);
        if (inX && inY && (x - cx) * (x - cx) + (y - cy) * (y - cy) > r * r + 1) return false;
      }
      return true;
    }
    function inNeck(x, y) { return y >= lidH && y <= bodyTop && x >= nl && x <= nr; }
    function inside(x, y) { return inBody(x, y) || inNeck(x, y); }

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        if (!inside(x, y)) continue;
        var edge = !inside(x + 1, y) || !inside(x - 1, y) || !inside(x, y + 1) || !inside(x, y - 1);
        G[y][x] = edge ? ((y >= h - 2 || x >= w - 2) ? "O" : "o") : "g";
      }
    }
    for (y = 0; y < lidH; y++) {
      for (x = nl - 1; x <= nr + 1; x++) G[y][x] = (y === lidH - 1) ? "L" : "l";
    }
    var soilTop = h - 1 - Math.max(2, Math.floor(h / 7));
    for (y = soilTop; y < h - 1; y++) {
      for (x = 0; x < w; x++) if (G[y][x] === "g") G[y][x] = (y === h - 2) ? "S" : "s";
    }
    for (x = 0; x < w; x++) {
      if (G[soilTop - 1][x] === "g" && R.random() < 0.35) G[soilTop - 1][x] = "s";
    }

    // plants: varied species, spaced apart
    var inner = [];
    for (x = 0; x < w; x++) if ("gs".indexOf(G[soilTop - 1][x]) >= 0) inner.push(x);
    inner = inner.slice(2, -2);
    var xs = [];
    R.shuffle(inner.slice()).forEach(function (px) {
      if (xs.length < plants && xs.every(function (o) { return Math.abs(px - o) >= 4; })) xs.push(px);
    });
    xs.sort(function (a, b) { return a - b; });
    var kinds = R.shuffle(["stalk", "sprout", "bush", "fern", "frond"]);
    var room = soilTop - bodyTop - 2;
    var plantCells = [];
    function put(px, py, c) {
      if (py >= 0 && py < h && px >= 0 && px < w && "gs".indexOf(G[py][px]) >= 0) {
        G[py][px] = c; plantCells.push([px, py]);
      }
    }

    // stones, half sunk in the soil: a rock in lid greys, a crystal in glass colours, lit from the left
    // like the glass. They draw from their own stream, so a seed grows the same plants with or without them.
    var Rs = rng((opts.seed || 1) * 7919 + 13), big = w > 30, used = [];
    function set(px, py, c) {
      if (py >= 0 && py < h && px >= 0 && px < w && "gs".indexOf(G[py][px]) >= 0) G[py][px] = c;
    }
    function spot(width) {
      var free = inner.filter(function (a) {
        var b = a + width - 1;
        return inner.indexOf(b) >= 0 &&
          xs.every(function (o) { return o < a - 1 || o > b + 1; }) &&
          used.every(function (u) { return u[1] < a - 1 || u[0] > b + 1; });
      });
      if (!free.length) return -1;
      var a = Rs.pick(free);
      used.push([a, a + width - 1]);
      return a;
    }
    if (Rs.random() < 0.6) {
      var rw = Rs.int(big ? 3 : 2, big ? 5 : 3), rx = spot(rw);
      if (rx >= 0) {
        for (x = rx; x < rx + rw; x++) set(x, soilTop, "O");
        for (x = rx + (rw > 3 ? 1 : 0); x < rx + rw - 1; x++) set(x, soilTop - 1, "l");
      }
    }
    if (Rs.random() < 0.4) {
      // three shards: a tall centre, shorter sides; light, mid and shadow facets
      var peak = Rs.int(big ? 4 : 3, big ? 6 : 4), cx = spot(3);
      var heights = [peak - Rs.int(1, 3), peak, peak - Rs.int(1, 3)];
      for (var k = 0; cx >= 0 && k < 3; k++) {
        for (y = soilTop; y > soilTop - Math.max(1, heights[k]); y--) set(cx + k, y, "hoO"[k]);
      }
      if (cx >= 0) set(cx + 1, soilTop - peak, "h");  // the point catches the light
    }

    xs.forEach(function (px, i) {
      var kind = kinds[i % kinds.length], top, yy;
      if (kind === "stalk") {
        top = soilTop - Math.max(4, Math.floor(room * (0.75 + R.random() * 0.2)));
        for (yy = top; yy < soilTop; yy++) put(px, yy, "m");
        var side = R.pick([-1, 1]);
        for (yy = top + 2; yy < soilTop - 1; yy += 3) { put(px + side, yy, "M"); side = -side; }
        put(px, top - 1, "M");
      } else if (kind === "sprout") {
        top = soilTop - Math.max(3, Math.floor(room * (0.3 + R.random() * 0.15)));
        for (yy = top; yy < soilTop; yy++) put(px, yy, "m");
        put(px - 1, top, "M"); put(px + 1, top, "M"); put(px - 1, top - 1, "M"); put(px + 1, top - 1, "M");
      } else if (kind === "bush") {
        var ht = Math.max(3, Math.floor(room * (0.35 + R.random() * 0.2)));
        var cy = soilTop - Math.floor(ht / 2) - 1;
        for (yy = soilTop - ht; yy < soilTop; yy++) {
          for (var dx = -2; dx <= 2; dx++) {
            if (Math.abs(dx) + Math.abs(yy - cy) * 0.8 <= 2.6) put(px + dx, yy, ((dx + yy) % 3 === 0) ? "M" : "m");
          }
        }
      } else if (kind === "frond") {
        // a fern leaf: a stem with leaflets that shorten toward the tip. The seed picks its form:
        // straight or arching, flat or rising leaflets, paired or alternating, sparse or dense
        var tall = Math.max(6, Math.floor(room * (0.55 + R.random() * 0.35)));
        var arch = R.pick([-1, 1]) * R.pick([0, 0.25, 0.45]);
        var bare = R.int(1, 3), longest = R.int(2, w > 30 ? 4 : 3);
        var rise = R.random() < 0.5, paired = R.random() < 0.4;
        var gap = rise ? R.pick([1, 2]) : 2;  // flat leaflets on every row would fill in solid
        var side = R.pick([-1, 1]), sx = px;
        for (var k = 0; k < tall; k++) {
          yy = soilTop - 1 - k;
          sx = px + Math.round(arch * k * k / (2 * tall));
          put(sx, yy, "m");
          if (k < bare || (k - bare) % gap) continue;
          var len = Math.max(1, Math.round(longest * (1 - (k - bare) / (tall - bare)) + 0.3));
          (paired ? [-1, 1] : [side = -side]).forEach(function (s) {
            for (var i = 1; i <= len; i++) put(sx + s * i, yy - (rise ? Math.floor(i / 2) : 0), i === len ? "m" : "M");
          });
        }
        put(sx, yy - 1, "M");
      } else {
        top = soilTop - Math.max(4, Math.floor(room * (0.55 + R.random() * 0.15)));
        for (yy = top + 1; yy < soilTop; yy++) put(px, yy, "m");
        put(px + 1, top, "m"); put(px + 2, top + 1, "M"); put(px + 1, top + 2, "M");
        for (yy = top + 3; yy < soilTop - 1; yy += 2) put(px - 1, yy, "M");
      }
    });

    // highlight streak on the glass
    for (y = bodyTop + 2; y < bodyTop + 2 + Math.floor((soilTop - bodyTop) / 2); y++) {
      if (G[y][2] === "g") G[y][2] = "h";
    }
    // amber glow inside
    var cells = [];
    for (y = bodyTop + 1; y < soilTop - 2; y++) for (x = 2; x < w - 2; x++) if (G[y][x] === "g") cells.push([x, y]);
    R.shuffle(cells).slice(0, glow).forEach(function (c) { G[c[1]][c[0]] = R.pick(["a", "A", "d"]); });

    return { grid: G, plantCells: plantCells, w: w, h: h, lidX: nl + Math.floor(neckW / 2) };
  }

  // pixel wordmark, lowercase, 9 rows tall
  var FONT = {
    g: ["....", "....", ".###", "#..#", "#..#", "#..#", ".###", "...#", "###."],
    l: ["#.", "#.", "#.", "#.", "#.", "#.", ".#", "..", ".."],
    a: ["....", "....", ".##.", "...#", ".###", "#..#", ".###", "....", "...."],
    s: ["....", "....", ".###", "#...", ".##.", "...#", "###.", "....", "...."],
    r: ["...", "...", "#.#", "##.", "#..", "#..", "#..", "...", "..."],
    d: ["...#", "...#", ".###", "#..#", "#..#", "#..#", ".###", "....", "...."],
    e: ["....", "....", ".##.", "#..#", "####", "#...", ".###", "....", "...."],
    n: ["....", "....", "###.", "#..#", "#..#", "#..#", "#..#", "....", "...."]
  };
  function word(text) {
    var glyphs = text.split("").map(function (c) { return FONT[c]; });
    var width = glyphs.reduce(function (s, g) { return s + g[0].length; }, 0) + glyphs.length - 1;
    var G = blank(width, 9), x = 0;
    glyphs.forEach(function (g) {
      g.forEach(function (row, y) { for (var i = 0; i < row.length; i++) if (row[i] === "#") G[y][x + i] = "w"; });
      x += g[0].length + 1;
    });
    return G;
  }

  function draw(ctx, G, ox, oy, px, pal) {
    pal = pal || PALETTE;
    for (var y = 0; y < G.length; y++) {
      for (var x = 0; x < G[y].length; x++) {
        var c = G[y][x];
        if (c === ".") continue;
        ctx.fillStyle = pal[c];
        ctx.fillRect((ox + x) * px, (oy + y) * px, px, px);
      }
    }
  }

  global.Glassgarden = { PALETTE: PALETTE, QUIET: QUIET, rng: rng, jar: jar, word: word, draw: draw };
})(window);
