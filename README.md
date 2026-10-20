# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Phiên bản đang dùng — 20/10/2026

Home VI và EN theo ba nguồn rõ ràng:

- **Design version 1** (`909d84a`): nền trắng, màu cam `#FE692E`, chữ Be Vietnam Pro, carousel ảnh người thật, social/community, bố cục FAQ và ảnh/footer cuối trang.
- **Gaia**: bố cục giới thiệu tính năng xen kẽ text/điện thoại; Sara xuất hiện ở mép khối thay vì lặp lại trong nhiều thẻ trang trí. Không dùng asset hoặc mã Gaia.
- **V2** (`runner-camera-v87`): lấy trực tiếp geometry và renderer của Scan, Sara, Meal Plan, Home/Connected Health và widgets. Cuộn trang điều khiển nội dung trong UI; không thay bằng video tự chạy hay chỉ xoay cả điện thoại. Không dùng tranh cổ điển hoặc nhân vật cổ điển.

**Hero Rive**: bản VI dùng nguyên file, poster và chuyển động hiện tại. Bản EN có bộ ảnh món ăn/UI riêng cho thị trường Mỹ; chỉ thay ảnh nhúng, giữ toàn bộ object timeline/state machine của export gốc. Loader chọn theo ngôn ngữ và breakpoint. CSS hero và Rive runtime không thay đổi.

- `styles/dietfit-features.css`: bố cục feature theo design system v1.
- `styles/dietfit-native-ui.css`: CSS app v2 được giới hạn trong `.df-native`, giữ font native app riêng.
- `scripts/dietfit-native-ui.js`: renderer nội dung và controller scroll cho các feature. Dữ liệu mẫu chỉ nằm trong trình duyệt; không gọi AI hoặc ghi vào tài khoản.
- `assets/product/v2/`: chỉ những ảnh món ăn, mascot, font app và icon cần dùng. Không có hình nền tranh.
- Các file `dietfit-product.*` và `dietfit-ui-motion.*` của lượt trước không được Home tải nữa. Lịch sử Git giữ các mốc cũ để phục hồi/đối chiếu.
- Cuộn để xem nội dung trong app. Các thanh chọn bước 01–04 và hướng dẫn lặp lại bên ngoài đã bỏ; thao tác trực tiếp trong app sẽ tạm dừng tour, khi đó mới hiện nút “Tiếp tục theo cuộn”. Chú thích dữ liệu mẫu chỉ xuất hiện một lần cuối nhóm feature. Scan có các sheet từ camera đến kết quả 558 kcal. Sara gõ câu hỏi, gửi ảnh, hiện phản hồi và summary theo scroll. Meal Plan đổi món/tick; Home chọn và log bữa tối.
- Trên mobile, phần mô tả cuộn lên trước rồi điện thoại được giữ ở kích thước dễ xem. Reduced motion hiển thị các trạng thái nội dung tĩnh và giữ thao tác trong app, không chạy chuỗi chuyển động.

Chạy đúng project này:

```bash
python3 -m http.server 4180 --bind 127.0.0.1 --directory /Users/vunguyen/Desktop/prj-dietfit-landingpage
```

Mở `http://127.0.0.1:4180/` hoặc `/en/`. Cổng **4173** vẫn là bản v2 tham khảo, không phải trang vừa chỉnh. Deploy Vercel từ root `prj-dietfit-landingpage`; đây là trang tĩnh, không cần build frontend.

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
- `/en/` dùng `dietfit-hero-us-en.riv` và `dietfit-hero-responsive-us-en.riv` (~1.45MB/file), cùng poster `*-us-en.webp`. Các file `*-en.riv` cũ vẫn được giữ làm nguồn.
- Bộ US: grilled chicken, quinoa, broccoli, sweet potato, avocado; bối cảnh có salad, salmon bowl, turkey sandwich và yogurt/berries. Toàn bộ card hero dùng tiếng Anh, đơn vị cân nặng lb và nước fl oz. Số dinh dưỡng/điểm/biểu đồ là dữ liệu minh hoạ, không phải kết quả AI thực.
- `assets/hero/us-en/` giữ ảnh nguồn và UI tiếng Anh để bạn đưa lại vào Rive Editor. Các ảnh món ăn được tạo bằng công cụ imagegen tích hợp; card UI dựng bằng code để giữ chữ và số chính xác. `tools/build-rive-us.cjs` dựng card (cần `@napi-rs/canvas`, `sharp`; có thể trỏ `DIETFIT_NODE_MODULES` tới thư mục npm dependencies). `python3 tools/build-rive-us.py` đóng gói ảnh vào hai export US; script xác nhận mọi byte ngoài payload ảnh/độ dài ảnh không thay đổi.
- Khi export lại scene trong Rive: giữ tên asset hoặc cập nhật bảng `REPLACEMENTS` trong script build. File `.riv` là runtime export; source project/state machine vẫn chỉnh trong Rive Editor. Bản VI không bị ghi đè.
- Hai prompt ảnh gốc và vai trò từng asset nằm trong `assets/hero/us-en/prompts.md`. Thư mục source này không deploy; hai file `.riv` US đã nhúng đủ ảnh nên không cần tải source ngoài.
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
