/* A playable isokey layout: the 16×8 grid lit the way isokey.lua lights it, with a soft voice
   in the browser. Renders into any element with [data-widget="isokey"]. Notes, scales and LED
   levels follow iii-scripts/isokey/isokey.lua; row 1 shows the control row, and only the octave
   keys (1 and 2) work here. */
(function () {
  "use strict";

  var NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var SCALES = [
    ["major", [0, 2, 4, 5, 7, 9, 11]], ["natural minor", [0, 2, 3, 5, 7, 8, 10]],
    ["dorian", [0, 2, 3, 5, 7, 9, 10]], ["phrygian", [0, 1, 3, 5, 7, 8, 10]],
    ["lydian", [0, 2, 4, 6, 7, 9, 11]], ["mixolydian", [0, 2, 4, 5, 7, 9, 10]],
    ["locrian", [0, 1, 3, 5, 6, 8, 10]], ["harmonic minor", [0, 2, 3, 5, 7, 8, 11]],
    ["melodic minor", [0, 2, 3, 5, 7, 9, 11]], ["major pentatonic", [0, 2, 4, 7, 9]],
    ["minor pentatonic", [0, 3, 5, 7, 10]], ["blues", [0, 3, 5, 6, 7, 10]],
    ["whole tone", [0, 2, 4, 6, 8, 10]], ["phrygian dominant", [0, 1, 4, 5, 7, 8, 10]],
    ["hungarian minor", [0, 2, 3, 6, 7, 8, 11]], ["diminished", [0, 2, 3, 5, 6, 8, 9, 11]],
  ];
  // row 1 at rest, as redraw() draws it with the defaults (velocity 100, chords off)
  var ROW1 = { 4: 3, 6: 7, 7: 10, 8: 13, 9: 2, 11: 3, 13: 4, 14: 4, 16: 5 };
  var ROW1_NAMES = { 1: "octave down", 2: "octave up" };

  // LED level 0-15 to a color: the grid's dark key up to the site's honey
  function shade(l) {
    var off = [32, 35, 33], on = [240, 201, 110], t = l / 15;
    return "rgb(" + off.map(function (a, i) { return Math.round(a + (on[i] - a) * t); }).join(",") + ")";
  }
  function noteName(n) { return NAMES[n % 12] + (Math.floor(n / 12) - 1); }

  // one shared voice for every grid on the page: two soft oscillators into a lowpass and a short echo
  var audio = null;
  function ctx() {
    if (audio) return audio;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ac = new AC(), out = ac.createGain(), lp = ac.createBiquadFilter();
    var dly = ac.createDelay(1), fb = ac.createGain(), wet = ac.createGain();
    out.gain.value = 0.16; lp.type = "lowpass"; lp.frequency.value = 2600;
    dly.delayTime.value = 0.34; fb.gain.value = 0.32; wet.gain.value = 0.22;
    out.connect(lp); lp.connect(ac.destination);
    lp.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ac.destination);
    audio = { ac: ac, out: out };
    return audio;
  }
  function voice(n) {
    var a = ctx(); if (!a) return null;
    var ac = a.ac, t = ac.currentTime, f = 440 * Math.pow(2, (n - 69) / 12);
    if (ac.state === "suspended") ac.resume();
    var g = ac.createGain(), o1 = ac.createOscillator(), o2 = ac.createOscillator(), g2 = ac.createGain();
    o1.type = "triangle"; o1.frequency.value = f;
    o2.type = "sine"; o2.frequency.value = f * 2.003; g2.gain.value = 0.18;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.012);
    g.gain.setTargetAtTime(0.3, t + 0.012, 0.25);
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(a.out);
    o1.start(t); o2.start(t);
    return {
      stop: function () {
        var now = ac.currentTime;
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.setTargetAtTime(0, now, 0.35);
        o1.stop(now + 2.2); o2.stop(now + 2.2);
      },
    };
  }

  function mount(host) {
    var s = { root: 0, inkey: false, scale: 0, rsemi: 5, rdeg: 3, oct: 0 };
    var held = {};     // pointer id or "k:x,y" -> {x, y, n}
    var sounding = {}; // midi note -> { count, v }

    function base() { return 36 + s.root + 12 * s.oct; }
    function scale() { return SCALES[s.scale][1]; }
    function keyNote(x, y) {
      var r = 8 - y, c = x - 1;
      if (!s.inkey) return base() + c + r * s.rsemi;
      var sc = scale(), i = c + r * s.rdeg;
      return base() + sc[i % sc.length] + 12 * Math.floor(i / sc.length);
    }
    function inScale(n) { return scale().indexOf(((n - s.root) % 12 + 12) % 12) >= 0; }

    var wrap = document.createElement("div");
    wrap.className = "isogrid-wrap";
    var grid = document.createElement("div");
    grid.className = "isogrid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "isokey grid, 16 by 8. Row 1 holds the octave keys; rows 2 to 8 play notes.");
    var keys = [];
    for (var y = 1; y <= 8; y++) {
      for (var x = 1; x <= 16; x++) {
        var b = document.createElement("button");
        b.type = "button";
        b.dataset.x = x; b.dataset.y = y;
        if (y === 1 && !ROW1_NAMES[x]) { b.className = "off"; b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }
        else if (y === 1) b.className = "ctl";
        keys.push(b);
        grid.appendChild(b);
      }
    }

    var bar = document.createElement("div");
    bar.className = "isogrid-bar";
    function select(label, options, value, onchange) {
      var l = document.createElement("label"), sel = document.createElement("select");
      l.appendChild(document.createTextNode(label));
      options.forEach(function (o) {
        var op = document.createElement("option"); op.value = o[1]; op.textContent = o[0]; sel.appendChild(op);
      });
      sel.value = String(value);
      sel.addEventListener("change", function () { onchange(sel.value); releaseAll(); draw(); });
      l.appendChild(sel); bar.appendChild(l);
      return sel;
    }
    select("root", NAMES.map(function (n, i) { return [n, i]; }), 0, function (v) { s.root = +v; });
    select("mode", [["chromatic", "chr"], ["in key", "key"]], "chr", function (v) {
      s.inkey = v === "key"; fillRows();
    });
    select("scale", SCALES.map(function (sc, i) { return [sc[0], i]; }), 0, function (v) { s.scale = +v; });
    var rowSel = select("rows", [], "", function (v) { if (s.inkey) s.rdeg = +v; else s.rsemi = +v; });
    function fillRows() {
      rowSel.textContent = "";
      var opts = s.inkey
        ? [["2 degrees", 2], ["3 degrees", 3], ["4 degrees", 4], ["7 degrees", 7]]
        : [["minor thirds", 3], ["major thirds", 4], ["fourths", 5], ["fifths", 7], ["octaves", 12]];
      opts.forEach(function (o) {
        var op = document.createElement("option"); op.value = o[1]; op.textContent = o[0]; rowSel.appendChild(op);
      });
      rowSel.value = String(s.inkey ? s.rdeg : s.rsemi);
    }
    fillRows();
    var now = document.createElement("span");
    now.className = "isogrid-now";
    now.setAttribute("aria-live", "polite");
    bar.appendChild(now);

    var hint = document.createElement("p");
    hint.className = "isogrid-hint";
    hint.textContent = "Press or drag across the keys; on a touch screen, use several fingers. The two keys top left move the octave.";

    wrap.appendChild(grid); wrap.appendChild(bar); wrap.appendChild(hint);
    host.appendChild(wrap);

    function level(x, y) {
      if (y === 1) {
        if (x === 1) return 4 + Math.max(0, -s.oct) * 4;
        if (x === 2) return Math.min(15, 4 + Math.max(0, s.oct) * 3);
        return ROW1[x] || 0;
      }
      var n = keyNote(x, y);
      if (sounding[n]) return 15;
      if (((n - s.root) % 12 + 12) % 12 === 0) return 10;
      if (s.inkey) return 4;
      return inScale(n) ? 5 : 1;
    }
    function draw() {
      keys.forEach(function (b) {
        var x = +b.dataset.x, y = +b.dataset.y;
        b.style.setProperty("--key", shade(level(x, y)));
        if (y > 1) {
          var n = keyNote(x, y);
          b.setAttribute("aria-label", n <= 127 ? noteName(n) : "silent");
          b.setAttribute("aria-pressed", sounding[n] ? "true" : "false");
        } else if (ROW1_NAMES[x]) b.setAttribute("aria-label", ROW1_NAMES[x]);
      });
      var names = Object.keys(sounding).map(Number).sort(function (a, b) { return a - b; }).map(noteName);
      now.textContent = names.join(" ");
    }

    function press(id, b) {
      var x = +b.dataset.x, y = +b.dataset.y;
      if (y === 1) {
        if (x === 1 && s.oct > -3) s.oct--;
        else if (x === 2 && s.oct < 4) s.oct++;
        else return;
        releaseAll(); draw(); return;
      }
      var n = keyNote(x, y);
      if (n > 127 || n < 0) return;
      held[id] = { n: n };
      if (sounding[n]) sounding[n].count++;
      else sounding[n] = { count: 1, v: voice(n) };
      draw();
    }
    function release(id) {
      var h = held[id]; if (!h) return;
      delete held[id];
      var snd = sounding[h.n];
      if (snd && --snd.count <= 0) { if (snd.v) snd.v.stop(); delete sounding[h.n]; }
      draw();
    }
    function releaseAll() { Object.keys(held).forEach(release); }

    // pointers: each finger or mouse is one key at a time, and dragging moves to the next key
    var over = {};
    function keyAt(e) {
      var t = document.elementFromPoint(e.clientX, e.clientY);
      return t && t.parentNode === grid && !t.classList.contains("off") ? t : null;
    }
    grid.addEventListener("pointerdown", function (e) {
      var b = keyAt(e); if (!b) return;
      e.preventDefault();
      over[e.pointerId] = b;
      press("p" + e.pointerId, b);
    });
    grid.addEventListener("pointermove", function (e) {
      if (!(e.pointerId in over)) return;
      var b = keyAt(e);
      if (b === over[e.pointerId]) return;
      release("p" + e.pointerId);
      over[e.pointerId] = b;
      if (b && +b.dataset.y > 1) press("p" + e.pointerId, b);
    });
    function up(e) { if (e.pointerId in over) { delete over[e.pointerId]; release("p" + e.pointerId); } }
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    // keyboard: Space or Enter holds the focused key
    grid.addEventListener("keydown", function (e) {
      if ((e.key === " " || e.key === "Enter") && !e.repeat && e.target.parentNode === grid) {
        e.preventDefault(); press("k" + e.target.dataset.x + "," + e.target.dataset.y, e.target);
      }
    });
    grid.addEventListener("keyup", function (e) {
      if ((e.key === " " || e.key === "Enter") && e.target.parentNode === grid) {
        release("k" + e.target.dataset.x + "," + e.target.dataset.y);
      }
    });
    grid.addEventListener("click", function (e) { e.preventDefault(); });
    window.addEventListener("blur", releaseAll);

    draw();
  }

  document.querySelectorAll('[data-widget="isokey"]').forEach(mount);
})();
