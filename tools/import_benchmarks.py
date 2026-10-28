#!/usr/bin/env python3
"""Import the supplied English Benchmarks tab without changing Home's runtime.

Usage: python3 tools/import_benchmarks.py [capture-directory]
"""

import html
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "dev-dietfit-health-2026-10-27T04-05-53-327Z"
PREFIX = "/assets/benchmarks-page"
DEST = ROOT / PREFIX.lstrip("/")
PAGE = ROOT / "en/benchmarks/index.html"
LINK = "/en/benchmarks/"
NAV_CSS = '<link rel="stylesheet" href="/styles/dietfit-benchmarks-nav.css">'


def replace_once(text, before, after, label):
    if text.count(before) != 1:
        raise ValueError(f"{label}: capture signature changed")
    return text.replace(before, after, 1)


def header_bundle(code):
    """Add the link to both React header layouts, matching the static markup."""
    if f'href:"{LINK}"' in code:
        return code
    patterns = [
        r'(\(0,[a-z]+\.jsxs\)\()([a-z]+\.N_)(,\{href:"/blog",.*?children:\[.*?\("blog"\)\]\}\))',
        r'(\(0,[a-z]+\.jsx\)\()([a-z]+\.N_)(,\{href:"/blog",.*?children:[a-z]+\("blog"\)\}\))',
    ]
    for pattern in patterns:
        matches = list(re.finditer(pattern, code))
        if len(matches) != 1:
            raise ValueError("Expected exactly one Blog link in each header layout")
        match = matches[0]
        added = match.group(1) + '"a"' + match.group(3)
        added = added.replace('href:"/blog"', f'href:"{LINK}"')
        added = added.replace('startsWith("/blog")', 'startsWith("/benchmarks")')
        added = re.sub(r'[a-z]+\("blog"\)', '"Benchmarks"', added)
        code = code[:match.end()] + "," + added + code[match.end():]
    return code


def page_navigation(page, active=False):
    def patch_header(match):
        header = match.group(0)
        if f'href="{LINK}"' in header:
            return header

        def add_link(link):
            original = link.group(0)
            if not re.search(r'>\s*Blog\s*<', original):
                return original
            added = re.sub(r'href="[^"]+"', f'href="{LINK}"', original, count=1)
            added = re.sub(r' aria-current="[^"]*"', "", added)
            added = re.sub(r'>\s*Blog\s*<', '>Benchmarks<', added)
            if active:
                added = added.replace("<a ", '<a aria-current="page" ', 1)
            return original + added

        return re.sub(r'<a\b[^>]*href="/en/blog/?"[^>]*>.*?</a>', add_link, header, flags=re.S)

    page = re.sub(r'<header\b.*?</header>', patch_header, page, flags=re.S)
    if NAV_CSS not in page:
        page = page.replace("</head>", NAV_CSS + "\n</head>", 1)
    return page


def update_navigation():
    """Safe to rerun after either the Home importer or the blog builder."""
    home_header = ROOT / "_next/static/chunks/1318-5760d38f7a23b01e.js"
    if home_header.exists():
        home_header.write_text(header_bundle(home_header.read_text()))
    for page in [ROOT / "index.html", *(ROOT / "en").rglob("*.html")]:
        content = page.read_text()
        if "<header" in content:
            page.write_text(page_navigation(content, active=page == PAGE))


def local_paths(text):
    for original in ["/_next/", "/landing/", "/benchmarks/plate_", "/app-store-badge.svg"]:
        text = text.replace(original, PREFIX + original)
    return text


def import_capture(source):
    manifest = json.loads((source / ".capture-index.json").read_text())
    if manifest.get("entryPath") != "/en/benchmarks":
        raise ValueError("Expected the supplied /en/benchmarks capture")

    # Keep this build isolated: it has different chunk modules from Home even
    # where the capture reused the same webpack filename.
    for asset in (source / "_next/static").rglob("*"):
        if not asset.is_file():
            continue
        target = DEST / asset.relative_to(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        if asset.suffix in [".js", ".css"]:
            code = asset.read_text()
            if asset.name.startswith("992-"):
                code = replace_once(code,
                    'return r.path+"?url="+encodeURIComponent(n)+"&w="+i+"&q="+l+(n.startsWith("/_next/static/media/"),"")',
                    "return n", "static image loader")
            if asset.name.startswith("2158-"):
                code = replace_once(code, "prefetch:_=null", "prefetch:_=!1", "static navigation")
                code = replace_once(code,
                    'e.preventDefault(),u.default.startTransition(()=>{if(a){let e=!1;if(a({preventDefault:()=>{e=!0}}),e)return}(0,h.dispatchNavigateAction)(r||t,o?"replace":"push",null==i||i,n.current)})',
                    'e.preventDefault(),o?location.replace(r||t):location.assign(r||t)', "static navigation")
                code = code.replace("window.__csNavigate(t)", "location.assign(t)")
            if asset.name.startswith("layout-"):
                code = re.sub(r'let i="phc_[^"]+";', 'let i="";', code)
                code = replace_once(code, "t.GoogleAnalytics=function(e){", "t.GoogleAnalytics=function(e){return null;", "capture analytics")
            if asset.name.startswith("1747-"):
                code = header_bundle(code)
                # There is no Vietnamese benchmark in the supplied source.
                # Its language switch leads to the existing Vietnamese home.
                code = replace_once(code, 'href:void 0===t?f:', 'href:"vi"===e?"/":void 0===t?f:', "VI destination")
            target.write_text(local_paths(code))
        else:
            shutil.copy2(asset, target)

    for asset in (source / "landing").rglob("*"):
        if asset.is_file():
            relative = re.sub(r"~[0-9a-f]{8}(?=\.[^.]+$)", "", asset.relative_to(source).as_posix())
            target = DEST / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(asset, target)
    shutil.copy2(source / "app-store-badge.svg", DEST / "app-store-badge.svg")

    images = {}
    for variant in manifest["variants"]["_next/image"]:
        query = parse_qs(variant["search"])
        original = query["url"][0]
        width = int(query.get("w", ["0"])[0])
        if original not in images or width > images[original][0]:
            images[original] = (width, source / variant["file"])
    for original, (_, asset) in images.items():
        if not original.startswith("/") or ".." in Path(original).parts:
            raise ValueError(f"Unexpected image path: {original}")
        target = DEST / original.lstrip("/")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(asset, target)

    page = (source / "index.html").read_text()
    page = re.sub(r'<script id="(?:local-replay-[^"]+|capture-studio-[^"]+)"[^>]*>.*?</script>\s*', "", page, flags=re.S)
    page = re.sub(r'<style id="(?:capture-studio|local-replay)-[^"]+"[^>]*>.*?</style>', "", page, flags=re.S)
    page = re.sub(r' data-(?:cs-block|capture-studio-hidden)="[^"]*"', "", page)
    page = re.sub(r'<link[^>]*href="https://www.googletagmanager.com/[^>]*>', "", page)
    page = re.sub(r'<script[^>]*src="[^"]*polyfills-[^"]*"[^>]*></script>', "", page)

    def image_url(match):
        original = parse_qs(html.unescape(match.group(1)))["url"][0]
        if original not in images:
            raise ValueError(f"Missing captured image: {original}")
        return original

    page = re.sub(r'/_next/image\?([^\s"<>]+)', image_url, page)
    page = local_paths(page)
    page = page.replace('href="/vi/benchmarks"', 'href="/vi"')
    # The supplied tab is English-only; do not advertise a missing VI page.
    page = re.sub(r'<link\b[^>]*hreflang="vi"[^>]*>', "", page)
    page = re.sub(
        r',\[\\"\$\\",\\"link\\",\\"\d+\\",\{\\"rel\\":\\"alternate\\",\\"hrefLang\\":\\"vi\\",\\"href\\":\\"https://dietfit\.health/vi/benchmarks\\"\}\]',
        "", page,
    )
    page = page.replace('<head>', '<head>\n<!-- Dietfit Benchmarks: imported with tools/import_benchmarks.py -->\n', 1)
    from benchmark_design import apply_benchmark_design
    page = apply_benchmark_design(page)
    PAGE.parent.mkdir(parents=True, exist_ok=True)
    PAGE.write_text(page_navigation(page, active=True))
    update_navigation()
    print(f"Imported English Benchmarks tab from {source.name}")


if __name__ == "__main__":
    import_capture(Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SOURCE)
