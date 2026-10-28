"""Render the reference-based fasting card in both HTML and React."""

import re
from pathlib import Path

from streak_card import ReactMarkup, react_element

ROOT = Path(__file__).resolve().parent.parent
STYLE = '<link rel="stylesheet" href="/styles/dietfit-fasting-card.css">'


def apply_fasting_card(page):
    markup = (ROOT / "content/components/fasting-card.html").read_text().strip()
    markup = re.sub(r">\s+<", "><", markup)
    page, count = re.subn(
        r'<article\b[^>]*class="[^"]*\bdf-habit-card--fasting\b[^"]*"[^>]*>.*?</article>',
        lambda _: markup, page, flags=re.S,
    )
    if count != 1:
        raise ValueError("Expected one English fasting card")
    if STYLE not in page:
        page = page.replace("</head>", STYLE + "\n</head>", 1)

    parser = ReactMarkup()
    parser.feed(markup)
    if len(parser.root) != 1:
        raise ValueError("Expected one fasting card root")
    bundle = ROOT / "_next/static/chunks/app/[locale]/page-a22fe37dbadd41a9.js"
    code = bundle.read_text()
    original = 'case"fasting":return(0,n.jsx)(C,{card:t,hasToggle:!1,children:(0,n.jsx)(k,{})});'
    if code.count(original) != 1:
        raise ValueError("Fasting component signature changed; run the Home importer first")
    replacement = 'case"fasting":return' + react_element(parser.root[0]) + ';'
    bundle.write_text(code.replace(original, replacement, 1))
    return page
