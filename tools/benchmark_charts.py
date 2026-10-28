"""Render the original report's scores as accessible app comparison dot plots."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def chart(kind, apps, categories):
    columns = []
    for app_index, app in enumerate(apps):
        icon = ('/assets/benchmarks-page/landing/app-icon.png' if app['id'] == 'dietfit'
                else '/assets/benchmarks-editorial/app-icons/' + app['id']
                + ('.png' if app['id'] == '0xcal' else '.jpg'))
        points = []
        placed = []
        samples = [(row['label'], row['scores'][app_index]) for row in categories] if kind == 'text' else [('30-plate average', app['score'])]
        for label, score in samples:
            # Only y encodes accuracy. Jitter separates equal values horizontally.
            shifts = [0, -20, 20, -40, 40, -60, 60]
            shift = max(shifts, key=lambda x: min(((x - old_x) ** 2 + ((score - old_score) * 2.2) ** 2 for old_x, old_score in placed), default=10000))
            placed.append((shift, score))
            detail = (f"{app['error']:.1f} kcal average absolute error" if kind == 'photo' else label)
            name = html.escape(app['name'], quote=True)
            detail = html.escape(detail, quote=True)
            label = html.escape(label, quote=True)
            points.append(f'<button class="bm-chart-dot" type="button" style="--score:{score};--shift:{shift}px" data-app="{name}" data-score="{score:.1f}" data-detail="{detail}" aria-label="{name}, {label}, {score:.1f}% accuracy"><span></span></button>')
        columns.append(f'<div class="bm-chart-column {"bm-chart-column--dietfit" if app["id"] == "dietfit" else ""}"><div class="bm-chart-brand"><img src="{icon}" width="40" height="40" alt=""><span>{html.escape(app["name"])}</span><strong>{app["score"]:.1f}<small>%</small></strong></div><div class="bm-chart-plot">{"".join(points)}</div></div>')
    ticks = ''.join(f'<span style="--tick:{score}%">{score}</span>' for score in [100, 75, 50, 25, 0])
    return f'<div class="bm-chart-scroll" tabindex="0" role="region" aria-label="{kind.title()} accuracy dot plot. Scroll horizontally on smaller screens."><div class="bm-dot-chart bm-dot-chart--{kind}" style="--apps:{len(apps)}">{"".join(columns)}<div class="bm-chart-axis" aria-hidden="true">{ticks}</div><div class="bm-chart-tooltip" role="status" aria-live="polite" hidden></div></div></div>'


def compose_charts(template):
    data = json.loads((ROOT / 'content/benchmark-chart-data.json').read_text())
    for kind in ['photo', 'text']:
        marker = '<!-- benchmark:' + kind + '-chart -->'
        if template.count(marker) != 1:
            raise ValueError('Missing benchmark chart slot: ' + kind)
        template = template.replace(marker, chart(kind, data[kind], data['categories']))
    return template
