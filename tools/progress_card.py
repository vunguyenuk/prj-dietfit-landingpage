"""Render and project an editable progress screen onto the supplied phone shot."""

import re
from pathlib import Path

from streak_card import ReactMarkup, react_element

ROOT = Path(__file__).resolve().parent.parent
STYLE = '<link rel="stylesheet" href="/styles/dietfit-progress-card.css">'


def apply_progress_card(page):
    markup = (ROOT / "content/components/progress-card.html").read_text().strip()
    markup = re.sub(r">\s+<", "><", markup)
    page, count = re.subn(
        r'<article\b[^>]*class="[^"]*\bdf-highlight--progress\b[^"]*"[^>]*>.*?</article>',
        lambda _: markup, page, flags=re.S,
    )
    if count != 1:
        raise ValueError("Expected one English progress card")
    if STYLE not in page:
        page = page.replace("</head>", STYLE + "\n</head>", 1)

    parser = ReactMarkup()
    parser.feed(markup)
    if len(parser.root) != 1:
        raise ValueError("Expected one progress card root")
    component = react_element(parser.root[0]).replace('{"className":', '{"ref":progressRef,"className":', 1)
    controller = (ROOT / "content/components/progress-card-controller.js").read_text()
    render = 'function dfProgressCard(){const progressRef=(0,l.useRef)(null);(0,l.useEffect)(()=>createDietfitProgressCard(progressRef.current),[]);return ' + component + '}'
    bundle = ROOT / "_next/static/chunks/app/[locale]/page-a22fe37dbadd41a9.js"
    code = bundle.read_text()
    marker = 'function I(e){let{card:t}=e;switch(t.kind)'
    if code.count(marker) != 1:
        raise ValueError("Feature renderer signature changed; run the Home importer first")
    code = code.replace(marker, controller + render + marker, 1)
    original = ':(0,n.jsx)(A,{card:t});case"fasting":'
    if code.count(original) != 1:
        raise ValueError("Progress branch signature changed; import after the diary card")
    replacement = ':"progress"===t.id?(0,n.jsx)(dfProgressCard,{}):(0,n.jsx)(A,{card:t});case"fasting":'
    bundle.write_text(code.replace(original, replacement, 1))
    return page
