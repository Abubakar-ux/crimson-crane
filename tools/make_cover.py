"""Compose the itch.io cover image (630x500) from the game's own art.

Usage: .venv\\Scripts\\python.exe tools\\make_cover.py
Writes release/cover.png
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "release"
OUT.mkdir(exist_ok=True)
W, H = 630, 500
PINK = (255, 46, 99)


def font(size: int) -> ImageFont.FreeTypeFont:
    for name in ("impact.ttf", "arialbd.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


bg = Image.open(ROOT / "public" / "backgrounds" / "bridge_night.webp").convert("RGB")
bg = bg.resize((int(bg.width * H / bg.height), H)).crop((200, 0, 200 + W, H))
bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(1.5))).enhance(0.5).convert("RGBA")

# Yuki (the witness) on the right, Ren in front on the left, both cut off at the waist.
for name, h, x in (("yuki_neutral", 600, 330), ("ren_serious", 640, -40)):
    sp = Image.open(ROOT / "public" / "sprites" / f"{name}.png").convert("RGBA")
    sp = sp.resize((int(sp.width * h / sp.height), h), Image.LANCZOS)
    bg.alpha_composite(sp, (x, H - int(h * 0.82)))

shade = Image.new("RGBA", (W, H))
d = ImageDraw.Draw(shade)
for y in range(H):  # dark band at the bottom for the title
    a = int(235 * max(0, (y - H * 0.5) / (H * 0.5)))
    d.line([(0, y), (W, y)], fill=(8, 6, 12, a))
bg.alpha_composite(shade)

d = ImageDraw.Draw(bg)
d.text((28, 334), "CRIMSON", font=font(92), fill=(244, 240, 232), stroke_width=3, stroke_fill=(0, 0, 0))
d.text((28, 412), "CRANE", font=font(70), fill=PINK, stroke_width=3, stroke_fill=(0, 0, 0))
d.text((300, 446), "A MIZUNAGI MURDER MYSTERY", font=font(20), fill=(220, 214, 205))
bg.convert("RGB").save(OUT / "cover.png", optimize=True)
print(OUT / "cover.png")
