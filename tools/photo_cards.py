"""Keep the reference-based photo cards consistent in HTML and hydrated React."""

import re
from pathlib import Path

from streak_card import ReactMarkup, react_element

ROOT = Path(__file__).resolve().parent.parent
STYLE = '<link rel="stylesheet" href="/styles/dietfit-photo-cards.css">'
CARDS = {
    "reward": "df-highlight--reward",
    "reminder": "df-habit-card--reminder",
    "together": "df-habit-card--together",
    "challenge": "df-habit-card--challenge",
    "apple-health": "df-highlight--apple-health",
}


def apply_photo_cards(page):
    branches = []
    for name, class_name in CARDS.items():
        markup = (ROOT / f"content/components/{name}-card.html").read_text().strip()
        markup = re.sub(r">\s+<", "><", markup)
        pattern = rf'<article\b[^>]*class="[^"]*\b{re.escape(class_name)}\b[^"]*"[^>]*>.*?</article>'
        page, count = re.subn(pattern, lambda _: markup, page, flags=re.S)
        if count != 1:
            raise ValueError(f"Expected one English {name} card")
        parser = ReactMarkup()
        parser.feed(markup)
        if len(parser.root) != 1:
            raise ValueError(f"Expected one {name} card root")
        branches.append(f'if(t.id=="{name}")return ' + react_element(parser.root[0]) + ";")

    if STYLE not in page:
        page = page.replace("</head>", STYLE + "\n</head>", 1)
    bundle = ROOT / "_next/static/chunks/app/[locale]/page-a22fe37dbadd41a9.js"
    code = bundle.read_text()
    marker = 'function I(e){let{card:t}=e;switch(t.kind)'
    if code.count(marker) != 1:
        raise ValueError("Feature renderer signature changed; run the Home importer first")
    replacement = 'function I(e){let{card:t}=e;' + "".join(branches) + 'switch(t.kind)'
    bundle.write_text(code.replace(marker, replacement, 1))
    return page
