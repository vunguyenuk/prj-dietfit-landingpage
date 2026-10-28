"""Keep the reference-based diary card's static and hydrated markup identical."""

import re
from pathlib import Path

from streak_card import ReactMarkup, react_element

ROOT = Path(__file__).resolve().parent.parent
STYLE = '<link rel="stylesheet" href="/styles/dietfit-diary-card.css">'


def apply_diary_card(page):
    markup = (ROOT / "content/components/diary-card.html").read_text().strip()
    markup = re.sub(r">\s+<", "><", markup)
    page, count = re.subn(
        r'<article\b[^>]*class="[^"]*\bdf-highlight--diary\b[^"]*"[^>]*>.*?</article>',
        lambda _: markup, page, flags=re.S,
    )
    if count != 1:
        raise ValueError("Expected one English diary card")
    if STYLE not in page:
        page = page.replace("</head>", STYLE + "\n</head>", 1)

    parser = ReactMarkup()
    parser.feed(markup)
    if len(parser.root) != 1:
        raise ValueError("Expected one diary card root")
    bundle = ROOT / "_next/static/chunks/app/[locale]/page-a22fe37dbadd41a9.js"
    code = bundle.read_text()
    original = 'case"app":return(0,n.jsx)(A,{card:t});'
    if code.count(original) != 1:
        raise ValueError("App card signature changed; run the Home importer first")
    replacement = 'case"app":return"diary"===t.id?' + react_element(parser.root[0]) + ':(0,n.jsx)(A,{card:t});'
    bundle.write_text(code.replace(original, replacement, 1))
    return page
