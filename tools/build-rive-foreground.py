"""Separate EN hero foregrounds from the single responsive CSS background.

Run after build-rive-us.py and build-rive-elbow-texture.cjs.
Original exports and US image variants stay intact.
Two background image payloads, the local elbow repair and static fill alpha
change. Every timeline, state machine and transform stays unchanged.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('rive_images', ROOT / 'tools/build-rive-us.py')
images = importlib.util.module_from_spec(spec)
spec.loader.exec_module(images)
BACKGROUNDS = {'bg', 'Dark bg'}
ELBOW_REPAIR = ROOT / 'assets/hero/us-en/hands-elbow-repair.webp'


def empty_image():
    # A functional transparent placeholder disables the two image layers. No
    # photograph is edited, stretched, retouched or regenerated.
    def chunk(name, data):
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', zlib.crc32(name + data))
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(b'\x00\x00\x00\x00\x00'))
            + chunk(b'IEND', b''))


def paint_offset(data, parent, alpha):
    # Match the complete static SolidColor record, outside all encoded assets.
    record = b'\x12\x05' + images.write_var(parent) + b'\x25\x28\x28\x28' + bytes([alpha]) + b'\x00'
    start = images.assets(data)[-1]['end']
    assert data[start:].count(record) == 1, 'Unexpected artboard background paint; re-inspect the export'
    return data.index(record, start) + len(record) - 2


def normalized(data, parent, alpha):
    at = paint_offset(data, parent, alpha)
    data = data[:at] + b'\xff' + data[at + 1:]
    pieces, cursor = [], 0
    for asset in images.assets(data):
        if asset['name'] not in BACKGROUNDS | {'hands'}:
            continue
        pieces.append(data[cursor:asset['length_at']])
        cursor = asset['end']
    return b''.join(pieces + [data[cursor:]])


def main():
    report = []
    for stem, parent in [('dietfit-hero', 71), ('dietfit-hero-responsive', 69)]:
        source = ROOT / f'assets/hero/{stem}-us-en.riv'
        output = ROOT / f'assets/hero/{stem}-foreground-us-en.riv'
        before = source.read_bytes()
        after = before
        replaced = []
        assert ELBOW_REPAIR.exists(), 'Build the local elbow texture before packaging'
        for asset in reversed(images.assets(before)):
            if asset['name'] not in BACKGROUNDS | {'hands'}:
                continue
            pixel = ELBOW_REPAIR.read_bytes() if asset['name'] == 'hands' else empty_image()
            after = after[:asset['length_at']] + images.write_var(len(pixel)) + pixel + after[asset['end']:]
            if asset['name'] in BACKGROUNDS:
                replaced.append(asset['name'])
        assert set(replaced) == BACKGROUNDS and len(replaced) == 2
        at = paint_offset(after, parent, 255)
        after = after[:at] + b'\x00' + after[at + 1:]
        assert normalized(before, parent, 255) == normalized(after, parent, 0), 'An unrelated byte changed'
        timeline = b'\x1f\x37\x0aTimeline 1'
        assert before.count(timeline) == after.count(timeline) == 1
        assert before[before.index(timeline):] == after[after.index(timeline):], 'Animation bytes changed'
        output.write_bytes(after)
        report.append(dict(source=source.name, output=output.name,
                           disabledBackgrounds=sorted(replaced), staticArtboardFillAlpha=0,
                           proximalElbowRepair=ELBOW_REPAIR.name,
                           elbowRepairSha256=hashlib.sha256(ELBOW_REPAIR.read_bytes()).hexdigest(),
                           animationSha256=hashlib.sha256(after[after.index(timeline):]).hexdigest(),
                           sourceBytes=len(before), outputBytes=len(after)))
    (ROOT / 'assets/hero/us-en/foreground-manifest.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
