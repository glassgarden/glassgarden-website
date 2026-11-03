/* Notes, newest first: the field journal.
   slug: the #anchor for links, unique and stable. A date plus a few words works well.
   date: YYYY-MM-DD.  tag: optional single word, such as "field", "patch", "gear" or "release".
   body: paragraphs, as plain text or simple HTML for links and emphasis.
   photo: optional, at most one per note. Grade it first with brand/generator/grade.py (always 4:5), then
     { src: "/assets/img/photos/name.webp", alt: "what is in the photo, plainly", caption: "where and when" }
   links: optional, shown under the text. The first one is the main one (amber).
     [{ label: "the rack on modulargrid", url: "https://www.modulargrid.net/e/racks/view/..." }]
   draft: true keeps a note off the site until it's ready. Drafts are still in this public file, so
     write nothing here you wouldn't publish. */
window.NOTES = [
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
