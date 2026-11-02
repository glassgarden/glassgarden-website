/* The home emblem: one jar on a fine pixel grid, grown from a new seed on every visit.
   The plants grow in, a little amber pollen drifts out of the lid. Tap to regrow. */
(function () {
  "use strict";
  var GG = window.Glassgarden;
  var canvas = document.getElementById("garden");
  if (!canvas || !GG) return;
  var ctx = canvas.getContext("2d");
  var label = document.getElementById("garden-seed");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var P = GG.QUIET;
  var COLS = 56,
    ROWS = 72; // the art grid; the canvas scales it
  var state = null,
    running = true,
    last = 0,
    px = 5;

  function size() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    px = Math.min(canvas.width / COLS, canvas.height / ROWS);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function build(seed) {
    var R = GG.rng(seed);
    var w = 44,
      h = 56;
    var j = GG.jar({
      w: w,
      h: h,
      neck: R.int(20, 26),
      seed: R.int(1, 1e9),
      plants: R.int(4, 5),
      glow: R.int(2, 5),
      radius: 6,
      lid: 3,
    });
    j.x = Math.floor((COLS - w) / 2);
    j.y = ROWS - h - 2;
    j.order = j.plantCells.slice().sort(function (a, b) {
      return b[1] - a[1];
    });
    j.saved = j.order.map(function (c) {
      return j.grid[c[1]][c[0]];
    });
    j.order.forEach(function (c) {
      j.grid[c[1]][c[0]] = "g";
    });
    j.grown = 0;
    state = { seed: seed, R: R, jar: j, pollen: [] };
    if (still) {
      j.order.forEach(function (c, i) {
        j.grid[c[1]][c[0]] = j.saved[i];
      });
      j.grown = j.order.length;
      for (var k = 0; k < 6; k++)
        state.pollen.push({
          x: j.x + j.lidX + R.int(-4, 4),
          y: j.y - 2 - R.int(0, 12),
          age: R.int(0, 14),
          life: 22,
        });
    }
    if (label) label.textContent = "seed " + seed + " · tap to grow another";
  }

  function step() {
    var s = state,
      j = s.jar,
      R = s.R;
    if (j.grown < j.order.length) {
      var n = Math.max(1, Math.ceil(j.order.length / 60));
      for (var k = 0; k < n && j.grown < j.order.length; k++, j.grown++) {
        var c = j.order[j.grown];
        j.grid[c[1]][c[0]] = j.saved[j.grown];
      }
    } else if (R.random() < 0.12) {
      s.pollen.push({
        x: j.x + j.lidX + R.int(-2, 2),
        y: j.y - 1,
        age: 0,
        life: R.int(14, 30),
      });
    }
    s.pollen.forEach(function (p) {
      p.age++;
      if (R.random() < 0.6) p.y--;
      if (R.random() < 0.2) p.x += R.pick([-1, 1]);
    });
    s.pollen = s.pollen.filter(function (p) {
      return p.age < p.life && p.y > 0;
    });
  }

  function cell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.floor(x * px),
      Math.floor(y * px),
      Math.ceil(px),
      Math.ceil(px),
    );
  }

  function render() {
    var s = state,
      j = s.jar;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // faint shelf line under the jar
    for (var x = j.x - 4; x < j.x + j.grid[0].length + 4; x++)
      cell(x, ROWS - 2, "#262b28");
    for (var y = 0; y < j.grid.length; y++) {
      for (x = 0; x < j.grid[y].length; x++) {
        var c = j.grid[y][x];
        if (c !== ".") cell(j.x + x, j.y + y, P[c]);
      }
    }
    s.pollen.forEach(function (p) {
      var f = p.age / p.life;
      cell(p.x, p.y, f < 0.3 ? P.A : f < 0.65 ? P.a : P.d);
    });
  }

  function loop(now) {
    if (!running) return;
    if (now - last > 120) {
      step();
      render();
      last = now;
    }
    requestAnimationFrame(loop);
  }

  function regrow() {
    build(Math.floor(Math.random() * 9000) + 1000);
    render();
  }

  size();
  regrow();
  if (!still) requestAnimationFrame(loop);

  canvas.addEventListener("click", regrow);
  canvas.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      regrow();
    }
  });
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      size();
      render();
    }, 150);
  });
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running && !still) requestAnimationFrame(loop);
  });
})();
