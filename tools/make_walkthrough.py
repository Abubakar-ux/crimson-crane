"""Merge the recorded walkthrough video with a soundtrack rebuilt from the logged audio cues.

Usage: .venv\\Scripts\\python.exe tools\\make_walkthrough.py
Input:  walkthrough/raw.webm, walkthrough/audio_cues.json (from tools/record_walkthrough.mjs)
Output: walkthrough/crimson-crane-chapter1.mp4
"""
import json
import subprocess
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "walkthrough"
PUBLIC = ROOT / "public"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Same balance as the game's default volume settings.
VOL = {"music": 0.6, "ambience": 0.3, "sfx": 0.8}
FADE = 1.2
# Playback speed of the video. Audio is rebuilt at normal speed, so music never sounds sped up.
SPEED = 1.5

data = json.loads((OUT / "audio_cues.json").read_text())
t0, end = data["t0"], data["end"]
total = (end - t0) / 1000 / SPEED


def secs(ms: int) -> float:
    return max(0.0, (ms - t0) / 1000 / SPEED)


# Looping channels: a segment runs from a track's first play until it's paused or replaced.
segments, sfx = [], []
open_loops: dict[str, dict] = {}
for c in data["cues"]:
    src = c["src"]
    channel = "music" if src.startswith("/music/") else "ambience" if src.endswith("rain_loop.mp3") else "sfx"
    if channel == "sfx":
        if c["kind"] == "play":
            sfx.append((src, secs(c["at"])))
        continue
    if c["kind"] == "play":
        if src in open_loops:  # a retry of the same track: ignore
            continue
        if channel == "music":  # a new music track replaces the old one
            for s, seg in list(open_loops.items()):
                if s.startswith("/music/"):
                    seg["end"] = secs(c["at"]) + FADE
                    del open_loops[s]
        seg = {"src": src, "channel": channel, "start": secs(c["at"]), "end": total}
        segments.append(seg)
        open_loops[src] = seg
    elif c["kind"] == "pause" and src in open_loops:
        open_loops.pop(src)["end"] = secs(c["at"])

args = [FFMPEG, "-y", "-i", str(OUT / "raw.webm")]
filters, labels = [], []
for i, seg in enumerate(segments, start=1):
    dur = max(0.5, min(seg["end"], total) - seg["start"])
    args += ["-stream_loop", "-1", "-i", str(PUBLIC / seg["src"].lstrip("/"))]
    delay = int(seg["start"] * 1000)
    filters.append(
        f"[{i}:a]atrim=0:{dur:.2f},asetpts=PTS-STARTPTS,afade=t=in:d={FADE},"
        f"afade=t=out:st={max(0, dur - FADE):.2f}:d={FADE},volume={VOL[seg['channel']]},adelay={delay}|{delay}[a{i}]"
    )
    labels.append(f"[a{i}]")
for j, (src, at) in enumerate(sfx, start=len(segments) + 1):
    args += ["-i", str(PUBLIC / src.lstrip("/"))]
    delay = int(at * 1000)
    filters.append(f"[{j}:a]volume={VOL['sfx']},adelay={delay}|{delay}[a{j}]")
    labels.append(f"[a{j}]")

filters.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{total:.2f},alimiter=limit=0.95[mix]")
filters.append(f"[0:v]setpts=PTS/{SPEED},fps=30[v]")
args += [
    "-filter_complex", ";".join(filters),
    "-map", "[v]", "-map", "[mix]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
    "-t", f"{total:.2f}",
    str(OUT / "crimson-crane-chapter1.mp4"),
]
print(f"{len(segments)} music/ambience segments, {len(sfx)} sound effects, {total:.1f}s")
subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
out = OUT / "crimson-crane-chapter1.mp4"
print(f"wrote {out} ({out.stat().st_size / 1e6:.1f} MB)")
