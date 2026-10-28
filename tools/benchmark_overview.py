"""Compose a data-first report in both static HTML and Next's server payload.

Client-owned plate inspection and the phone demo remain their original elements.
"""

import copy
import html
import json
import re
from pathlib import Path

from streak_card import ReactMarkup

ROOT = Path(__file__).resolve().parent.parent
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source'}
HTML_ATTRS = {'className': 'class', 'viewBox': 'viewBox', 'strokeWidth': 'stroke-width',
              'strokeLinecap': 'stroke-linecap', 'strokeLinejoin': 'stroke-linejoin',
              'strokeDasharray': 'stroke-dasharray', 'fillRule': 'fill-rule', 'textAnchor': 'text-anchor'}


class BenchmarkMarkup(ReactMarkup):
    """Keep SVG text-on-path names valid in both the HTML and React trees."""
    def handle_starttag(self, tag, attrs):
        names = {'startoffset': 'startOffset', 'textlength': 'textLength',
                 'lengthadjust': 'lengthAdjust', 'text-anchor': 'textAnchor'}
        super().handle_starttag('textPath' if tag == 'textpath' else tag,
                               [(names.get(name, name), value) for name, value in attrs])


class SSRMarkup(BenchmarkMarkup):
    def handle_comment(self, data):
        self.stack[-1].append({'comment': data})

    def handle_data(self, data):
        if data:
            self.stack[-1].append(data)


def markup(name):
    text = (ROOT / 'content/components' / name).read_text().strip()
    if name == 'benchmark-overview.html':
        from benchmark_charts import compose_charts
        text = compose_charts(text)
    parser = BenchmarkMarkup()
    parser.feed(re.sub(r'>\s+<', '><', text))
    if len(parser.root) != 1:
        raise ValueError(f'Expected one root in {name}')
    return parser.root[0]


def flight(node):
    if isinstance(node, str):
        return node
    tag, props, children = copy.deepcopy(node)
    for attr in ['hidden', 'muted', 'loop']:
        if attr in props:
            props[attr] = True
    if 'playsinline' in props:
        props['playsInline'] = True
        props.pop('playsinline')
    if 'tabindex' in props:
        props['tabIndex'] = int(props.pop('tabindex'))
    if 'style' in props:
        props['style'] = {key.strip(): value.strip() for key, value in
                          (part.split(':', 1) for part in props['style'].split(';') if ':' in part)}
    if children:
        props['children'] = flight(children[0]) if len(children) == 1 else list(map(flight, children))
    return ['$', tag, None, props]


def render(node):
    if isinstance(node, dict):
        return '<!--' + node['comment'] + '-->'
    if isinstance(node, str):
        return html.escape(node, quote=False)
    tag, props, children = node
    attrs = ''.join(f' {HTML_ATTRS.get(key, key)}="{html.escape(value or "", quote=True)}"'
                    for key, value in props.items())
    if tag in VOID:
        return f'<{tag}{attrs}>'
    content = ''.join(children) if tag == 'script' else ''.join(map(render, children))
    return f'<{tag}{attrs}>{content}</{tag}>'


class Tree:
    def __init__(self, server):
        self.server = server

    def is_node(self, node):
        return isinstance(node, list) and ((len(node) == 4 and node[0] == '$' and isinstance(node[3], dict))
                                           if self.server else len(node) == 3 and isinstance(node[0], str))

    def props(self, node):
        return node[3 if self.server else 1]

    def tag(self, node):
        return node[1 if self.server else 0]

    def children(self, node):
        if not self.server:
            return node[2]
        value = self.props(node).get('children', [])
        if value is None:
            return []
        return [value] if not isinstance(value, list) or self.is_node(value) else value

    def set_children(self, node, value):
        if self.server:
            self.props(node)['children'] = value[0] if len(value) == 1 else value
        else:
            node[2] = value

    def find(self, node, predicate):
        if not self.is_node(node):
            return None
        if predicate(node):
            return node
        for child in self.children(node):
            found = self.find(child, predicate)
            if found is not None:
                return found
        return None

    def by_class(self, node, cls):
        return self.find(node, lambda item: cls in self.props(item).get('className', '').split())

    def text(self, node):
        if isinstance(node, str):
            return node
        if self.is_node(node):
            return ''.join(self.text(child) for child in self.children(node))
        return ''

    def new(self, name):
        value = markup(name)
        return flight(value) if self.server else value

    def compose(self, main):
        sections = self.children(main)
        demo = self.new('benchmark-example-score.html')
        comparison = self.by_class(sections[1], 'bm-photo__comparison')
        original_photo = self.children(comparison)
        if len(original_photo) != 2 or self.tag(original_photo[0]) != 'figure':
            raise ValueError('Photo comparison structure changed')
        figure = original_photo[0]
        self.props(figure)['aria-label'] = 'Interactive meal example'
        self.set_children(comparison, [figure, demo])
        steps = self.by_class(sections[1], 'bm-photo__steps')
        portion_label = self.children(self.children(steps)[1])[0]
        self.set_children(portion_label, ['02 · Estimate each portion'])
        results = self.by_class(sections[2], 'bm-text__results')
        original_text = self.children(results)
        if len(original_text) != 2 or self.by_class(original_text[1], 'bm-table-scroll') is None:
            raise ValueError('Text comparison structure changed')
        self.set_children(results, [original_text[1]])
        heading = self.find(sections[2], lambda item: self.props(item).get('id') == 'bm-text')
        self.set_children(heading, ['Text logging, tested.'])
        method = self.by_class(sections[3], 'bm-method__inner')
        intro = self.children(method)[0]
        intro_children = self.children(intro)
        data = [i for i, child in enumerate(intro_children) if self.text(child).startswith('Data:')]
        if len(data) != 1:
            raise ValueError('Expected original methodology attribution')
        intro_children[data[0]] = self.new('benchmark-sources.html')
        self.set_children(intro, intro_children)
        # Drop decorative section labels, keeping the report's actual headings.
        photo_heading = self.children(self.children(self.children(sections[1])[0])[0])[0]
        self.set_children(photo_heading, [child for child in self.children(photo_heading)
                                         if not (self.is_node(child) and self.tag(child) == 'p')])
        text_intro = self.children(self.children(sections[2])[0])[0]
        self.set_children(text_intro, [child for child in self.children(text_intro)
                                      if not (self.is_node(child) and self.tag(child) == 'p')])
        self.set_children(intro, [child for child in self.children(intro)
                                 if self.text(child).strip() != 'Methodology'])
        # Present the same three rules in the user's pastel feature-card grid.
        self.props(method)['className'] += ' bm-method-cards'
        self.props(intro)['className'] = 'bm-method-cards__intro'
        sources = self.by_class(intro, 'bm-sources')
        self.set_children(intro, [child for child in self.children(intro) if child is not sources])
        process = next(child for child in self.children(method) if self.is_node(child) and self.tag(child) == 'ol')
        self.props(process)['className'] = 'bm-method-cards__grid'
        icons = self.children(self.new('benchmark-method-icons.html'))
        for index, step in enumerate(self.children(process)):
            self.props(step)['className'] = 'bm-method-card'
            _, copy = self.children(step)
            self.props(copy)['className'] = 'bm-method-card__copy'
            self.set_children(step, [icons[index], copy])
        last_copy = self.children(self.children(process)[-1])[-1]
        formula = next(child for child in self.children(last_copy) if self.is_node(child) and self.tag(child) == 'div')
        self.set_children(last_copy, [child for child in self.children(last_copy) if child is not formula])
        self.set_children(method, [intro, process])
        showcase = self.new('benchmark-scan-showcase.html')
        details_slot = self.find(showcase, lambda item: 'data-bm-showcase-details' in self.props(item))
        self.set_children(details_slot, [self.new('benchmark-method-details.html')])
        # Reuse Home's FAQ introduction and plain animated plus treatment.
        faq = self.find(main, lambda item: self.props(item).get('aria-labelledby') == 'bm-faq')
        self.props(faq)['className'] += ' dietfit-faq'
        faq_children = self.children(faq)
        faq_title = self.find(faq, lambda item: self.props(item).get('id') == 'bm-faq')
        faq_children[faq_children.index(faq_title)] = self.new('benchmark-faq-intro.html')
        faq_list = faq_children[-1]
        self.props(faq_list)['className'] = 'dietfit-faq-list'
        schema = self.find(faq, lambda item: self.tag(item) == 'script')
        schema_rows = []
        for detail in self.children(faq_list):
            summary = self.find(detail, lambda item: self.tag(item) == 'summary')
            icon = self.find(summary, lambda item: self.tag(item) == 'span')
            self.props(icon).pop('className', None)
            self.set_children(icon, [])
            question = self.text(summary)
            answer = self.find(detail, lambda item: self.tag(item) == 'p')
            schema_rows.append({'@type': 'Question', 'name': question,
                                'acceptedAnswer': {'@type': 'Answer', 'text': self.text(answer)}})
            self.set_children(summary, [question, icon])
        # Flight may reference a separate text record for __html. Compose the
        # schema from the displayed questions and unchanged answers instead.
        serialized_schema = json.dumps({'@context': 'https://schema.org', '@type': 'FAQPage',
                                        'inLanguage': 'en-US', 'mainEntity': schema_rows},
                                       ensure_ascii=False, separators=(',', ':'))
        schema_props = self.props(schema)
        if 'dangerouslySetInnerHTML' in schema_props:
            schema_props['dangerouslySetInnerHTML']['__html'] = serialized_schema
        else:
            self.set_children(schema, [serialized_schema])
        self.set_children(faq, faq_children)
        sections[0] = self.new('benchmark-overview.html')
        sections.insert(3, showcase)
        self.set_children(main, sections)


def apply_overview(page):
    original = re.search(r'<main\b.*?</main>', page, re.S)
    if original is None:
        raise ValueError('Benchmark main content missing')
    parser = SSRMarkup()
    parser.feed(original.group(0))
    tree = Tree(server=False)
    main = parser.root[0]
    # Guard the authored summary against a silently changed source report.
    for score in ['82.0%', '80.0%', '79.2%', '88.0%', '87.7%', '65.8%', '63.4%']:
        if score not in tree.text(main):
            raise ValueError(f'Benchmark source score changed: {score}')
    tree.compose(main)
    page = page[:original.start()] + render(main) + page[original.end():]
    closing = re.search(r'<div class="bg-dietfit-black font-dietfit w-full text-white">.*?</footer></div>', page, re.S)
    if closing is None:
        raise ValueError('Benchmark closing block missing')
    page = page[:closing.start()] + render(tree.new('benchmark-final.html')) + page[closing.end():]
    changed = 0

    def payload(match):
        nonlocal changed
        packet = json.loads(match.group(1))
        if len(packet) < 2 or packet[0] != 1 or not isinstance(packet[1], str):
            return match.group(0)
        stream = packet[1]
        if 'bm-hero__inner' not in stream:
            return match.group(0)
        records = []
        for line in stream.splitlines(keepends=True):
            record = re.match(r'([0-9a-f]+):(.*?)(\n?)$', line, re.S)
            if record is None:
                records.append(line)
                continue
            try:
                value = json.loads(record.group(2))
            except json.JSONDecodeError:
                records.append(line)
                continue
            server = Tree(server=True)
            root = server.find(value, lambda item: server.tag(item) == 'main'
                               and server.props(item).get('id') == 'main')
            if root is None:
                records.append(line)
                continue
            server.compose(root)
            final = server.find(value, lambda item: server.props(item).get('className') == 'bg-dietfit-black font-dietfit w-full text-white')
            if final is None:
                raise ValueError('Benchmark closing payload missing')
            final[:] = server.new('benchmark-final.html')
            changed += 1
            records.append(record.group(1) + ':' + json.dumps(value, ensure_ascii=False, separators=(',', ':')) + record.group(3))
        packet[1] = ''.join(records)
        return '<script>self.__next_f.push(' + json.dumps(packet, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + ')</script>'

    page = re.sub(r'<script>self\.__next_f\.push\((\[.*?\])\)</script>', payload, page, flags=re.S)
    if changed != 1:
        raise ValueError(f'Expected one benchmark main payload, got {changed}')
    return page
