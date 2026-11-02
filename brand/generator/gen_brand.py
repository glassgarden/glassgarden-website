"""glassgarden brand kit generator.

Builds two editions from the same pixel jar:
  quiet/  the main identity: dim glass, dark moss, amber light, name set in IBM Plex Mono Light
  pixel/  the original pixel-font edition, kept for niche uses (norns community, stickers, gig visuals)

The quiet edition has two jars: the fine 56x72 jar for large uses (banner, lockup, posters, the site's
hero) and the chunky 32x32 jar in the quiet palette for small ones (avatar, favicon, app icon).

Usage: python gen_brand.py <out_dir> <IBMPlexMono-Light.ttf> [site_img_dir]
Needs Pillow and fontTools, and gen.py (the pixel jar) next to it.
With site_img_dir it also writes the website's favicon, apple touch icon and SVG icon there.
The quiet banner and og image carry outlined type, so their PNGs are exported from the SVGs in a browser.
"""
import os, sys, random
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

sys.argv, _args = sys.argv[:1] + ["unused"], sys.argv
import gen as px  # the pixel jar, font and palettes from the first edition
sys.argv = _args

OUT, FONT = sys.argv[1], sys.argv[2]
SITE = sys.argv[3] if len(sys.argv) > 3 else None

TAGLINE = "generative ambient · grown in small sealed worlds"

QUIET = {"o": "#8d958f", "O": "#596059", "h": "#c9d0ca", "g": "#141715",
         "l": "#7d857f", "L": "#3f4540", "s": "#2e2616", "S": "#221c11",
         "m": "#55704a", "M": "#7d9468", "a": "#d9a441", "A": "#f0c96e", "d": "#9a6b16"}
GROUND, INK, MUTED, AMBER, RULE = "#101211", "#e3e6e1", "#959d96", "#d9a441", "#262b28"
DAY_GROUND, DAY_INK = "#e9ebe6", "#1b1f1c"
QUIET_DAY = dict(QUIET, o="#596059", O="#7d857f", h="#ffffff", g="#dfe3dc", l="#7d857f", L="#3f4540",
                 m="#4f6b44", M="#6f8f5a", a="#b07a17")


def mkdir(*p):
    d = os.path.join(OUT, *p)
    os.makedirs(d, exist_ok=True)
    return d


def write(path, text):
    with open(path, "w", newline="\n") as f:
        f.write(text)


# ---------- compact pixel SVG: one path per colour ----------
def grid_paths(G, pal, ox=0, oy=0):
    by = {}
    for y, row in enumerate(G):
        x = 0
        while x < len(row):
            c = row[x]
            if c == ".":
                x += 1
                continue
            run = 1
            while x + run < len(row) and row[x + run] == c:
                run += 1
            by.setdefault(pal[c], []).append(f"M{ox + x} {oy + y}h{run}v1h-{run}z")
            x += run
    return "".join(f'<path fill="{col}" d="{"".join(d)}"/>' for col, d in by.items())


def pixel_svg(G, pal, path, scale=8, bg=None, title="glassgarden"):
    h, w = len(G), len(G[0])
    bgr = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*scale}" height="{h*scale}" '
           f'shape-rendering="crispEdges"><title>{title}</title>{bgr}{grid_paths(G, pal)}</svg>\n')
    write(path, svg)


def pixel_png(G, pal, path, scale, bg):
    px.to_img(G, pal, scale, bg=bg).convert("RGB").save(path)


# ---------- the quiet jars ----------
def quiet_jar(seed=2718):
    """Fine grid, more plants: for large sizes."""
    rng = random.Random(seed)
    W, H = 56, 72
    G = px.blank(W, H)
    J = px.jar(44, 56, 22, lid_h=3, seed=seed, plants=5, glow=4, radius=6)
    px.paste(G, J, 6, H - 56 - 2)
    lid_x, lid_y = 6 + 22, H - 56 - 2
    for k in range(7):
        x, y = lid_x + rng.randint(-5, 5), lid_y - 2 - rng.randint(0, 12)
        G[y][x] = rng.choice("AAad")
    return G


def small_mark():
    """The chunky 32x32 jar from the pixel edition, drawn in the quiet palette: for small sizes."""
    return px.mark_grid()


# ---------- outlined text from the font ----------
_font = TTFont(FONT)
_gs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
_upm = _font["head"].unitsPerEm


def text_path(text, size, x, y, tracking=0.0):
    """SVG path data for text set at baseline (x, y), size in px."""
    s = size / _upm
    pen = SVGPathPen(_gs, ntos=lambda v: ("%.1f" % v).rstrip("0").rstrip("."))
    cx = 0
    for ch in text:
        gname = _cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, x + cx, y))
        _gs[gname].draw(tp)
        cx += _gs[gname].width * s + tracking * size
    return pen.getCommands(), cx


def wordmark_svg(path, ink, dot, size=96):
    d, w = text_path("glassgarden", size, 0, size * 0.78, tracking=0.02)
    dd, dw = text_path(".", size, w, size * 0.78, tracking=0.02)
    W, H = int(w + dw + 4), int(size * 1.0)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<title>glassgarden</title><path fill="{ink}" d="{d}"/><path fill="{dot}" d="{dd}"/></svg>\n')
    write(path, svg)


def lockup_svg(path, pal, ink, dot, bg=None):
    J = quiet_jar()
    scale = 4  # jar 56x72 grid -> 224x288
    size = 88
    d, w = text_path("glassgarden", size, 0, 0, tracking=0.02)
    dd, dw = text_path(".", size, w, 0, tracking=0.02)
    gap = 48
    W = 56 * scale + gap + int(w + dw) + 8
    H = 72 * scale
    tx, ty = 56 * scale + gap, H * 0.62
    d, _ = text_path("glassgarden", size, tx, ty, tracking=0.02)
    dd, _ = text_path(".", size, tx + w, ty, tracking=0.02)
    bgr = f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else ""
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>glassgarden</title>{bgr}'
           f'<g transform="scale({scale})" shape-rendering="crispEdges">{grid_paths(J, pal)}</g>'
           f'<path fill="{ink}" d="{d}"/><path fill="{dot}" d="{dd}"/></svg>\n')
    write(path, svg)


def name_and_jar_svg(svg_path, W, H, size, tag_size, scale, gap):
    """Wordmark and tagline on the left, fine jar on the right, the group centred: banner and og image."""
    _, w = text_path("glassgarden", size, 0, 0, tracking=0.02)
    _, dw = text_path(".", size, 0, 0, tracking=0.02)
    tx = (W - (w + dw + gap + 56 * scale)) / 2
    ty = H / 2 + size * 0.22
    d, _ = text_path("glassgarden", size, tx, ty, tracking=0.02)
    dd, _ = text_path(".", size, tx + w, ty, tracking=0.02)
    tag, _ = text_path(TAGLINE, tag_size, tx + size * 0.04, ty + tag_size * 2.4, tracking=0.04)
    J = quiet_jar()
    jx, jy = int(tx + w + dw + gap) // scale, (H - 72 * scale) // 2 // scale
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>glassgarden</title>'
           f'<rect width="{W}" height="{H}" fill="{GROUND}"/>'
           f'<g transform="scale({scale})" shape-rendering="crispEdges">{grid_paths(J, QUIET, jx, jy)}'
           f'<path fill="{RULE}" d="M{jx + 2} {jy + 70}h52v1h-52z"/></g>'
           f'<path fill="{INK}" d="{d}"/><path fill="{AMBER}" d="{dd}"/><path fill="{MUTED}" d="{tag}"/></svg>\n')
    write(svg_path, svg)


def quiet_avatar():
    """512 square: the chunky jar at 12x, centred so circular crops keep the whole jar and its pollen."""
    return small_mark(), 12, 64


if __name__ == "__main__":
    q = mkdir("logos", "quiet")
    p = mkdir("logos", "pixel")
    sq = mkdir("social", "quiet")
    sp = mkdir("social", "pixel")

    # quiet edition
    J = quiet_jar()
    pixel_svg(J, QUIET, f"{q}/glassgarden-mark.svg", scale=4)
    pixel_svg(J, QUIET_DAY, f"{q}/glassgarden-mark-day.svg", scale=4)
    S = small_mark()
    pixel_svg(S, QUIET, f"{q}/glassgarden-mark-small.svg")
    pixel_svg(S, QUIET_DAY, f"{q}/glassgarden-mark-small-day.svg")
    wordmark_svg(f"{q}/glassgarden-wordmark.svg", INK, AMBER)
    wordmark_svg(f"{q}/glassgarden-wordmark-day.svg", DAY_INK, "#8a5f12")
    lockup_svg(f"{q}/glassgarden-lockup.svg", QUIET, INK, AMBER)
    lockup_svg(f"{q}/glassgarden-lockup-day.svg", QUIET_DAY, DAY_INK, "#8a5f12")

    A, scale, pad = quiet_avatar()
    write(f"{sq}/glassgarden-avatar.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" shape-rendering="crispEdges">'
          f'<title>glassgarden</title><rect width="512" height="512" fill="{GROUND}"/>'
          f'<g transform="translate({pad} {pad}) scale({scale})">{grid_paths(A, QUIET)}</g></svg>\n')
    av = px.to_img(A, QUIET, scale, bg=GROUND).convert("RGB")
    canvas = px.Image.new("RGB", (512, 512), px.ImageColor.getrgb(GROUND))
    canvas.paste(av, (pad, pad))
    canvas.save(f"{sq}/glassgarden-avatar-512.png")
    name_and_jar_svg(f"{sq}/glassgarden-banner.svg", 1920, 384, 112, 22, 4, 100)
    name_and_jar_svg(f"{sq}/glassgarden-og.svg", 1200, 630, 84, 17, 5, 96)
    # youtube channel art: 2560x1440, everything inside the central 1546x423 that every device shows
    name_and_jar_svg(f"{sq}/glassgarden-youtube.svg", 2560, 1440, 112, 22, 5, 120)

    # the website's icons: chunky quiet jar
    if SITE:
        os.makedirs(SITE, exist_ok=True)
        pixel_svg(S, QUIET, f"{SITE}/glassgarden-mark.svg")
        px.to_img(S, QUIET, 1, bg=GROUND).convert("RGB").save(f"{SITE}/favicon-32.png")
        icon = px.Image.new("RGB", (180, 180), px.ImageColor.getrgb(GROUND))
        icon.paste(px.to_img(S, QUIET, 5, bg=GROUND).convert("RGB"), (10, 10))
        icon.save(f"{SITE}/apple-touch-icon.png")

    # pixel edition (unchanged artwork, compact SVGs)
    pn, pd = dict(px.P_NIGHT, w=px.INK_N), dict(px.P_DAY, w=px.INK_D)
    M = px.mark_grid()
    pixel_svg(M, pn, f"{p}/glassgarden-mark.svg")
    pixel_svg(M, pd, f"{p}/glassgarden-mark-day.svg")
    Wd = px.word_grid("glassgarden")
    pixel_svg(Wd, pn, f"{p}/glassgarden-wordmark.svg")
    pixel_svg(Wd, pd, f"{p}/glassgarden-wordmark-day.svg")
    L = px.lockup("w")
    pixel_svg(L, pn, f"{p}/glassgarden-lockup.svg")
    pixel_svg(L, pd, f"{p}/glassgarden-lockup-day.svg")
    av = px.blank(32, 32); px.paste(av, M, 0, 0)
    pixel_svg(av, pn, f"{sp}/glassgarden-avatar.svg", scale=16, bg=px.NIGHT_BG)
    pixel_png(av, pn, f"{sp}/glassgarden-avatar-512.png", 16, px.NIGHT_BG)
    B = px.banner()
    pixel_svg(B, pn, f"{sp}/glassgarden-banner.svg", scale=8, bg=px.NIGHT_BG)
    pixel_png(B, pn, f"{sp}/glassgarden-banner-1920x384.png", 8, px.NIGHT_BG)
    print("ok")
