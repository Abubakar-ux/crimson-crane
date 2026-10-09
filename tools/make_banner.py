"""Compose the README banner and cast sheet from the game's own art.

Usage: .venv\\Scripts\\python.exe tools\\make_banner.py
Writes docs/images/banner.png and docs/images/cast.png
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "images"
OUT.mkdir(parents=True, exist_ok=True)
SPR = ROOT / "public" / "sprites"


def font(size: int) -> ImageFont.FreeTypeFont:
    for name in ("impact.ttf", "arialbd.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def sprite(name: str, height: int) -> Image.Image:
    im = Image.open(SPR / f"{name}.png").convert("RGBA")
    return im.resize((int(im.width * height / im.height), height), Image.LANCZOS)


# --- banner: bridge at night, cast silhouetted in front, title on the left ---
W, H = 1600, 640
bg = Image.open(ROOT / "public" / "backgrounds" / "bridge_night.webp").convert("RGB")
bg = bg.resize((W, int(bg.height * W / bg.width))).crop((0, 80, W, 80 + H))
bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(2))).enhance(0.55).convert("RGBA")

shade = Image.new("RGBA", (W, H))
d = ImageDraw.Draw(shade)
for x in range(W):  # dark fade on the left so the title reads
    a = int(235 * max(0, 1 - x / 900))
    d.line([(x, 0), (x, H)], fill=(8, 6, 12, a))
bg.alpha_composite(shade)

cast = [("aya_smug", 520), ("mikami_neutral", 560), ("hayama_neutral", 600), ("kotone_neutral", 560), ("yuki_neutral", 540)]
x = 640
for name, h in cast:
    s = sprite(name, h)
    bg.alpha_composite(s, (x, H - h + 40))
    x += int(s.width * 0.62)

d = ImageDraw.Draw(bg)
d.text((70, 150), "A MIZUNAGI MURDER MYSTERY", font=font(30), fill=(255, 46, 99))
d.text((76, 196), "CRIMSON", font=font(150), fill=(140, 20, 50))
d.text((66, 186), "CRIMSON", font=font(150), fill=(244, 241, 234))
d.text((76, 346), "CRANE", font=font(150), fill=(0, 0, 0))
d.text((66, 336), "CRANE", font=font(150), fill=(255, 46, 99))
d.text((72, 520), "Anime detective visual novel  ·  AI-driven interrogations", font=font(28), fill=(200, 195, 190))
bg.convert("RGB").save(OUT / "banner.png", optimize=True)

# --- cast sheet: every character's neutral pose on dark ---
names = [("ren_neutral", "REN"), ("hayama_neutral", "HAYAMA"), ("mikami_neutral", "MIKAMI"),
         ("yuki_neutral", "YUKI"), ("kotone_neutral", "KOTONE"), ("aya_neutral", "AYA")]
h = 520
tiles = [sprite(n, h) for n, _ in names]
sheet = Image.new("RGBA", (sum(t.width for t in tiles) + 40 * (len(tiles) + 1), h + 110), (14, 12, 20, 255))
d = ImageDraw.Draw(sheet)
x = 40
for t, (_, label) in zip(tiles, names):
    sheet.alpha_composite(t, (x, 30))
    d.text((x + t.width // 2, h + 60), label, font=font(36), fill=(255, 46, 99), anchor="mm")
    x += t.width + 40
sheet.convert("RGB").save(OUT / "cast.png", optimize=True)
print("wrote", OUT / "banner.png", OUT / "cast.png")
