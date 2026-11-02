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
    slug: "new_diii",
    title: "new diii",
    status: "out",
    year: "2026",
    kind: "a monome grid live-code web editor and controller",
    summary:
      "New diii is a refreshed version of the original Monome diii web controller with virtual grid support, syntax highlighting and many improvements to manage iii devices",
    links: [{ label: "open new diii", url: "https://https://diii.vfmod.com/" }],
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
