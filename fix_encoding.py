"""Repair text files whose UTF-8 characters were garbled (e.g. "·" shown as "Â·", "→" as "â†’").

Cause: Windows PowerShell 5.1 read UTF-8 files as Windows-1252 and saved them back as UTF-8.
This reverses that. Run it from the website folder:  python fix_encoding.py
It only changes files that contain garbled characters, and prints each one it fixes.
"""
from pathlib import Path

MARKERS = ("Ã", "Â", "â€", "â†", "âœ", "Å")
EXTENSIONS = {".html", ".js", ".css", ".md", ".txt", ".svg"}


def to_original_bytes(text: str) -> bytes:
    out = bytearray()
    for ch in text:
        try:
            out += ch.encode("cp1252")
        except UnicodeEncodeError:
            if ord(ch) < 256:  # bytes 0x81, 0x8D, 0x8F, 0x90, 0x9D have no cp1252 character
                out.append(ord(ch))
            else:
                raise
    return bytes(out)


def repair(path: Path) -> bool:
    raw = path.read_bytes()
    text = raw.decode("utf-8-sig")  # also drops the BOM PowerShell adds
    if not any(m in text for m in MARKERS):
        if raw.startswith(b"\xef\xbb\xbf"):
            path.write_bytes(raw[3:])
        return False
    try:
        fixed = to_original_bytes(text).decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        print(f"SKIPPED (mixed content, fix by hand): {path}")
        return False
    path.write_bytes(fixed.encode("utf-8"))
    return True


root = Path(".")
for path in sorted(root.rglob("*")):
    if ".git" in path.parts or not path.is_file() or path.suffix.lower() not in EXTENSIONS:
        continue
    if repair(path):
        print(f"fixed  {path}")
print("done")
