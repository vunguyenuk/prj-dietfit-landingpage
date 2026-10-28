"""Apply the shared Home recording to both maintained About Us pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def update():
    markup = (ROOT / 'content/components/about-deepscan.html').read_text().strip()
    for filename in ['about-us/index.html', 'en/about-us/index.html']:
        page = ROOT / filename
        text = page.read_text()
        pattern = r'(data-dietfit-about-deepscan>).*?</button>'
        text, count = re.subn(pattern, lambda m: m[1] + markup, text, flags=re.S)
        if count != 1:
            raise ValueError('Expected one About Us Deep Scan slot: ' + filename)
        page.write_text(text)


if __name__ == '__main__':
    update()
