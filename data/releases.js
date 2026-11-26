/* Releases, newest first.
   status: "out" for published work, "growing" for something still in progress.
   seed: any whole number; each one grows a different jar for the cover.
   tags: what it runs on, a few short words (norns, iii, grid, browser, plugin, midi...).
   links: the first one is the main action. Use "play in the browser" for a playable version
     and "view code" for the repository, so every card reads the same way.
   license: optional, shown with the year.
   credits: optional, one line of simple HTML: whose work this is built on.
   changes: optional, newest first, shown folded under the card: [{ date: "2026-11", text: "..." }]
   When terrarium moves to this domain, change its url below and nothing else needs touching. */
window.RELEASES = [
  {
    slug: "isokey",
    title: "isokey",
    status: "out",
    year: "2026",
    kind: "iii script for 16×8 grids",
    tags: ["iii", "grid", "midi"],
    summary:
      "The grid as an isomorphic keyboard. Each key to the right is a step higher and each row up is a fourth, so a chord or a scale run has the same shape wherever you play it, in any key. Chromatic or in key, sixteen scales, chords, sustain and pitch bend, for any MIDI synth.",
    links: [
      { label: "try the layout", url: "/notes.html#2026-11-isokey" },
      { label: "view code", url: "https://github.com/glassgarden/iii-scripts/tree/main/isokey" },
      { label: "manual", url: "https://github.com/glassgarden/iii-scripts/blob/main/isokey/Readme.md" },
    ],
    license: "GPL-3.0",
    credits:
      'Some ideas come from <a href="https://github.com/nolliegray/tropiii">tropiii</a> by nolliegray. Runs on <a href="https://monome.org/docs/iii/">monome iii</a>.',
    audio: null,
    seed: 5040,
  },
  {
    slug: "terrarium",
    title: "terrarium",
    status: "out",
    year: "2026",
    kind: "generative norns script · plays in the browser",
    tags: ["norns", "browser", "plugin"],
    summary:
      "A small sealed world that keeps itself going. Notes grow, overlap and die back on their own, and every visit sounds a little different. Open it, press start, and let it run.",
    links: [
      { label: "play in the browser", url: "https://terrarium.glassgarden.cc" },
      { label: "view code", url: "https://github.com/glassgarden/terrarium" },
    ],
    license: "GPL-3.0",
    credits:
      'Its voices are <a href="https://github.com/pichenettes/eurorack">Mutable Instruments</a> modules by Émilie Gillet, through Volker Böhm\'s <a href="https://github.com/v7b1/mi-UGens">mi-UGens</a>.',
    changes: [
      { date: "2026-11", text: "1.1: also a VST3 and AU plugin." },
      { date: "2026-11", text: "1.0: tested on norns and listed on norns.community." },
    ],
    audio: null,
    seed: 2718,
  },
  {
    slug: "greenhouse",
    title: "greenhouse",
    status: "out",
    year: "2026",
    kind: "a browser workbench for monome iii devices",
    tags: ["iii", "browser"],
    summary:
      "Live-code, patch and play iii devices from the browser: a console, an editor that knows each device, live views of the grid and achene, and graft, a patch editor that wires blocks into a script without code.",
    links: [
      { label: "open greenhouse", url: "https://greenhouse.vfmod.com/" },
      { label: "view code", url: "https://github.com/VoltageFoundryMod/greenhouse" },
    ],
    credits:
      'Grown from monome\'s <a href="https://github.com/monome/web-diii">diii</a>.',
    audio: null,
    seed: 1651,
  },
  {
    slug: "pollen",
    title: "pollen",
    status: "growing",
    year: "2026",
    kind: "norns script · plays in the browser · version 0.2",
    tags: ["norns", "browser"],
    summary:
      "Live radio from around the globe, caught on a reel and scattered back out as grains. The wind carries you from one station to the next. The radio already plays in the browser; it hasn't run on a norns yet.",
    links: [
      { label: "play in the browser", url: "https://pollen.glassgarden.cc/" },
      { label: "view code", url: "https://github.com/glassgarden/pollen" },
      { label: "manual", url: "https://github.com/glassgarden/pollen/blob/main/doc/MANUAL.md" },
    ],
    license: "GPL-3.0",
    credits:
      'Stations from <a href="https://www.radio-browser.info">radio-browser.info</a>. The reverb can be MiVerb, from Mutable Instruments Clouds and Rings, through <a href="https://github.com/v7b1/mi-UGens">mi-UGens</a>.',
    changes: [
      { date: "2026-11", text: "0.2: the radio plays, the wind moves between stations, and the reel scatters them as grains." },
    ],
    audio: null,
    seed: 3141,
  },
];
