# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Cấu trúc

- `index.html`: nội dung và thứ tự các section.
- `blog/`: trang danh sách và trang chi tiết bài viết.
- `styles/`: typography, hero, section và social feed.
- `scripts/`: Rive hero, smooth scroll, carousel, TikTok feed và dữ liệu Blog.
- `assets/`: hình ảnh, font và file Rive của Dietfit.
- `vendor/`: runtime Rive và Lenis đã được lưu cục bộ.
- `en/`: bản tiếng Anh (US) của Home, About và Blog. Khi sửa nội dung trang tiếng Việt, nhớ sửa cả file tương ứng trong `en/`.
- Nút chuyển ngôn ngữ: `.dietfit-lang-switch` trong header và menu mobile, style ở `styles/dietfit-lang-switch.css`.

## Rive hero

- Ảnh bên trong các file `.riv` đã được nén lại sang WebP (giữ nguyên kích thước): ~6.3MB → ~1.25MB. Nếu export lại file từ Rive, hãy nén ảnh trước khi đưa vào Rive (hoặc bật nén trong Rive Editor), rồi đổi `?v=` trong `scripts/dietfit-hero.js` và thẻ preload trong `<head>`.
- Các file `*-en.riv` giống hệt bản gốc, chỉ khác dòng chữ đang tính calo. Export lại bản VI thì cần tạo lại bản EN.
- `assets/hero/dietfit-hero-poster*.webp` là khung hình đầu của Rive, hiện ngay khi trang mở trong lúc Rive đang tải.

## Chạy local

Mở terminal tại thư mục dự án và chạy:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

Không mở trực tiếp `index.html` bằng `file://`, vì asset dùng đường dẫn tuyệt đối từ root và Rive cần được tải qua HTTP.
# prj-dietfit-landingpage

## SEO & blog

Domain chính thức: `https://dietfit.health` (khai báo trong `tools/build.py`).

- Nội dung blog (VI + EN) nằm trong `content/blog-posts.json`. Mỗi bài có `slug`, `datePublished` và hai bản `vi` / `en`.
- Sau khi sửa blog, đổi title/description, hoặc sửa FAQ ở trang chủ, chạy:

  ```bash
  python3 tools/build.py
  ```

  Lệnh này sinh lại các trang blog tĩnh (`blog/<slug>/`, `en/blog/<slug>/`), chèn khối SEO vào `<head>` của mọi trang (title, description, canonical, hreflang, Open Graph, JSON-LD), và ghi lại `sitemap.xml`, `robots.txt`.
- Title/description của Home, About, Blog nằm trong `PAGES` ở `tools/build.py`. Không sửa tay trong khối `<!-- SEO:START --> … <!-- SEO:END -->`, vì lần build sau sẽ ghi đè.
- Giao diện trang blog lấy từ `tools/templates/`.
- Ảnh chia sẻ mạng xã hội (1200×630) nằm trong `assets/og/`.
- Link cũ `blog/post.html?slug=…` được chuyển 301 sang URL mới (xem `vercel.json`).
- Sau khi deploy: vào Google Search Console → thêm property `dietfit.health` → gửi `https://dietfit.health/sitemap.xml`.
