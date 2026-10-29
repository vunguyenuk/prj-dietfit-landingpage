"""Reuse the current EN Home card markup in the maintained Vietnamese carousel.

Only the card list and its scoped dependencies change. The rest of /vi/ stays
on its existing static implementation; no Next runtime is loaded there.
"""
import json
import re
from pathlib import Path

from benchmark_overview import SSRMarkup, render

ROOT = Path(__file__).resolve().parent.parent
STYLES = ['streak-card', 'diary-card', 'progress-card', 'fasting-card', 'photo-cards', 'card-copy']


def walk(node):
    if isinstance(node, list):
        yield node
        for child in node[2]:
            yield from walk(child)


def localize_cards():
    source = (ROOT / 'index.html').read_text()
    start = source.index('<section id="dietfit-features"')
    section = source[start:source.index('</section>', start)]
    cards = re.findall(r'<article\b.*?</article>', section, re.S)
    if len(cards) != 10:
        raise ValueError('Expected the current ten EN Home cards')
    translations = json.loads((ROOT / 'content/locales/home-cards-vi.json').read_text())

    def translate(node):
        if isinstance(node, str):
            text = node.strip()
            if text in translations:
                return node.replace(text, translations[text])
            unknown = re.sub(r'Dietfit|Apple Health|Fitpoints|kcal', '', text)
            if re.search(r'[A-Za-z]{2,}', unknown):
                raise ValueError('Missing Vietnamese card text: ' + text)
            return node
        if isinstance(node, dict):
            return node
        tag, props, children = node
        for attr in ['alt', 'aria-label', 'title']:
            if props.get(attr) in translations:
                props[attr] = translations[props[attr]]
        node[2] = [translate(child) for child in children]
        return node

    localized = []
    for card in cards:
        parser = SSRMarkup()
        parser.feed(card)
        node = translate(parser.root[0])
        for child in walk(node):
            if 'df-streak-scene__week' in child[1].get('className', '').split():
                for day, name in zip(child[2], ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']):
                    next(item for item in walk(day) if item[0] == 'b')[2] = [name]
        markup = render(node)
        if 'df-highlight--science' in node[1].get('className', ''):
            widgets = (ROOT / 'content/components/science-widgets-vi.html').read_text().strip()
            markup = markup.replace('</article>', widgets + '</article>')
        if 'df-photo-card--reward' in node[1].get('className', ''):
            widgets = (ROOT / 'content/components/reward-widgets-vi.html').read_text().strip()
            markup, count = re.subn(r'<div class="df-reward-calories[^\"]*"><img\b[^>]*></div>', '', markup)
            if count != 2:
                raise ValueError('Expected the two reward image widgets')
            markup = markup.replace('</div></article>', widgets + '</div></article>')
        localized.append(markup)

    page = ROOT / 'vi/index.html'
    text = page.read_text()
    text = text.replace('<body class="dietfit-home--vi">', '<body class="dietfit-home--vi dietfit-landing">')
    text = text.replace('class="dietfit-highlights dietfit-highlights--vi"', 'class="dietfit-highlights dietfit-highlights--vi dietfit-highlights--en"')
    pattern = r'(<div class="dietfit-carousel"[^>]*>).*?(</div>\s*<div class="dietfit-carousel-controls")'
    text, count = re.subn(pattern, lambda m: m[1] + '\n' + '\n'.join(localized) + '\n' + m[2], text, flags=re.S)
    if count != 1:
        raise ValueError('Expected the existing Vietnamese card carousel')
    text = text.replace('<div class="dietfit-carousel" data-dietfit-carousel="">', '<div class="dietfit-carousel" data-dietfit-carousel="" role="region" tabindex="0" aria-label="Danh sách tính năng Dietfit">')
    text = re.sub(r'<link\b[^>]*href="/styles/dietfit-highlights-vi.css[^\"]*"[^>]*>\s*', '', text)
    for name in STYLES:
        link = f'<link rel="stylesheet" href="/styles/dietfit-{name}.css">'
        if link not in text:
            text = text.replace('</head>', link + '\n</head>', 1)
    link = '<link rel="stylesheet" href="/styles/dietfit-home-cards-vi.css?v=1">'
    if link not in text:
        text = text.replace('</head>', link + '\n</head>', 1)
    script = '<script src="/scripts/dietfit-progress-card-vi.js" defer></script>'
    if script not in text:
        text = text.replace('</body>', script + '\n</body>', 1)
    script = '<script src="/scripts/dietfit-diary-card-vi.js" defer></script>'
    if script not in text:
        text = text.replace('</body>', script + '\n</body>', 1)
    page.write_text(text)
    controller = (ROOT / 'content/components/progress-card-controller.js').read_text()
    (ROOT / 'scripts/dietfit-progress-card-vi.js').write_text(controller + '\n' +
        "document.querySelectorAll('#dietfit-highlights .df-progress-card').forEach(createDietfitProgressCard);\n")
    controller = (ROOT / 'content/components/diary-card-controller.js').read_text()
    (ROOT / 'scripts/dietfit-diary-card-vi.js').write_text(controller + '\n' +
        "document.querySelectorAll('#dietfit-highlights .df-diary-card').forEach(createDietfitDiaryCard);\n")
    return len(localized)


if __name__ == '__main__':
    print(f'Localized {localize_cards()} current Home cards for /vi/.')
