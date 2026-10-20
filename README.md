# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Product story — 20/10/2026

Trang Home VI và EN đã được tổ chức lại theo mạch: hiểu bữa ăn → kiểm tra nguyên liệu → Sara hiểu ngữ cảnh → meal plan → vận động và tiến độ → động lực → video app → cộng đồng → FAQ.

- Giữ theme cam, trắng ấm, Be Vietnam Pro và mascot Sara. Tham khảo cách [0xcal](https://0xcal.app/) giải thích sản phẩm bằng các ví dụ cụ thể; không dùng số liệu accuracy, benchmark, testimonial hoặc cam kết của họ cho Dietfit.
- **Hero Rive được giữ nguyên**: markup intro/Rive, `scripts/dietfit-hero.js`, `styles/dietfit-hero.css`, toàn bộ `.riv` và poster không thay đổi. Bạn vẫn export file Rive thay thế như hướng dẫn bên dưới.
- Nội dung mới nằm trực tiếp trong `index.html` và `en/index.html`, bên dưới comment `PRODUCT STORY`.
- `styles/dietfit-product.css`: bố cục và giao diện phần product story, được scope trong `.dietfit-product`.
- `scripts/dietfit-product.js`: demo Deep Scan (chọn nguyên liệu, sửa gram, lưu thử), hội thoại Sara mẫu, đổi món/log Meal Plan, đổi khoảng thời gian biểu đồ và streak demo. Mọi trạng thái chỉ ở trình duyệt; không gọi AI, không gửi dữ liệu và không ghi vào tài khoản.
- `assets/product/`: mascot và ảnh món ăn được tái sử dụng từ landing v2; ba video app do Dietfit cung cấp, đã cắt đoạn, tắt âm thanh và nén H.264. Video chỉ tải khi người xem bấm phát.
- Các bản demo được ghi rõ là dữ liệu mẫu. Kết quả dinh dưỡng được trình bày là ước tính; Sara không thay thế tư vấn y tế.
- Tài liệu nguồn và giới hạn đối chiếu được ghi trong `content/product-reference.md`.

Preview dự án này riêng với landing v2:

```bash
python3 -m http.server 4180 --bind 127.0.0.1 --directory /Users/vunguyen/Desktop/prj-dietfit-landingpage
```

Mở `http://127.0.0.1:4180/` hoặc `/en/`. Cổng 4173 vẫn dành cho landing v2.

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


## Chuyển động UI theo cuộn

- `styles/dietfit-ui-motion.css`, `scripts/dietfit-ui-motion.js`: chuyển động điện thoại, từng bữa trong Meal Plan và bảng sức khỏe; giữ nguyên theme, ảnh người và mascot.
- V2 chỉ là tham khảo cách scroll trigger, không dùng tranh cổ điển của v2.
- Desktop rộng và cao giữ điện thoại Scan khi cuộn ba bước. Mobile/màn hình thấp cuộn tự nhiên, vẫn có chuyển động nhẹ và đầy đủ nút demo.
- Bấm hoặc chỉnh demo sẽ giành quyền điều khiển từ scroll; `prefers-reduced-motion` tắt chuyển động.
- Hero Rive độc lập, không thay đổi.
