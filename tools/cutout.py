"""Remove the background from character art and save a trimmed transparent PNG sprite.

Usage: .venv\\Scripts\\python.exe tools\\cutout.py <input image> <output.png>
Uses rembg's anime-specific segmentation model (downloaded on first run).
"""
import sys

from PIL import Image
from rembg import new_session, remove

src, dst = sys.argv[1], sys.argv[2]
session = new_session("isnet-anime")
img = Image.open(src).convert("RGB")
cut = remove(img, session=session, alpha_matting=True, alpha_matting_erode_size=8)
cut = cut.crop(cut.getbbox())  # trim empty margins so sprites scale consistently
cut.save(dst, optimize=True)
print(dst, cut.size)
