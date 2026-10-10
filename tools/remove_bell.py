"""Paint out the silver bell charm on Kotone's apron string, for scenes after she loses it.

Usage: .venv\\Scripts\\python.exe tools\\remove_bell.py <sprite.png> <output.png> [--debug debug.png]
Finds the bell's grey/silver pixels in the lower-left apron area, masks them (plus the dark
outline around them), and fills the hole with OpenCV inpainting. Transparency is kept.
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
debug = sys.argv[sys.argv.index("--debug") + 1] if "--debug" in sys.argv else None

img = cv2.imread(src, cv2.IMREAD_UNCHANGED)  # BGRA
h, w = img.shape[:2]
bgr = img[:, :, :3].astype(np.int16)
alpha = img[:, :, 3]

# Search window: the apron string hangs at the left of her waist.
x0, x1, y0, y1 = int(w * 0.18), int(w * 0.45), int(h * 0.64), int(h * 0.82)
win = bgr[y0:y1, x0:x1]
b, g, r = win[..., 0], win[..., 1], win[..., 2]
spread = np.max(win, axis=2) - np.min(win, axis=2)
bright = win.mean(axis=2)
# Silver metal: low saturation and clearly lighter than the dark brown apron.
silver = (spread < 28) & (bright > 70) & (b >= r - 6) & (alpha[y0:y1, x0:x1] > 200)  # skin is warmer (r >> b)

mask = np.zeros((h, w), np.uint8)
mask[y0:y1, x0:x1][silver] = 255
# Keep only the largest blob (the bell + ring), drop stray grey pixels.
n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
if n <= 1:
    sys.exit(f"no bell found in {src}")
# Merge blobs close to the largest one (bell body, ring and highlights are separate blobs).
big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
bx, by, bw, bh = stats[big, :4]
keep = np.zeros_like(mask)
for k in range(1, n):
    x, y, ww, hh, area = stats[k]
    if area >= 6 and x < bx + bw + 25 and x + ww > bx - 25 and y < by + bh + 40 and y + hh > by - 60:
        keep[labels == k] = 255
ys, xs = np.nonzero(keep)
# The strict colour test finds the bell body; the ring and string loop sit above it.
cx = int((xs.min() + xs.max()) / 2)
rx0, rx1 = cx - 40, cx + 40
ry0, ry1 = ys.min() - 82, ys.max() + 44
hole = np.zeros_like(mask)
cv2.ellipse(hole, ((cx, int((ry0 + ry1) / 2)), (rx1 - rx0, int(ry1 - ry0)), 0), 255, -1)
full = img[:, :, :3].astype(np.int16)
skin = (full[..., 2] - full[..., 0] > 35) & (full.mean(axis=2) > 120)  # her hands: never paint over them
hole[(alpha <= 200) | skin] = 0

out = img.copy()
out[:, :, :3] = cv2.inpaint(img[:, :, :3], hole, 9, cv2.INPAINT_TELEA)
cv2.imwrite(dst, out)
print(dst, "filled", int(hole.sum() / 255), "px at", (int(rx0), int(ry0), int(rx1), int(ry1)))

if debug:
    crop = (slice(max(0, ry0 - 120), ry1 + 120), slice(max(0, rx0 - 120), rx1 + 120))
    before = img[crop][:, :, :3]
    after = out[crop][:, :, :3]
    cv2.imwrite(debug, np.hstack([before, after]))
