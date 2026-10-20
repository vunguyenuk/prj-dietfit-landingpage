# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Phiên bản đang dùng — 20/10/2026

Home VI và EN theo ba nguồn rõ ràng:

- **Design version 1** (`909d84a`): nền trắng, màu cam `#FE692E`, chữ Be Vietnam Pro, carousel ảnh người thật, social/community, bố cục FAQ và ảnh/footer cuối trang.
- **Gaia**: bố cục giới thiệu tính năng xen kẽ text/điện thoại; Sara xuất hiện ở mép khối thay vì lặp lại trong nhiều thẻ trang trí. Không dùng asset hoặc mã Gaia.
- **V2** (`runner-camera-v87`): lấy trực tiếp geometry và renderer của Scan, Sara, Meal Plan, Home/Connected Health và widgets. Cuộn trang điều khiển nội dung trong UI; không thay bằng video tự chạy hay chỉ xoay cả điện thoại. Không dùng tranh cổ điển hoặc nhân vật cổ điển.

**Hero Rive giữ nguyên**: HTML intro/Rive, `scripts/dietfit-hero.js`, `styles/dietfit-hero.css`, toàn bộ file `.riv` và poster không thay đổi. Bạn vẫn có thể thay file export từ Rive như hướng dẫn bên dưới.

- `styles/dietfit-features.css`: bố cục feature theo design system v1.
- `styles/dietfit-feature-visuals.css`: ảnh bối cảnh rõ nét và một chi tiết UI dễ đọc trong cột nội dung. Bỏ các lớp ảnh/phủ mờ và thẻ nổi trùng lặp; giữ điện thoại là điểm nhìn chính. Thẻ Meal Plan đồng bộ với Swap/Tick; chi tiết Scan/Sara theo tiến độ demo.
- `styles/dietfit-native-ui.css`: CSS app v2 được giới hạn trong `.df-native`, giữ font native app riêng.
- `scripts/dietfit-native-ui.js`: renderer nội dung và controller scroll cho các feature. Dữ liệu mẫu chỉ nằm trong trình duyệt; không gọi AI hoặc ghi vào tài khoản.
- `assets/product/v2/`: chỉ những ảnh món ăn, mascot, font app và icon cần dùng. Không có hình nền tranh.
- Các file `dietfit-product.*` và `dietfit-ui-motion.*` của lượt trước không được Home tải nữa. Lịch sử Git giữ các mốc cũ để phục hồi/đối chiếu.
- Bấm một bước demo hoặc một control trong app sẽ ưu tiên thao tác của bạn; nút “Chạy lại demo theo cuộn” khôi phục tour và dữ liệu mẫu. Scan có các sheet từ camera đến kết quả; sửa gram cập nhật kcal và macro theo tỉ lệ từ dữ liệu minh hoạ (mặc định 558 kcal). Điểm bữa ăn được ghi rõ là điểm của mẫu ban đầu. Sara gõ câu hỏi, gửi ảnh, hiện phản hồi và summary theo scroll. Meal Plan đổi món/tick; Home chọn và log bữa tối.
- Trên mobile, phần mô tả cuộn lên trước rồi điện thoại được giữ ở kích thước dễ xem. Reduced motion giữ các màn hình và nút chọn bước, không chạy chuỗi chuyển động.

Lượt sửa theo audit (`v1-feature-audit-v8`): chữ phụ dùng màu #625d6b (6.37:1 trên trắng), nút chọn bước tối thiểu 44px, giảm chiều dài các chapter và đổi phần giải thích theo bước. Resume hủy timer đổi món đang chờ và reset chế độ thao tác trong từng renderer. Scan không còn hướng dẫn vuốt xóa/Edit with AI chưa được triển khai. Các vùng bấm trong điện thoại được mở rộng theo tỉ lệ scale mà giữ nguyên hình dáng control.

Đã kiểm tra logic DOM cho VI/EN, cả scroll và reduced motion, kiểm tra build/asset/ARIA và hash hero. Kiểm tra DOM dùng kích thước giả lập để kiểm tra trạng thái, không thay cho render browser. Chưa xác nhận lại hình ảnh responsive, hitbox thực tế hoặc hiệu năng bằng browser trong lượt này vì browser control đang tắt trong Work settings.

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
