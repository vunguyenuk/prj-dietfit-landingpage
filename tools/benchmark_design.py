"""Attach editorial report styles to the original benchmark report.

The capture renders this page through server-component payloads. Updating each
class string in both the HTML and embedded payload keeps hydration consistent.
"""

import re

STYLE = '<link rel="stylesheet" href="/styles/dietfit-benchmarks-page.css"><link rel="stylesheet" href="/styles/dietfit-benchmark-reference.css"><link rel="stylesheet" href="/styles/dietfit-footer-standalone.css?v=2"><link rel="stylesheet" href="/styles/dietfit-benchmark-final.css"><link rel="stylesheet" href="/styles/dietfit-benchmark-showcase.css">'
CLASSES = {
    "overflow-x-clip": "df-benchmarks",
    "mx-auto max-w-[72rem] px-[clamp(1.25rem,4vw,4rem)] pt-32 pb-20 md:pt-[clamp(9rem,13vw,12rem)] md:pb-28": "bm-hero__inner",
    "grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.35fr_1fr]": "bm-hero__layout",
    "m-0 mt-4 flex items-start gap-4": "bm-hero__score",
    "relative mx-auto w-full max-w-[19rem]": "bm-hero__visual",
    "grid scroll-mt-28! grid-cols-1 gap-5 lg:grid-cols-2": "bm-photo__comparison",
    "flex min-w-0 flex-col rounded-[2rem] bg-white p-6 sm:p-8": "bm-ranking",
    "m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3": "bm-photo__steps",
    "grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.6fr]": "bm-text__results",
    "min-w-0 overflow-x-auto rounded-[2rem] bg-white": "bm-table-scroll",
    "mx-auto max-w-[72rem] px-[clamp(1.25rem,4vw,4rem)] grid grid-cols-1 gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.5fr] lg:gap-20": "bm-method__inner",
}


def apply_benchmark_design(page):
    if STYLE in page:
        return page
    for original, name in CLASSES.items():
        if page.count(original) < 2:
            raise ValueError(f"Benchmark markup/payload signature changed: {name}")
        page = page.replace(original, original + " " + name)
    table_class = 'min-w-0 overflow-x-auto rounded-[2rem] bg-white bm-table-scroll'
    page = page.replace(
        f'class="{table_class}">',
        f'class="{table_class}" tabindex="0" role="region" aria-label="Food category accuracy comparison">',
        1,
    )
    # Keep the same accessibility props in the escaped server-component data.
    pattern = r'(?P<q>\\*")className(?P=q):(?P=q)' + re.escape(table_class) + r'(?P=q)'

    def table_props(match):
        q = match.group('q')
        return (match.group(0) + f',{q}tabIndex{q}:0,{q}role{q}:{q}region{q}'
                + f',{q}aria-label{q}:{q}Food category accuracy comparison{q}')

    page, count = re.subn(pattern, table_props, page)
    if count != 1:
        raise ValueError('Expected one table region in the benchmark payload')
    from benchmark_overview import apply_overview
    page = apply_overview(page)
    page = page.replace('</head>', STYLE + '\n</head>', 1)
    page = page.replace('</body>', '<script src="/scripts/dietfit-header.js" defer></script><script src="/scripts/dietfit-benchmark-charts.js" defer></script><script src="/scripts/dietfit-benchmark-demo.js" defer></script>\n</body>', 1)
    return page
