/* Notes, newest first: the field journal.
   slug: the #anchor for links, unique and stable. A date plus a few words works well.
   date: YYYY-MM-DD.  tag: optional single word, such as "field", "patch", "gear" or "release".
   body: paragraphs, as plain text or simple HTML for links and emphasis.
   photo: optional, at most one per note. Grade it first with brand/generator/grade.py (always 4:5), then
     { src: "/assets/img/photos/name.webp", alt: "what is in the photo, plainly", caption: "where and when" }
   links: optional, shown under the text. The first one is the main one (amber).
     [{ label: "the rack on modulargrid", url: "https://www.modulargrid.net/e/racks/view/..." }]
   widget: optional, an interactive piece shown after the body: "isokey" (the playable grid).
   after: optional, more paragraphs shown under the widget.
   draft: true keeps a note off the site until it's ready. Drafts are still in this public file, so
     write nothing here you wouldn't publish. */
window.NOTES = [
  {
    slug: "2026-11-isokey",
    date: "2026-11-26",
    title: "a keyboard with no wrong shapes",
    tag: "release",
    body: [
      "On a piano, every key changes the shapes. C major and D major are different under your hand, and so is every chord that comes after them. isokey turns the grid into a keyboard where that doesn't happen.",
      "Each key to the right is one step higher. Each row up is a fourth, five semitones, the way a bass guitar is tuned. So a major triad is the same three keys anywhere on the grid, and so is a scale run, a fifth or an octave. Learn a shape once and you can play it in any key, starting from any key.",
      "Try it below. The brightest keys are sounding, the bright ones are the root, the dim ones are in the scale. Switch the mode to <em>in key</em> and every note outside the scale disappears: nothing you press can be wrong, which is a good place to be when you're improvising over something slow.",
    ],
    widget: "isokey",
    after: [
      "On the grid it plays any MIDI synth, over USB or from parterre's TRS jack. There are sixteen scales, chords built from the scale on each key, a sustain you can latch with a double tap, pitch bend, and a humanize setting that varies each note's velocity a little, because a grid can't tell how hard you press.",
      "I wrote it on <a href=\"https://vfmod.com/parterre/\">parterre</a>, the iii firmware I run on a FREEPOET Open Grid, and tried it out playing an M-Vave FM1. It uses only the standard iii API, so it should run on monome's own grids with iii too. Some of the best ideas, like the control row on top and the double-tap sustain, come from nolliegray's <a href=\"https://github.com/nolliegray/tropiii\">tropiii</a>.",
    ],
    links: [
      { label: "get isokey", url: "https://github.com/glassgarden/iii-scripts/tree/main/isokey" },
      { label: "the manual", url: "https://github.com/glassgarden/iii-scripts/blob/main/isokey/Readme.md" },
      { label: "upload it with greenhouse", url: "https://greenhouse.vfmod.com/" },
    ],
  },
  {
    slug: "2026-11-pollen",
    date: "2026-11-25",
    title: "what the wind carries",
    tag: "growing",
    body: [
      "Pollen grains and radio waves travel the same way. Both cross the planet through the sky and land far from where they started. pollen, the next norns script, is built on that.",
      "It tunes into live radio stations around the world, thousands of them, from radio-browser.info. A wind carries you from one to the next. It can stay close, a city or two away, or cross an ocean. A breeze hops off in any direction, a trade wind keeps one heading, a gust goes anywhere at all.",
      "Whatever station you land on gets caught on a reel, a loop of tape the radio keeps recording onto, and the reel is scattered back out as grains. Close to the recording head you hear the station almost live. Further back, the grains reach into what was caught seconds ago, and the voice of a news reader somewhere becomes a slow, warm cloud.",
      "Every part has two macros, a gesture and a variety, so you play it with your hands and not with menus: hold the haze, send a burst of grains, drift to the next station when the one you're on runs out of interest.",
      "It is version 0.2. The radio plays, the wind moves and the reel scatters, and you can try all of it <a href=\"https://pollen.glassgarden.cc/\">in your browser</a>, which runs the real script. It hasn't run on a norns yet; that is next, then a view of the globe and a vault for keeping the seeds you like. Its progress is in the <a href=\"/garden.html#growing\">garden</a>.",
    ],
    links: [
      { label: "play pollen in the browser", url: "https://pollen.glassgarden.cc/" },
      { label: "the manual", url: "https://github.com/glassgarden/pollen/blob/main/doc/MANUAL.md" },
      { label: "view code", url: "https://github.com/glassgarden/pollen" },
    ],
  },
  {
    slug: "2026-11-outside",
    date: "2026-11-03",
    title: "outside",
    tag: "patch",
    body: [
      "Not every piece needs the case. Sometimes it's two small synths, one coiled cable and a table outside.",
      "With so few parts, every knob matters more.",
    ],
    photo: {
      src: "/assets/img/photos/outside-patch.webp",
      alt: "Two small synthesizers on a wooden table outdoors, joined by a coiled red cable, with trees and grass behind.",
      caption: "a patch outside, december 2024",
    },
  },
  {
    slug: "2026-11-modular",
    date: "2026-11-02",
    title: "the modular",
    tag: "gear",
    draft: false,
    body: [
      "Modular is where you find out how small musical bricks fit together to build something bigger. Each module does one thing. One keeps time, one makes a sound, one shapes it, one listens to another and changes what it does. Most make no music on their own.",
      "Most glassgarden pieces start here. Clockforge keeps a slow pulse. Chaos decides when a note happens and which one, and the quantizer keeps it in key. Plaits and nanoRings are the voices, Rampage gives them their shape, and Monsoon breaks everything into a cloud of small grains.",
      "Once it's patched, my part is mostly listening, and turning a knob when something interesting starts to happen.",
    ],
    photo: {
      src: "/assets/img/photos/modular.webp",
      alt: "Close up of eurorack modules in the dark, with small red, pink and green lights glowing between the knobs.",
      caption: "the case, march 2026",
    },
    links: [
      {
        label: "the rack on modulargrid",
        url: "https://modulargrid.net/e/racks/view/2855267",
      },
    ],
  },
  {
    slug: "2026-11-desert",
    date: "2026-11-02",
    title: "the other scale",
    tag: "field",
    draft: false,
    body: [
      "The vastness of Death Valley shows how tiny we are on this planet.",
      "Everything in glassgarden happens at the other end of that scale: small closed worlds you could hold in one hand, a jar on a shelf, a few modules in a wooden case.",
      "Maybe that's why I like both. Out there, nothing is arranged and nothing is in a hurry. The land keeps changing, slowly, by its own rules. The pieces I make try to work the same way, only much smaller.",
    ],
    photo: {
      src: "/assets/img/photos/desert.webp",
      alt: "Seen from behind, a person stands on a pale rock ridge looking out over folded desert hills under a clear sky.",
      caption: "death valley",
    },
  },
  {
    slug: "2026-10-31-first-seed",
    date: "2026-10-31",
    title: "planting the first seed",
    tag: "field",
    body: [
      "This is where glassgarden starts. The name comes from the idea behind every piece here: a small closed world that keeps itself going once you seal the lid.",
      'The first release, <a href="/releases.html#terrarium">terrarium</a>, is already out and plays in your browser. Pollen is still growing.',
    ],
  },
];
