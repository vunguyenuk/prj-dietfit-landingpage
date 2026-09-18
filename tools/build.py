#!/usr/bin/env python3
"""Dietfit — build SEO cho site tĩnh.

Chạy lại mỗi khi sửa nội dung blog, đổi title/description, hoặc thêm trang:

    python3 tools/build.py

Script này:
  1. Sinh trang blog tĩnh từ content/blog-posts.json
     (blog/index.html, blog/<slug>/index.html và bản /en/ tương ứng),
     để Google đọc được nội dung mà không cần chạy JavaScript.
  2. Chèn khối SEO (title, description, canonical, hreflang, Open Graph,
     Twitter, JSON-LD) vào <head> của mọi trang, giữa hai dấu
     <!-- SEO:START --> ... <!-- SEO:END -->. Đừng sửa tay trong khối này.
  3. Ghi sitemap.xml và robots.txt.

Chỉ dùng thư viện chuẩn của Python 3.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://dietfit.health"
APP_STORE = "https://apps.apple.com/vn/app/dietfit-ai-calorie-tracker/id6747063701"
APP_STORE_ID = "6747063701"
THEME = "#FE692E"
LOGO = SITE + "/assets/images/dietfit-app-icon-192.png"
SAME_AS = [
    "https://www.tiktok.com/@dietfitvietnam",
    "https://apps.apple.com/vn/app/dietfit-ai-calorie-tracker/id6747063701",
]
LOCALE = {"vi": "vi_VN", "en": "en_US"}
esc = html.escape


# --------------------------------------------------------------------------
# Nội dung SEO từng trang. Title nên ≤ 60 ký tự, description 120–160 ký tự.
# --------------------------------------------------------------------------
PAGES = {
    "home": {
        "vi": {
            "path": "/",
            "file": "index.html",
            "title": "Dietfit – App đếm calo bằng AI, chụp ảnh là biết calo",
            "description": "Dietfit là app đếm calo bằng AI cho người Việt: chụp ảnh món ăn, AI nhận diện và tính calo, macro trong vài giây. Theo dõi cân nặng, BMR, TDEE dễ dàng.",
            "og_title": "Dietfit – Track calo bằng AI, không lo ăn sai",
            "og_description": "Không cần cân tiểu ly. Chụp một tấm ảnh, Dietfit tính calo và dinh dưỡng cho bạn chỉ trong vài giây.",
            "image": "/assets/og/og-home.jpg",
            "image_alt": "Nhóm bạn trẻ vui vẻ cầm đồ ăn — Dietfit, app đếm calo bằng AI",
        },
        "en": {
            "path": "/en/",
            "file": "en/index.html",
            "title": "Dietfit – AI Calorie Tracker: Snap a Photo, Count Calories",
            "description": "Dietfit is an AI calorie counter: snap a photo of your meal and get calories and macros in seconds. Track your weight, BMR and TDEE — no food scale needed.",
            "og_title": "Dietfit – Track calories with AI, no guesswork",
            "og_description": "No food scale needed. Snap one photo and Dietfit works out the calories and nutrition for you in seconds.",
            "image": "/assets/og/og-home.jpg",
            "image_alt": "Friends laughing and holding food — Dietfit, the AI calorie tracker",
        },
    },
    "about": {
        "vi": {
            "path": "/about-us/",
            "file": "about-us/index.html",
            "title": "Về Dietfit – Đội ngũ đứng sau app đếm calo bằng AI",
            "description": "Một bữa trưa, một câu hỏi quen thuộc: bao nhiêu calo? Câu chuyện phía sau Dietfit, những điều chúng mình tin và đội ngũ làm nên app đếm calo cho người Việt.",
            "og_title": "Về Dietfit — Ăn ngon mà không phải đoán",
            "og_description": "Ăn ngon, chứ đừng ăn khổ. Câu chuyện phía sau Dietfit và cách chúng mình nghĩ về từng bữa ăn.",
            "image": "/assets/og/og-about.jpg",
            "image_alt": "Đội ngũ Dietfit cùng ăn trưa và trò chuyện tại văn phòng",
        },
        "en": {
            "path": "/en/about-us/",
            "file": "en/about-us/index.html",
            "title": "About Dietfit – The Team Behind the AI Calorie Tracker",
            "description": "One lunch, one familiar question: how many calories? The story behind Dietfit, what we believe in, and the team building an AI calorie tracker for real meals.",
            "og_title": "About Dietfit — Eat well, no guessing",
            "og_description": "Eat well, don’t suffer. The story behind Dietfit and how we think about every meal.",
            "image": "/assets/og/og-about.jpg",
            "image_alt": "The Dietfit team having lunch and chatting at the office",
        },
    },
    "blog": {
        "vi": {
            "path": "/blog/",
            "file": "blog/index.html",
            "title": "Blog Dietfit – Dinh dưỡng, giảm cân & sống khỏe",
            "description": "Kiến thức dinh dưỡng, cách đếm calo, giảm cân bền vững và thói quen sống khỏe — được viết từ trải nghiệm thật bởi đội ngũ Dietfit.",
            "og_title": "Blog Dietfit — Ăn hiểu hơn, sống nhẹ hơn",
            "og_description": "Kiến thức dinh dưỡng, vận động và những câu chuyện thay đổi bền vững từ Dietfit.",
            "image": "/assets/og/og-blog.jpg",
            "image_alt": "Blog Dietfit",
        },
        "en": {
            "path": "/en/blog/",
            "file": "en/blog/index.html",
            "title": "Dietfit Blog – Nutrition, Weight Loss & Healthy Habits",
            "description": "Practical notes on nutrition, calorie counting, sustainable weight loss and healthy habits — written from real experience by the Dietfit team.",
            "og_title": "Dietfit Blog — Eat smarter, live lighter",
            "og_description": "Nutrition, movement and stories of lasting change from Dietfit.",
            "image": "/assets/og/og-blog.jpg",
            "image_alt": "Dietfit Blog",
        },
    },
}

UI = {
    "vi": {
        "home": "Trang chủ", "blog": "Blog", "by": "Bởi", "blog_name": "Blog Dietfit",
        "post_suffix": " | Dietfit", "team": "Đội ngũ Dietfit",
    },
    "en": {
        "home": "Home", "blog": "Blog", "by": "By", "blog_name": "Dietfit Blog",
        "post_suffix": " | Dietfit", "team": "Dietfit Team",
    },
}


def url(path):
    return SITE + path


def org_node():
    return {
        "@type": "Organization",
        "@id": SITE + "/#organization",
        "name": "Dietfit",
        "url": SITE + "/",
        "logo": {"@type": "ImageObject", "url": LOGO, "width": 192, "height": 192},
        "email": "marketing@c0x12c.com",
        "sameAs": SAME_AS,
    }


def website_node(lang):
    return {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "url": SITE + "/",
        "name": "Dietfit",
        "inLanguage": ["vi", "en"],
        "publisher": {"@id": SITE + "/#organization"},
    }


def breadcrumb(items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url(path)}
            for i, (name, path) in enumerate(items)
        ],
    }


def head_block(lang, meta, alternates, jsonld, og_type="website", extra=""):
    """alternates: dict lang -> path (vi, en)."""
    canonical = url(meta["path"])
    other = "en" if lang == "vi" else "vi"
    lines = [
        "<!-- SEO:START — sinh bởi tools/build.py, đừng sửa tay -->",
        f"<title>{esc(meta['title'])}</title>",
        f'<meta name="description" content="{esc(meta["description"])}">',
        '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
        f'<link rel="canonical" href="{canonical}">',
        f'<link rel="alternate" hreflang="vi" href="{url(alternates["vi"])}">',
        f'<link rel="alternate" hreflang="en" href="{url(alternates["en"])}">',
        f'<link rel="alternate" hreflang="x-default" href="{url(alternates["vi"])}">',
        f'<meta name="theme-color" content="{THEME}">',
        f'<meta name="apple-itunes-app" content="app-id={APP_STORE_ID}">',
        f'<meta property="og:type" content="{og_type}">',
        '<meta property="og:site_name" content="Dietfit">',
        f'<meta property="og:locale" content="{LOCALE[lang]}">',
        f'<meta property="og:locale:alternate" content="{LOCALE[other]}">',
        f'<meta property="og:url" content="{canonical}">',
        f'<meta property="og:title" content="{esc(meta.get("og_title", meta["title"]))}">',
        f'<meta property="og:description" content="{esc(meta.get("og_description", meta["description"]))}">',
        f'<meta property="og:image" content="{url(meta["image"])}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(meta["image_alt"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(meta.get("og_title", meta["title"]))}">',
        f'<meta name="twitter:description" content="{esc(meta.get("og_description", meta["description"]))}">',
        f'<meta name="twitter:image" content="{url(meta["image"])}">',
    ]
    if extra:
        lines.append(extra)
    data = json.dumps({"@context": "https://schema.org", "@graph": jsonld}, ensure_ascii=False, indent=1)
    data = data.replace("</", "<\\/")
    lines.append(f'<script type="application/ld+json">\n{data}\n</script>')
    lines.append("<!-- SEO:END -->")
    return "\n  ".join(lines)


# Các thẻ cũ sẽ bị gỡ khỏi <head> trước khi chèn khối SEO mới.
STRIP = [
    r"<!-- SEO:START.*?<!-- SEO:END -->\s*",
    r"<title>.*?</title>\s*",
    r'<meta\s+name="description"[^>]*>\s*',
    r'<meta\s+name="robots"[^>]*>\s*',
    r'<meta\s+name="theme-color"[^>]*>\s*',
    r'<meta\s+name="apple-itunes-app"[^>]*>\s*',
    r'<meta\s+property="og:[^"]*"[^>]*>\s*',
    r'<meta\s+name="twitter:[^"]*"[^>]*>\s*',
    r'<link\s+rel="canonical"[^>]*>\s*',
    r'<link\s+rel="alternate"\s+hreflang[^>]*>\s*',
    r"<!-- Open Graph -->\s*",
    r"<!-- X -->\s*",
]


def inject(page_html, block):
    head_end = page_html.index("</head>")
    head, rest = page_html[:head_end], page_html[head_end:]
    for pattern in STRIP:
        head = re.sub(pattern, "", head, flags=re.S | re.I)
    m = re.search(r'<meta\s+name="viewport"[^>]*>', head)
    assert m, "missing viewport meta"
    head = head[: m.end()] + "\n  " + block + head[m.end():]
    return head + rest


# --------------------------------------------------------------------------
# Trang chủ: FAQ lấy trực tiếp từ HTML để luôn khớp với nội dung hiển thị.
# --------------------------------------------------------------------------
def faq_from_html(page_html):
    items = re.findall(r"<summary>(.*?)<span[^>]*></span></summary>\s*<p>(.*?)</p>", page_html, re.S)
    clean = lambda s: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()
    return [
        {"@type": "Question", "name": clean(q), "acceptedAnswer": {"@type": "Answer", "text": clean(a)}}
        for q, a in items
    ]


def build_home(lang):
    meta = PAGES["home"][lang]
    path = ROOT / meta["file"]
    src = path.read_text()
    # H1 gồm 2 dòng <span>; thêm khoảng trắng để Google không đọc dính chữ.
    src = re.sub(r'(<h1 class="dietfit-hero-heading"><span>[^<]*</span>)(<span>)', r"\1 \2", src)
    app = {
        "@type": "MobileApplication",
        "@id": SITE + "/#app",
        "name": "Dietfit AI: Calorie Tracker",
        "operatingSystem": "iOS",
        "applicationCategory": "HealthApplication",
        "description": meta["description"],
        "url": url(meta["path"]),
        "downloadUrl": APP_STORE,
        "installUrl": APP_STORE,
        "image": LOGO,
        "inLanguage": lang,
        "publisher": {"@id": SITE + "/#organization"},
    }
    webpage = {
        "@type": "WebPage",
        "@id": url(meta["path"]) + "#webpage",
        "url": url(meta["path"]),
        "name": meta["title"],
        "description": meta["description"],
        "inLanguage": lang,
        "isPartOf": {"@id": SITE + "/#website"},
        "about": {"@id": SITE + "/#app"},
        "primaryImageOfPage": url(meta["image"]),
    }
    graph = [org_node(), website_node(lang), webpage, app]
    faq = faq_from_html(src)
    if faq:
        graph.append({"@type": "FAQPage", "@id": url(meta["path"]) + "#faq", "inLanguage": lang, "mainEntity": faq})
    alts = {k: v["path"] for k, v in PAGES["home"].items()}
    block = head_block(lang, meta, alts, graph)
    path.write_text(inject(src, block))


def build_about(lang):
    meta = PAGES["about"][lang]
    path = ROOT / meta["file"]
    src = path.read_text()
    src = re.sub(r'<meta name="generator" content="Framer[^"]*">\s*', "", src)
    home = PAGES["home"][lang]["path"]
    graph = [
        org_node(),
        {
            "@type": "AboutPage",
            "@id": url(meta["path"]) + "#webpage",
            "url": url(meta["path"]),
            "name": meta["title"],
            "description": meta["description"],
            "inLanguage": lang,
            "isPartOf": {"@id": SITE + "/#website"},
            "about": {"@id": SITE + "/#organization"},
            "primaryImageOfPage": url(meta["image"]),
        },
        breadcrumb([(UI[lang]["home"], home), (meta["title"].split(" – ")[0], meta["path"])]),
    ]
    alts = {k: v["path"] for k, v in PAGES["about"].items()}
    path.write_text(inject(src, head_block(lang, meta, alts, graph)))


# --------------------------------------------------------------------------
# Blog
# --------------------------------------------------------------------------
def summary(p, limit=158):
    """Meta description cho bài viết: sapo + câu mở đầu, cắt gọn theo từ."""
    first = next((t for k, t in p["body"] if k == "p"), "")
    text = (p["deck"] + " " + first).strip()
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rsplit(" ", 1)[0].rstrip(",;:–—.")
    return cut + "…"


def post_path(lang, slug):
    return ("/en" if lang == "en" else "") + f"/blog/{slug}/"


def card(lang, post, eager=False):
    p = post[lang]
    loading = ' loading="eager" fetchpriority="high"' if eager else ' loading="lazy"'
    return (
        f'<a class="dietfit-blog-card" href="{post_path(lang, post["slug"])}">'
        f'<div class="dietfit-blog-card-media"><img src="{post["image"]}" alt="" width="822" height="616" decoding="async"{loading}></div>'
        f'<div class="dietfit-blog-card-meta"><time datetime="{post["datePublished"]}">{esc(p["date"])}</time></div>'
        f'<h3>{esc(p["title"])}</h3>'
        f'<div class="dietfit-blog-card-author"><img src="/assets/images/dietfit-app-icon-192.png" alt="" width="24" height="24"><span>{UI[lang]["by"]} {esc(p["author"])}</span></div></a>'
    )


def absolutize(src, base):
    """Đổi đường dẫn tương đối của template sang tuyệt đối từ root."""
    src = src.replace('href="../', 'href="/').replace('src="../', 'src="/')
    src = src.replace('href="./"', f'href="{base}"')
    return src


def blog_template(lang, kind):
    """kind = 'index' | 'post'. Template là file blog gốc (VI) hoặc bản EN."""
    prefix = "en/" if lang == "en" else ""
    name = "_template-index.html" if kind == "index" else "_template-post.html"
    return (ROOT / "tools" / "templates" / (prefix.replace("/", "-") + name)).read_text()


def set_lang_switch(src, vi_href, en_href):
    src = re.sub(r'(<a href=")[^"]*(" lang="vi" hreflang="vi")', lambda m: m.group(1) + vi_href + m.group(2), src)
    src = re.sub(r'(<a href=")[^"]*(" lang="en" hreflang="en")', lambda m: m.group(1) + en_href + m.group(2), src)
    return src


def strip_blog_script(src):
    return re.sub(r'\s*<script src="/scripts/dietfit-blog\.js[^"]*"></script>', "", src)


def build_blog(posts, lang):
    meta = PAGES["blog"][lang]
    base = meta["path"]
    home = PAGES["home"][lang]["path"]

    # ---- Trang danh sách
    src = absolutize(blog_template(lang, "index"), base)
    grid = "".join(card(lang, p, i == 0) for i, p in enumerate(posts))
    src = re.sub(r'<div class="dietfit-blog-grid"[^>]*>.*?</div>(\s*</section>)',
                 lambda m: f'<div class="dietfit-blog-grid">{grid}</div>' + m.group(1), src, count=1, flags=re.S)
    src = set_lang_switch(src, PAGES["blog"]["vi"]["path"], PAGES["blog"]["en"]["path"])
    src = strip_blog_script(src)
    graph = [
        org_node(),
        {
            "@type": "Blog",
            "@id": url(base) + "#blog",
            "url": url(base),
            "name": UI[lang]["blog_name"],
            "description": meta["description"],
            "inLanguage": lang,
            "publisher": {"@id": SITE + "/#organization"},
            "blogPost": [
                {"@type": "BlogPosting", "headline": p[lang]["title"], "url": url(post_path(lang, p["slug"])),
                 "datePublished": p["datePublished"], "image": url(p["image"])}
                for p in posts
            ],
        },
        breadcrumb([(UI[lang]["home"], home), (UI[lang]["blog"], base)]),
    ]
    alts = {k: v["path"] for k, v in PAGES["blog"].items()}
    out = ROOT / meta["file"]
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(inject(src, head_block(lang, meta, alts, graph)))

    # ---- Từng bài viết
    for index, post in enumerate(posts):
        p = post[lang]
        path = post_path(lang, post["slug"])
        src = absolutize(blog_template(lang, "post"), base)
        src = src.replace(' data-blog-post>', '>')
        src = src.replace('<article data-post-content>', '<article>')
        src = src.replace('<p class="dietfit-post-meta" data-post-meta></p>',
                          f'<p class="dietfit-post-meta"><time datetime="{post["datePublished"]}">{esc(p["date"])}</time></p>')
        src = src.replace('<h1 data-post-title></h1>', f'<h1>{esc(p["title"])}</h1>')
        src = re.sub(r'<strong data-post-author>[^<]*</strong>', f'<strong>{esc(p["author"])}</strong>', src)
        src = src.replace('<img data-post-image src="" alt="">',
                          f'<img src="{post["image"]}" alt="{esc(p["title"])}" width="822" height="616" fetchpriority="high">')
        body = []
        for kind, text in p["body"]:
            tag = {"h2": "h2", "quote": "blockquote"}.get(kind, "p")
            body.append(f"<{tag}>{esc(text)}</{tag}>")
        src = src.replace('<div class="dietfit-post-body" data-post-body></div>',
                          '<div class="dietfit-post-body">' + "".join(body) + "</div>")
        related = [posts[(index + k) % len(posts)] for k in (1, 2, 3)]
        src = src.replace('<div class="dietfit-blog-grid" data-related-posts></div>',
                          '<div class="dietfit-blog-grid">' + "".join(card(lang, r) for r in related) + "</div>")
        src = set_lang_switch(src, post_path("vi", post["slug"]), post_path("en", post["slug"]))
        src = strip_blog_script(src)
        pmeta = {
            "path": path,
            "title": p["title"] + UI[lang]["post_suffix"],
            "description": summary(p),
            "og_title": p["title"],
            "og_description": p["deck"],
            "image": f"/assets/og/og-blog-{index + 1:02d}.jpg",
            "image_alt": p["title"],
        }
        is_team = p["author"] in ("Đội ngũ Dietfit", "Dietfit Team", "Cộng đồng Dietfit", "Dietfit Community")
        author = {"@id": SITE + "/#organization"} if is_team else {"@type": "Person", "name": p["author"]}
        graph = [
            org_node(),
            {
                "@type": "BlogPosting",
                "@id": url(path) + "#article",
                "mainEntityOfPage": url(path),
                "url": url(path),
                "headline": p["title"],
                "description": summary(p),
                "articleSection": p["category"],
                "inLanguage": lang,
                "datePublished": post["datePublished"],
                "dateModified": post.get("dateModified", post["datePublished"]),
                "image": [url(post["image"]), url(pmeta["image"])],
                "author": author,
                "publisher": {"@id": SITE + "/#organization"},
                "isPartOf": {"@id": url(base) + "#blog"},
            },
            breadcrumb([(UI[lang]["home"], home), (UI[lang]["blog"], base), (p["title"], path)]),
        ]
        extra = (f'<meta property="article:published_time" content="{post["datePublished"]}">\n  '
                 f'<meta property="article:section" content="{esc(p["category"])}">')
        alts = {"vi": post_path("vi", post["slug"]), "en": post_path("en", post["slug"])}
        out = ROOT / path.strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(inject(src, head_block(lang, pmeta, alts, graph, og_type="article", extra=extra)))


# --------------------------------------------------------------------------
# sitemap.xml + robots.txt
# --------------------------------------------------------------------------
def build_sitemap(posts):
    groups = [(PAGES[k]["vi"]["path"], PAGES[k]["en"]["path"], None) for k in ("home", "about", "blog")]
    groups += [(post_path("vi", p["slug"]), post_path("en", p["slug"]), p.get("dateModified", p["datePublished"])) for p in posts]
    rows = []
    for vi, en, lastmod in groups:
        for loc in (vi, en):
            rows.append("  <url>")
            rows.append(f"    <loc>{url(loc)}</loc>")
            if lastmod:
                rows.append(f"    <lastmod>{lastmod}</lastmod>")
            rows.append(f'    <xhtml:link rel="alternate" hreflang="vi" href="{url(vi)}"/>')
            rows.append(f'    <xhtml:link rel="alternate" hreflang="en" href="{url(en)}"/>')
            rows.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url(vi)}"/>')
            rows.append("  </url>")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
           + "\n".join(rows) + "\n</urlset>\n")
    (ROOT / "sitemap.xml").write_text(xml)
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\n"
        f"Sitemap: {SITE}/sitemap.xml\n"
    )


def main():
    posts = json.loads((ROOT / "content" / "blog-posts.json").read_text())
    for lang in ("vi", "en"):
        build_home(lang)
        build_about(lang)
        build_blog(posts, lang)
    build_sitemap(posts)
    print("Built", 6 + 2 * len(posts), "pages + sitemap.xml + robots.txt")


if __name__ == "__main__":
    main()
