# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Cấu trúc

- `index.html`: nội dung và thứ tự các section.
- `blog/`: trang danh sách và trang chi tiết bài viết.
- `styles/`: typography, hero, section và social feed.
- `scripts/`: Rive hero, smooth scroll, carousel, TikTok feed và dữ liệu Blog.
- `assets/`: hình ảnh, font và file Rive của Dietfit.
- `vendor/`: runtime Rive và Lenis đã được lưu cục bộ.
- `en/`: bản tiếng Anh (US) của Home, About và Blog. Khi sửa nội dung trang tiếng Việt, nhớ sửa cả file tương ứng trong `en/`. Bài blog EN nằm trong `postsEn` ở `scripts/dietfit-blog.js`, dùng chung `slug` với bản VI.
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
