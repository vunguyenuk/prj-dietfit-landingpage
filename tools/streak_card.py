"""Render the streak illustration as matching static HTML and React elements."""

import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STYLE = '<link rel="stylesheet" href="/styles/dietfit-streak-card.css">'


class ReactMarkup(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = []
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        names = {
            "class": "className", "viewbox": "viewBox",
            "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
            "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray",
            "fill-rule": "fillRule",
        }
        props = {names.get(name, name): value for name, value in attrs}
        node = [tag, props, []]
        self.stack[-1].append(node)
        if tag not in {"img", "br", "hr", "input", "meta", "link", "source"}:
            self.stack.append(node[2])

    def handle_endtag(self, tag):
        self.stack.pop()

    def handle_data(self, data):
        if data.strip():
            self.stack[-1].append(data)


def react_element(node):
    if isinstance(node, str):
        return json.dumps(node, ensure_ascii=False)
    tag, attrs, children = node
    props = json.dumps(attrs, ensure_ascii=False, separators=(",", ":"))[:-1]
    if children:
        content = react_element(children[0]) if len(children) == 1 else "[" + ",".join(map(react_element, children)) + "]"
        props += ("," if attrs else "") + '"children":' + content
    props += "}"
    return f'(0,n.{"jsxs" if len(children) > 1 else "jsx"})({json.dumps(tag)},{props})'


def apply_streak_card(page):
    markup = (ROOT / "content/components/streak-art.html").read_text().strip()
    # Ignore formatting-only whitespace so the static and React trees agree.
    markup = re.sub(r">\s+<", "><", markup)
    pattern = r'(<article\b[^>]*class="[^"]*\bdf-habit-card--streak\b[^"]*"[^>]*>)(.*?)(</article>)'

    def replace_card(match):
        body = match.group(2)
        start = body.index('<div class="df-habit-art')
        return match.group(1) + body[:start] + markup + match.group(3)

    page, count = re.subn(pattern, replace_card, page, flags=re.S)
    if count != 1:
        raise ValueError("Expected one English streak card")
    if STYLE not in page:
        page = page.replace("</head>", STYLE + "\n</head>", 1)

    parser = ReactMarkup()
    parser.feed(markup)
    if len(parser.root) != 1:
        raise ValueError("Expected one illustration root")
    bundle = ROOT / "_next/static/chunks/app/[locale]/page-a22fe37dbadd41a9.js"
    code = bundle.read_text()
    replacement = "function b(){return " + react_element(parser.root[0]) + "}"
    original = r'function b\(\)\{let e=\(0,i\.c\)\("landingV2.features.cards.streak"\).*?(?=function y\(\))'
    code, count = re.subn(original, lambda _: replacement, code, flags=re.S)
    if count != 1:
        raise ValueError("Streak component signature changed; run the Home importer first")
    bundle.write_text(code)
    return page
