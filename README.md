# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Cấu trúc

- `index.html`: nội dung và thứ tự các section.
- `blog/`: trang danh sách và trang chi tiết bài viết.
- `styles/`: typography, hero, section và social feed.
- `scripts/`: Rive hero, smooth scroll, carousel, TikTok feed và dữ liệu Blog.
- `assets/`: hình ảnh, font và file Rive của Dietfit.
- `vendor/`: runtime Rive và Lenis đã được lưu cục bộ.

## Chạy local

Mở terminal tại thư mục dự án và chạy:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

Không mở trực tiếp `index.html` bằng `file://`, vì asset dùng đường dẫn tuyệt đối từ root và Rive cần được tải qua HTTP.
# prj-dietfit-landingpage
