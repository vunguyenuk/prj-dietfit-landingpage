# Dietfit Landing Page

Landing page tĩnh của Dietfit, có thể mở và chỉnh sửa trực tiếp bằng Visual Studio Code.

## Giao diện hiện tại — 27/10/2026

Trang chủ đã thay bằng thiết kế từ `dietfit-health-2026-10-27T03-18-56-616Z` do bạn cung cấp:

- `/` và `/en/`: giao diện tiếng Anh mới, giữ hero Rive, các lớp UI/scan, video demo cuộn, ảnh tiến độ, integrations, carousel, FAQ và footer của source.
- `/vi/`: giữ bản tiếng Việt cũ, truy cập qua nút VI.
- `/en/benchmarks/`: tab Benchmarks tiếng Anh từ source `dev-dietfit-health-2026-10-27T04-05-53-327Z`, gồm so sánh ảnh/text, ảnh món ăn tương tác, phương pháp kiểm thử và FAQ. Tab có trong menu desktop/mobile của các trang EN.
- Card “Keep the streak, build the habit.” dùng ảnh người và các widget nổi theo ảnh tham khảo; đã bỏ viền trắng lớn quanh người, giữ widget tổng kết streak bên dưới. Chỉnh markup tại `content/components/streak-art.html`, style tại `styles/dietfit-streak-card.css`; importer đồng bộ HTML và React qua `tools/streak_card.py`. Ảnh nền và prompt nằm trong `assets/cards/streak-reference/`.
- Card “Your food diary, day by day” dùng nền xanh lam nhạt theo màu áo blazer, ảnh cutout người dùng và các thẻ bữa ăn theo ảnh tham khảo; đã bỏ chữ lớn phía sau. Markup tại `content/components/diary-card.html`, style tại `styles/dietfit-diary-card.css`; `tools/diary_card.py` đồng bộ HTML/React khi import. Ảnh có alpha và prompt nằm trong `assets/cards/diary-reference/`.
- Card “Fasting, made to fit your life.” theo ảnh tham khảo người dùng áo tím đưa smartwatch về phía trước: nền lavender nhạt theo màu áo, vùng nét quanh đồng hồ và thẻ fasting nổi; đã bỏ chữ lớn phía sau. Markup tại `content/components/fasting-card.html`, style tại `styles/dietfit-fasting-card.css`; `tools/fasting_card.py` đồng bộ HTML/React. Ảnh có alpha và prompt nằm trong `assets/cards/fasting-reference/`. Giữ mô tả ngắn hai dòng đã chỉnh.
- Card “Smart progress charts” theo ảnh tham khảo điện thoại cầm tay nghiêng trên nền xám, thu nhỏ vùng ảnh còn 90% chiều rộng để chừa lề trái/phải 5%. Markup tại `content/components/progress-card.html`, style tại `styles/dietfit-progress-card.css`; `progress-card-controller.js` trong cùng thư mục component ghép phối cảnh giao diện vào màn hình và tự cập nhật khi đổi kích thước. `tools/progress_card.py` đồng bộ HTML/React; ảnh và prompt nằm trong `assets/cards/progress-reference/`.
- Các card Reminder, Together, Challenge và Apple Health dùng ảnh tham khảo tương ứng: thông báo trong suốt trên ảnh người dùng điện thoại xanh; hai người bạn dùng điện thoại trên lối đi trong vườn với widget bữa ăn You/Mom và thông báo chia sẻ từ source cũ; cầu thủ trong khung trắng với tiến độ và Fitpoints; hai người vận động trên sân với trạng thái Apple Health. Chỉnh markup trong `content/components/{reminder,together,challenge,apple-health}-card.html` và style trong `styles/dietfit-photo-cards.css`. `tools/photo_cards.py` đồng bộ cả HTML/React khi import. Ảnh tối ưu và prompt lưu ở các thư mục `assets/cards/*-reference/` tương ứng; bản Together mới dùng `friends-garden.webp` và `friends-source.md`.
- Card “A reward for discipline” dùng ảnh sân tennis xanh, giữ tiêu đề/mô tả tiếng Anh màu trắng phía trên nhân vật. Dùng đúng widget vòng tròn Yesterday/Today từ `landing/v3/cards/figma-sync/card-4.webp`, crop bằng CSS theo tọa độ source; mỗi widget rộng 25%, đặt lệch hai bên để không che vóc dáng. Markup tại `content/components/reward-card.html`, style chung tại `styles/dietfit-photo-cards.css`; `tools/photo_cards.py` đồng bộ HTML/React. Ảnh và prompt ở `assets/cards/reward-reference/`.
- Trang Benchmarks theo reference mới: hero chỉ có chữ; bảng so sánh có logo app và chấm điểm hover/chạm; phần Same plates có ảnh món tương tác và đồng hồ accuracy. Màu sắc dùng gradient Dietfit gốc từ Figma: khối so sánh cam–đen, khối ví dụ cam–amber sáng; bỏ viền cam quanh card. Asset tại `assets/brand/production/`; giữ bố cục/tương tác từ reference. Số liệu nguồn giữ nguyên: ảnh dùng điểm trung bình 3 app, text dùng 13 nhóm món. Style mới tại `styles/dietfit-benchmark-reference.css`, tương tác `scripts/dietfit-benchmark-charts.js`, dữ liệu `content/benchmark-chart-data.json`, render `tools/benchmark_charts.py`; `tools/benchmark_overview.py` đồng bộ HTML/Flight qua `tools/import_benchmarks.py`. Giữ React text separators, vị trí PlateScan và link `/en/benchmarks/#...`.
- About Us dùng lại video Deep Scan thật của Home (chicken shish kebab/rice pilaf). Chỉnh template `content/components/about-deepscan.html`, chạy `python3 tools/update_about_deepscan.py` để đồng bộ hai bản ngôn ngữ. Có poster, giảm chuyển động, tự dừng ngoài viewport và nút play/pause.
- About và Blog tiếp tục dùng các trang hiện có. Hai trang chính sách EN được lưu nguyên nội dung từ `https://dietfit.health/en/privacy-policy` và `https://dietfit.health/en/terms-of-service` ngày 27/10/2026 để các liên kết footer hoạt động cục bộ.
- Website vẫn là HTML/CSS/JS tĩnh, không cần build Next.js. Các component React và controller chuyển động có sẵn trong bundle của source tiếp tục chạy.
- Ảnh, font, Rive và video được lưu trong `landing/`, `about/`, `_next/static/`. Các ảnh `/_next/image?...` và asset có query đã chuyển thành file cục bộ; không cần image optimizer hoặc Capture Studio server.
- Bỏ script chọn section/replay, điều hướng RSC/prefetch và cấu hình analytics đi kèm capture. Điều hướng About/Blog tải trang HTML bình thường.
- Thư mục source capture được giữ để đối chiếu, không đưa vào Git hoặc deploy.

Chạy đúng project này:

```bash
python3 -m http.server 4180 --bind 127.0.0.1 --directory /Users/vunguyen/Desktop/prj-dietfit-landingpage
```

Mở `http://127.0.0.1:4180/`, `/en/` hoặc `/vi/`. Deploy Vercel từ root `prj-dietfit-landingpage`, không cần lệnh build frontend.

Nếu muốn nhập lại từ bản source gốc:

```bash
python3 tools/import-landing-v3.py
# Hoặc truyền thư mục capture mới cùng định dạng:
python3 tools/import-landing-v3.py /duong/dan/toi/capture
```

Importer kiểm tra chữ ký bundle trước khi sửa loader/điều hướng; nếu source đổi phiên bản, cần cập nhật chữ ký trong script. Nhập lại sẽ ghi đè `/` và `/en/` bằng source; không ghi đè bản VI đã giữ trong `/vi/`.

Nhập lại trang Benchmarks bằng `python3 tools/import_benchmarks.py`. Asset và runtime của trang này nằm riêng trong `assets/benchmarks-page/` để giữ tương thích với bundle của Home. Các script import Home và build Blog đều giữ lại liên kết Benchmarks trong menu.

`python3 tools/build.py` vẫn sinh Blog, sitemap và SEO cho các trang cũ; bỏ qua SEO của Home EN mới để giữ khớp dữ liệu hydration. Canonical của `/` trỏ về `/en`; sitemap có `/en/` và `/vi/`.

## Cấu trúc

- `index.html`, `en/index.html`: giao diện mới và dữ liệu hydration từ source.
- `landing/`, `about/`, `_next/static/`: asset và bundle của giao diện mới.
- `tools/import-landing-v3.py`: quy trình nhập source lặp lại được.
- `vi/index.html`, `styles/`, `scripts/`, `assets/`, `vendor/`: giao diện VI và các trang cũ.
- `blog/`, `about-us/`, `en/blog/`, `en/about-us/`: nội dung hiện có.
- `en/privacy-policy/`, `en/terms-of-service/`: chính sách đang công bố của Dietfit, giữ nguyên nội dung.

## Rive hero của giao diện cũ

- Ảnh bên trong các file `.riv` đã được nén lại sang WebP (giữ nguyên kích thước): ~6.3MB → ~1.25MB. Nếu export lại file từ Rive, hãy nén ảnh trước khi đưa vào Rive (hoặc bật nén trong Rive Editor), rồi đổi `?v=` trong `scripts/dietfit-hero.js` và thẻ preload trong `<head>`.
- Bản EN trước 27/10 dùng `dietfit-hero-us-en.riv` và `dietfit-hero-responsive-us-en.riv` (~1.45MB/file), cùng poster `*-us-en.webp`. Các file `*-en.riv` cũ vẫn được giữ làm nguồn.
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

Đồng bộ card Home VI bằng `python3 tools/localize_home_cards.py`: dùng 10 card hiện tại của EN, dịch từ `content/locales/home-cards-vi.json`, giữ bố cục/ảnh và widget native tiếng Việt. Home importer tự chạy bước này. UI khoa học/phần thưởng có chữ baked trong ảnh được thay bằng lớp HTML tiếng Việt, không sửa ảnh; biểu đồ cân nặng dùng kg. Các phần còn lại của Home VI được giữ.
