"""Put the variants of each character side by side for picking.

Usage: .venv\\Scripts\\python.exe tools\\contact_sheet.py art-source\\pixai yuki kotone hayama
Writes art-source/pixai/<name>_sheet.png
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

src = Path(sys.argv[1])
for name in sys.argv[2:]:
    files = sorted(src.glob(f"{name}_[0-9].webp"))
    thumbs = [Image.open(f).convert("RGB") for f in files]
    h = 700
    thumbs = [t.resize((int(t.width * h / t.height), h)) for t in thumbs]
    sheet = Image.new("RGB", (sum(t.width for t in thumbs), h), "white")
    x = 0
    draw = ImageDraw.Draw(sheet)
    for i, t in enumerate(thumbs, 1):
        sheet.paste(t, (x, 0))
        draw.text((x + 10, 10), str(i), fill="red", font_size=48)
        x += t.width
    sheet.save(src / f"{name}_sheet.png")
    print(name, len(thumbs), sheet.size)
