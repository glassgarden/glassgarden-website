/* Releases, newest first.
   status: "out" for published work, "growing" for something still in progress.
   seed: any whole number; each one grows a different jar for the cover.
   links: the first one is the main action. When terrarium moves to this domain,
   change its url below and nothing else needs touching. */
window.RELEASES = [
  {
    slug: "terrarium",
    title: "terrarium",
    status: "out",
    year: "2026",
    kind: "generative norns script · plays in the browser",
    summary:
      "A small sealed world that keeps itself going. Notes grow, overlap and die back on their own, and every visit sounds a little different. Open it, press start, and let it run.",
    links: [
      { label: "open terrarium", url: "https://terrarium.glassgarden.cc" },
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
    summary:
      "Live-code, patch and play iii devices from the browser: a console, an editor that knows each device, live views of the grid and achene, and graft, a patch editor that wires blocks into a script without code. It began as monome's diii.",
    links: [{ label: "open greenhouse", url: "https://greenhouse.vfmod.com/" }],
    audio: null,
    seed: 1651,
  },
  {
    slug: "pollen",
    title: "pollen",
    status: "growing",
    year: "2026",
    kind: "norns script · in progress",
    summary:
      "Live radio from around the globe, caught in a granular cloud and scattered back out. The station drifts as the world turns.",
    links: [],
    audio: null,
    seed: 3141,
  },
];
