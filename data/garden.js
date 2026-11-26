/* The garden: everything in the works, by stage. Shown on garden.html.
   tended: the date you last went through this list (YYYY-MM-DD), shown at the top of the page.
   stage: "seed" (an idea), "sprouting" (first code, not played yet), "growing" (it plays, still
     being shaped), "bloom" (out), "resting" (set aside for now).
   home: "vfm" for the instruments that come out as Voltage Foundry Modular; leave it out otherwise.
   href: optional, where the title links (a release, a note, a project page).
   links: optional, like releases: the first one is the main one.
   checklist: optional, what's done and what's next: [{ text: "...", done: true }]
   Order inside a stage is the order on the page. */
window.GARDEN = {
  tended: "2026-11-26",
  items: [
    {
      title: "pollen",
      stage: "growing",
      kind: "norns script",
      href: "/releases.html#pollen",
      summary:
        "The world's radio, carried on the wind and scattered as grains. The radio plays in the browser; next it has to meet a real norns.",
      links: [
        { label: "play in the browser", url: "https://pollen.glassgarden.cc/" },
        { label: "view code", url: "https://github.com/glassgarden/pollen" },
      ],
      checklist: [
        { text: "stations from around the world", done: true },
        { text: "the wind between them", done: true },
        { text: "the reel, scattered as grains", done: true },
        { text: "plays in the browser", done: true },
        { text: "first run on a norns", done: false },
        { text: "the globe view", done: false },
        { text: "the seed vault", done: false },
      ],
    },
    {
      title: "trellis",
      stage: "growing",
      kind: "iii script for achene",
      home: "vfm",
      summary:
        "Turns achene into a controller you set up on the device itself: eight banks of eight encoders and keys, no computer needed. Next, the sixteen lit keys become a step sequencer.",
      links: [
        { label: "manual", url: "https://github.com/VoltageFoundryMod/achene/blob/main/docs/manual/Trellis.md" },
      ],
      checklist: [
        { text: "banks, slots and presets", done: true },
        { text: "manual and cheat sheet", done: true },
        { text: "step sequencer on the keys", done: false },
        { text: "notes mode", done: false },
        { text: "performance page with mutes", done: false },
      ],
    },
    {
      title: "parterre",
      stage: "growing",
      kind: "grid firmware",
      home: "vfm",
      summary:
        "monome's iii on FREEPOET's Open Grid kit, so Lua scripts play on the grid itself. It also plays norns as a regular grid, and sends MIDI over USB and a TRS jack. isokey was written on it.",
      links: [
        { label: "vfmod.com/parterre", url: "https://vfmod.com/parterre/" },
        { label: "view code", url: "https://github.com/VoltageFoundryMod/parterre" },
      ],
      checklist: [
        { text: "iii scripts on the Open Grid", done: true },
        { text: "USB and TRS MIDI out", done: true },
        { text: "plays norns as a grid", done: true },
        { text: "backups and updates from greenhouse", done: true },
        { text: "builds for monome's own grids", done: false },
      ],
    },
    {
      title: "achene",
      stage: "growing",
      kind: "MIDI controller",
      home: "vfm",
      summary:
        "A performance MIDI controller you program: twelve encoders, sixteen lit keys and a small screen, running iii Lua scripts with no computer attached.",
      links: [{ label: "vfmod.com/achene", url: "https://vfmod.com/achene/" }],
    },
    {
      title: "fx_miUGens",
      stage: "growing",
      kind: "norns fx mod",
      summary:
        "Seven Mutable Instruments effects for the norns fx mod, from a granular cloud to a lush reverb, on send A, send B or the insert, under any script.",
      links: [{ label: "view code", url: "https://github.com/glassgarden/fx_miUGens" }],
    },
    {
      title: "op-xy",
      stage: "sprouting",
      kind: "iii script for grids",
      summary:
        "Hands-on control of the OP-XY from the grid: mixer, sends, synth, envelopes, LFO and scenes, over MIDI CCs. Written, not yet tried on the hardware.",
      links: [{ label: "view code", url: "https://github.com/glassgarden/iii-scripts/tree/main/op-xy" }],
    },
    {
      title: "DAW control for achene",
      stage: "seed",
      kind: "iii scripts",
      home: "vfm",
      summary: "Mackie-style control for DAWs, and a script made for Ableton Live.",
    },
    {
      title: "isokey",
      stage: "bloom",
      kind: "iii script for grids",
      href: "/releases.html#isokey",
      summary: "The grid as an isomorphic keyboard, in any key.",
      links: [{ label: "try the layout", url: "/notes.html#2026-11-isokey" }],
    },
    {
      title: "terrarium",
      stage: "bloom",
      kind: "norns script",
      href: "/releases.html#terrarium",
      summary: "A small sealed world that keeps itself going. On norns, in the browser, and as a plugin.",
      links: [{ label: "play in the browser", url: "https://terrarium.glassgarden.cc" }],
    },
    {
      title: "greenhouse",
      stage: "bloom",
      kind: "browser tool",
      href: "/releases.html#greenhouse",
      summary: "Live-code, patch and play iii devices from the browser.",
      links: [{ label: "open greenhouse", url: "https://greenhouse.vfmod.com/" }],
    },
    {
      title: "mi-UGens builds",
      stage: "bloom",
      kind: "library",
      summary:
        "Mutable Instruments modules for norns, browsers and native apps, built from Volker Böhm's mi-UGens. terrarium, pollen and fx_miUGens all play through them.",
      links: [{ label: "releases", url: "https://github.com/glassgarden/mi-UGens/releases" }],
    },
  ],
};
