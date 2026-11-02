"""glassgarden photo grade: one quiet treatment for every photo on the site and on social.

Crops to 4:5, mutes colour, warms a little, applies a gentle curve, then maps the tones so blacks
sit on the page ground (#101211) and whites on ink (#e3e6e1). Writes a new WebP with no metadata,
so camera details and GPS never leave the original.

Usage: python grade.py <src> <dst.webp> [--focus X,Y] [--zoom Z] [--width W] [--night]
  --focus  where the crop centres, as fractions of the photo (default 0.5,0.5)
  --zoom   crop width as a fraction of the widest 4:5 crop (default 1, smaller is tighter)
  --night  for instruments in the dark: deeper shadows, and small bright lights (LEDs, screens)
           keep their colour while everything else stays muted
Needs Pillow. Keep the originals outside the site folder.
"""
import argparse
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps

GROUND = (0x10, 0x12, 0x11)
INK = (0xe3, 0xe6, 0xe1)
WARMTH = (1.03, 1.0, 0.94)
SATURATION = 0.55
RATIO = 4 / 5


def crop(im, fx, fy, zoom):
    w, h = im.size
    cw = min(w, h * RATIO) * zoom
    ch = cw / RATIO
    x = min(max(fx * w - cw / 2, 0), w - cw)
    y = min(max(fy * h - ch / 2, 0), h - ch)
    return im.crop((round(x), round(y), round(x + cw), round(y + ch)))


def tone(v, channel, night=False):
    """One channel value 0..255 through warmth, curve and the ground-to-ink mapping."""
    a = min(v / 255 * WARMTH[channel], 1.0)
    a = a * a * (3 - 2 * a) * 0.35 + a * 0.65
    if night:
        a = a ** 1.7  # panels sink toward the ground, lights stay bright
    lo, hi = GROUND[channel], INK[channel]
    return round(lo + a * (hi - lo))


def grade(src, dst, fx=0.5, fy=0.5, zoom=1.0, width=1200, night=False):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = crop(im, fx, fy, zoom).resize((width, round(width / RATIO)), Image.LANCZOS)
    muted = ImageEnhance.Color(im).enhance(SATURATION)
    if night:
        # only the brightest, most coloured points keep their colour
        lights = im.convert("HSV").split()
        mask = ImageChops.multiply(lights[1], lights[2]).point(lambda v: 0 if v < 70 else min(255, (v - 70) * 3))
        mask = mask.filter(ImageFilter.GaussianBlur(2))
        im = Image.composite(ImageEnhance.Color(im).enhance(1.15), muted, mask)
    else:
        im = muted
    im = im.point([tone(v, c, night) for c in range(3) for v in range(256)])
    im.save(dst, "WEBP", quality=80, method=6)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="glassgarden photo grade")
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--focus", default="0.5,0.5")
    ap.add_argument("--zoom", type=float, default=1.0)
    ap.add_argument("--width", type=int, default=1200)
    ap.add_argument("--night", action="store_true")
    a = ap.parse_args()
    fx, fy = (float(v) for v in a.focus.split(","))
    grade(a.src, a.dst, fx, fy, a.zoom, a.width, a.night)
