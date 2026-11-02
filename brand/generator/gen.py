"""glassgarden pixel identity generator: mark, wordmark, lockup, avatar, banner."""
import random, os, sys
from PIL import Image, ImageColor

OUT = sys.argv[1]
LOGOS = os.path.join(OUT, "assets/Logos")
SOCIAL = os.path.join(OUT, "assets/Social")

# palette (Terrarium night + moss)
P_NIGHT = {
    "o": "#c9d0ca",  # glass outline
    "O": "#7d857f",  # glass shade (lower/right edge)
    "h": "#f4f5f1",  # glass highlight
    "g": "#1d221f",  # glass interior tint
    "l": "#a3aca5",  # lid
    "L": "#525a54",  # lid shade
    "s": "#3a2f1a",  # soil
    "S": "#2a2215",  # soil dark
    "m": "#7fa06a",  # moss
    "M": "#a9c98d",  # moss light
    "a": "#d9a441",  # amber
    "A": "#f0c96e",  # honey
    "d": "#9a6b16",  # deep amber
}
P_DAY = dict(P_NIGHT, o="#525a54", O="#7d857f", h="#ffffff", g="#dfe3dc",
             l="#7d857f", L="#525a54", m="#4f6b44", M="#6f8f5a", a="#b07a17", A="#d9a441")
NIGHT_BG, WELL = "#121513", "#050706"
INK_N, INK_D = "#e3e6e1", "#1b1f1c"


def blank(w, h):
    return [["." for _ in range(w)] for _ in range(h)]


def jar(w, h, neck_w, lid_h=2, seed=1, plants=3, glow=3, radius=3):
    """Return grid (h rows, w cols) of a pixel terrarium jar."""
    rng = random.Random(seed)
    G = blank(w, h)
    nl = (w - neck_w) // 2
    nr = nl + neck_w - 1
    body_top = lid_h + 3
    def in_body(x, y):
        if y < body_top or y > h - 1 or x < 0 or x > w - 1:
            return False
        r = radius
        for cx, cy in ((r, body_top + r), (w - 1 - r, body_top + r), (r, h - 1 - r), (w - 1 - r, h - 1 - r)):
            if (x < r and cx == r or x > w - 1 - r and cx == w - 1 - r) and \
               (y < body_top + r and cy == body_top + r or y > h - 1 - r and cy == h - 1 - r):
                if (x - cx) ** 2 + (y - cy) ** 2 > r * r + 1:
                    return False
        return True
    def in_neck(x, y):
        return lid_h <= y <= body_top and nl <= x <= nr
    def inside(x, y):
        return in_body(x, y) or in_neck(x, y)
    for y in range(h):
        for x in range(w):
            if inside(x, y):
                edge = any(not inside(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                if edge:
                    G[y][x] = "O" if (y >= h - 2 or x >= w - 2) else "o"
                else:
                    G[y][x] = "g"
    # lid
    for y in range(lid_h):
        for x in range(nl - 1, nr + 2):
            G[y][x] = "L" if y == lid_h - 1 else "l"
    # soil
    soil_top = h - 1 - max(2, h // 7)
    for y in range(soil_top, h - 1):
        for x in range(w):
            if G[y][x] == "g":
                G[y][x] = "S" if y == h - 2 else "s"
    for x in range(w):
        if G[soil_top - 1][x] == "g" and rng.random() < 0.35:
            G[soil_top - 1][x] = "s"
    # plants: varied species, spaced apart
    inner = [x for x in range(w) if G[soil_top - 1][x] in "gs"][2:-2]
    xs = []
    for x in rng.sample(inner, len(inner)):
        if all(abs(x - o) >= 4 for o in xs):
            xs.append(x)
        if len(xs) >= plants:
            break
    kinds = ["stalk", "sprout", "bush", "fern"]
    rng.shuffle(kinds)
    room = soil_top - body_top - 2
    def put(x, y, c):
        if 0 <= y < h and 0 <= x < w and G[y][x] in "gs":
            G[y][x] = c
    for i, px in enumerate(sorted(xs)):
        kind = kinds[i % len(kinds)]
        if kind == "stalk":
            top = soil_top - max(4, int(room * rng.uniform(0.75, 0.95)))
            for y in range(top, soil_top):
                put(px, y, "m")
            side = rng.choice((-1, 1))
            for y in range(top + 2, soil_top - 1, 3):
                put(px + side, y, "M"); side = -side
            put(px, top - 1, "M")
        elif kind == "sprout":
            top = soil_top - max(3, int(room * rng.uniform(0.3, 0.45)))
            for y in range(top, soil_top):
                put(px, y, "m")
            put(px - 1, top, "M"); put(px + 1, top, "M"); put(px - 1, top - 1, "M"); put(px + 1, top - 1, "M")
        elif kind == "bush":
            ht = max(3, int(room * rng.uniform(0.35, 0.55)))
            cy = soil_top - ht // 2 - 1
            for y in range(soil_top - ht, soil_top):
                for dx in range(-2, 3):
                    if abs(dx) + abs(y - cy) * 0.8 <= 2.6:
                        put(px + dx, y, "M" if (dx + y) % 3 == 0 else "m")
        else:  # fern: curled tip
            top = soil_top - max(4, int(room * rng.uniform(0.55, 0.7)))
            for y in range(top + 1, soil_top):
                put(px, y, "m")
            put(px + 1, top, "m"); put(px + 2, top + 1, "M"); put(px + 1, top + 2, "M")
            for y in range(top + 3, soil_top - 1, 2):
                put(px - 1, y, "M")
    # highlight streak on the glass
    for y in range(body_top + 2, body_top + 2 + (soil_top - body_top) // 2):
        if G[y][2] == "g":
            G[y][2] = "h"
    # amber glow inside
    cells = [(x, y) for y in range(body_top + 1, soil_top - 2) for x in range(2, w - 2) if G[y][x] == "g"]
    for (x, y) in rng.sample(cells, min(glow, len(cells))):
        G[y][x] = rng.choice("aAd")
    return G


def mark_grid():
    """32x32 mark: jar with pollen escaping above the lid."""
    G = blank(32, 32)
    J = jar(20, 24, 10, lid_h=2, seed=5, plants=3, glow=4, radius=3)
    paste(G, J, 6, 7)
    for (x, y, c) in ((15, 4, "a"), (12, 2, "A"), (19, 1, "d"), (17, 0, "A"), (21, 4, "a")):
        G[y][x] = c
    return G


def paste(G, J, ox, oy):
    for y, row in enumerate(J):
        for x, c in enumerate(row):
            if c != "." and 0 <= oy + y < len(G) and 0 <= ox + x < len(G[0]):
                G[oy + y][ox + x] = c


# ---- pixel font (lowercase, x-height 5, asc 2, desc 2) ----
FONT = {
    "g": ["....", "....", ".###", "#..#", "#..#", "#..#", ".###", "...#", "###."],
    "l": ["#.", "#.", "#.", "#.", "#.", "#.", ".#", "..", ".."],
    "a": ["....", "....", ".##.", "...#", ".###", "#..#", ".###", "....", "...."],
    "s": ["....", "....", ".###", "#...", ".##.", "...#", "###.", "....", "...."],
    "r": ["...", "...", "#.#", "##.", "#..", "#..", "#..", "...", "..."],
    "d": ["...#", "...#", ".###", "#..#", "#..#", "#..#", ".###", "....", "...."],
    "e": ["....", "....", ".##.", "#..#", "####", "#...", ".###", "....", "...."],
    "n": ["....", "....", "###.", "#..#", "#..#", "#..#", "#..#", "....", "...."],
}


def word_grid(text, ch="w"):
    glyphs = [[r.ljust(len(max(FONT[c], key=len)), ".") for r in FONT[c]] for c in text]
    width = sum(len(g[0]) for g in glyphs) + len(glyphs) - 1
    G = blank(width, 9)
    x = 0
    for g in glyphs:
        for y, row in enumerate(g):
            for i, c in enumerate(row):
                if c == "#":
                    G[y][x + i] = ch
        x += len(g[0]) + 1
    return G


def to_svg(G, pal, path, px=1, bg=None, title="glassgarden"):
    h, w = len(G), len(G[0])
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*px}" height="{h*px}" shape-rendering="crispEdges"><title>{title}</title>']
    if bg:
        parts.append(f'<rect width="{w}" height="{h}" fill="{bg}"/>')
    for y in range(h):
        x = 0
        while x < w:
            c = G[y][x]
            if c == ".":
                x += 1
                continue
            run = 1
            while x + run < w and G[y][x + run] == c:
                run += 1
            parts.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{pal[c]}"/>')
            x += run
    parts.append("</svg>")
    open(path, "w").write("".join(parts))


def to_img(G, pal, scale, bg=None):
    h, w = len(G), len(G[0])
    im = Image.new("RGBA", (w, h), ImageColor.getrgb(bg) + (255,) if bg else (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            c = G[y][x]
            if c != ".":
                im.putpixel((x, y), ImageColor.getrgb(pal[c]) + (255,))
    return im.resize((w * scale, h * scale), Image.NEAREST)


def lockup(word_ch_color):
    M = mark_grid()
    W = word_grid("glassgarden")
    gap = 4
    G = blank(32 + gap + len(W[0]), 32)
    paste(G, M, 0, 0)
    paste(G, W, 32 + gap, 13)
    return G


def banner():
    rng = random.Random(42)
    W, H = 240, 48
    G = blank(W, H)
    ground = 40
    # stars
    for _ in range(46):
        x, y = rng.randrange(W), rng.randrange(0, ground - 6)
        G[y][x] = rng.choice("OOOl")
    # ground line + grass + reflections (like the r/norns banner)
    for x in range(W):
        G[ground][x] = "O"
        if rng.random() < 0.18:
            G[ground - 1][x] = "O"
    for y, step in ((42, 0), (43, 9)):
        x = step
        while x < W:
            ln = rng.randint(6, 18)
            for i in range(ln):
                if x + i < W:
                    G[y][x + i] = "L"
            x += ln + rng.randint(8, 22)
    # jars sitting on the ground
    specs = [(12, 16, 22, 8, 3, 2), (32, 12, 15, 6, 9, 2), (190, 13, 18, 7, 5, 2), (208, 20, 28, 10, 11, 4)]
    for ox, w, h, neck, seed, gl in specs:
        J = jar(w, h, neck, lid_h=2, seed=seed, plants=3 if w > 13 else 2, glow=gl, radius=2 if w < 16 else 3)
        paste(G, J, ox, ground - h)
        for k in range(rng.randint(2, 4)):
            px, py = ox + w // 2 + rng.randint(-4, 4), ground - h - 2 - rng.randint(0, 10)
            if 0 <= py < H:
                G[py][px] = rng.choice("aAd")
    # wordmark centered, scale 2
    Wd = word_grid("glassgarden", "w")
    sx = (W - len(Wd[0]) * 2) // 2
    sy = 14
    for y, row in enumerate(Wd):
        for x, c in enumerate(row):
            if c == "w":
                for dy in range(2):
                    for dx in range(2):
                        G[sy + y * 2 + dy][sx + x * 2 + dx] = "w"
    # small amber underline glow like the norns screen wave
    return G


if __name__ == "__main__":
    pal_n = dict(P_NIGHT, w=INK_N)
    pal_d = dict(P_DAY, w=INK_D)
    M = mark_grid()
    to_svg(M, pal_n, f"{LOGOS}/glassgarden-mark.svg", px=8)
    to_svg(M, pal_d, f"{LOGOS}/glassgarden-mark-day.svg", px=8)
    Wd = word_grid("glassgarden")
    to_svg(Wd, pal_n, f"{LOGOS}/glassgarden-wordmark.svg", px=8)
    to_svg(Wd, pal_d, f"{LOGOS}/glassgarden-wordmark-day.svg", px=8)
    L = lockup("w")
    to_svg(L, pal_n, f"{LOGOS}/glassgarden-lockup.svg", px=8)
    to_svg(L, pal_d, f"{LOGOS}/glassgarden-lockup-day.svg", px=8)
    # avatar: mark centered on night, 512px (32 grid * 16)
    av = blank(32, 32)
    paste(av, M, 0, 0)
    to_img(av, pal_n, 16, bg=NIGHT_BG).convert("RGB").save(f"{SOCIAL}/glassgarden-avatar-512.png")
    B = banner()
    to_img(B, pal_n, 8, bg=NIGHT_BG).convert("RGB").save(f"{SOCIAL}/glassgarden-banner-1920x384.png")
    print("ok")
