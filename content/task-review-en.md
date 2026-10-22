# Rà soát yêu cầu landing page EN — 21/10/2026

Trạng thái hiện tại sau phản hồi 22:23 và yêu cầu kiểm tra phần bị sót. Các mục dưới đã triển khai; bằng chứng render và kiểm tra mã được ghi riêng để không coi kiểm tra DOM là xác nhận hình ảnh.

| Yêu cầu | Triển khai hiện tại |
| --- | --- |
| Hero cao, top/bottom khoảng 40px (phản hồi 23:15) | Khoảng trên/dưới cap 40px, không tăng theo gutter ngang trên màn hình rộng; mobile giữ gutter nhỏ hơn. Phone tự lớn theo stage, giữ FitHeight an toàn. |
| Không cắt phone và không ghép lệch nền ghế | Một lớp ảnh nền; Rive foreground EN dùng vùng FitHeight an toàn. Timeline/state machine gốc được giữ. |
| Deep Scan trong phone gốc | Overlay 6 contour/4 nhãn theo đúng ô ảnh 344 × 425 bên trong Analytics, chuyển tọa độ từ tư thế hand/bowl; không thêm phone/ảnh thứ hai. |
| UI result theo Figma | Meal Detail 36627:85534 trong file người dùng gửi, native 375 × 812, icon gốc và nút đen. |
| Mascot ló từ cạnh phone, không bị cắt tay | Một ảnh nguyên sau cạnh phone; ló/chào/thu lại trước khi bung UI. |
| Dashboard dùng nền món vừa scan làm mờ | Bỏ nền đen và shell vàng nhạt, title trắng, Meal plan có ba hàng chia phần chiều cao còn lại. |
| Motion hero do scroll | Pin 900svh; capture/scan → chào → budget → chuyển dinh dưỡng → dashboard → hold; hỗ trợ freeze/reverse. |
| Feature layout đối xứng như cũ | Scan/Coach/Health/Plan/Fasting có phone phải/trái/phải/trái/phải. Mascot không chiếm cột phone. |
| Phone feature đồng cỡ | Cùng hệ tọa độ 395 × 832 và hàm fit theo stage. |
| Before/after gọn, giữ người nguyên tỷ lệ | Ảnh gốc 368 × 978; gallery giới hạn 76svh và chiều cao viewport, căn giữa. |
| Có spacing trước Your movement | 160px từ gallery đến introduction; nhịp section khác là 100px. |
| Integration loop | 9 app gồm Apple Health; nghỉ 3,5 giây rồi lặp, pause ngoài viewport/ẩn tab và khi focus link. |
| Hai mascot integration khác nhau | Trái viết sổ/lè lưỡi; phải nghỉ/chào, không ghi chép. Grid cân giữa, không glass target. |
| Container lớn, icon cân đối | Khung trang dùng token chung, icon/scene/phone co giãn theo viewport. |
| Carousel giữa integration và FAQ | 6 artwork gốc + 4 card thói quen theo Notion, giữ scroll/arrow navigation. |
| Tăng nhẹ card theo phản hồi mới nhất | Basis desktop /3, wide /3,6, chiều cao tối đa svh − 160px, tỷ lệ 5:7. Yêu cầu này thay cho 4 card đầy đủ trước đó. |
| Heading nhỏ và đồng bộ | Một stylesheet EN cuối cùng: section 2–2,25rem desktop, card 1,25–1,5rem, weight 600; có scale mobile riêng. |
| Copy Notion | Hero, Scan, Sara, Meal Plan, Fasting và bốn card level 2; Connected Health trước Meal Plan. |
| Footer CTA cao hơn | Nội dung CTA được nâng theo stylesheet EN. |

## Phần còn sót đã sửa trong lượt cuối

- Bốn visual card thói quen đặt absolute từ 37% chiều cao, có nguy cơ đè mô tả dài: đổi sang hai hàng grid, chữ lấy chiều cao tự nhiên, visual co theo vùng còn lại và giữ tỷ lệ ảnh/type.
- Footer EN có Privacy/Terms trỏ `#`: nối đến URL chính thức đã mở xác minh: [Privacy Policy](https://dietfit.health/en/privacy-policy), [Terms of Use](https://dietfit.health/en/terms-of-service). Không tạo hay sửa nội dung pháp lý.
- Link Features EN đưa về đầu trang thay vì mục sản phẩm: đổi đến `#dietfit-product`.
- Footer About/blog EN còn link Community tới section đã bỏ: bỏ link chết, đồng nhất với footer home. Sửa cả template để build không khôi phục lỗi.
- Thay ghi chú kích thước carousel cũ trong tài liệu bằng thông số hiện tại.

## Bằng chứng đã có

Chrome desktop trước lượt typography cuối: nền ghế không còn đường ghép; năm phone đều 528,39 × 1112,96px tại viewport 2560 × 1318, đúng thứ tự trái/phải; ảnh before/after đúng tỷ lệ 0,37628; khoảng cách Your movement 160px; dashboard title trắng, Meal plan không overflow. Đã lưu ảnh trong thư mục review ngoài repo.

Lượt kiểm tra mã mới nhất: build 18 trang; kiểm tra 10 trang (home VI và toàn bộ EN), 356 asset local, 159 link/anchor local, ID và ARIA references; cấu trúc bốn card; hồi quy copy/native UI, hai vòng integration, hero shared motion đều pass. VI và Rive runtime không đổi.

## Chưa xác nhận trực quan

Typography/card mới và mobile vẫn cần kiểm tra render. Công cụ browser của phiên hiện trả lỗi kết nối quyền dù người dùng đã chứng minh cài đặt On; đây không phải kết luận rằng người dùng chưa bật browser. Không khẳng định pixel parity/timing bản cuối với Figma/video khi chưa có render mới.


## Phản hồi 23:15

- Giữ frame/island phone tới cuối dashboard, sửa phép căn giữa khi scale và đo lại alpha opening x42/y34/w816 để bỏ khe hở trên ảnh.
- Bỏ dòng “Feature previews use sample data.” theo ảnh chỉ định.
- Before/after: chữ bên trái, ảnh bên phải trên desktop; tablet/mobile xếp dọc. Chia đoạn lead/body, giới hạn dòng chữ, giữ thang heading chung.
- Khoanh vùng món ăn theo đúng ô ảnh native và tư thế hand/bowl; kiểm tra bằng phép biến đổi độc lập và reference render texture/SVG.
- Bỏ đoạn xoay tay làm lộ mảnh tam giác, dùng tư thế hoàn chỉnh; bỏ camera/calculation crossfade có hai lớp UI chồng.
- Cap khoảng trên/dưới hero 40px, cập nhật cache version cho mọi script/style đổi trong lượt này.
- Build và kiểm tra logic/geometry qua; browser vẫn chưa kết nối để xác nhận full-page render mới.


## Khôi phục visual Fasting theo ảnh mới

Giữ nội dung Fasting; thay phone/timer bằng nguyên cụm Widgets & Streaks trước đó: Today, Streak, trend chart, ảnh bữa ăn và mascot bên phải. Desktop khôi phục visual column rộng hơn và lane riêng cho mascot; widget scale đo theo cột thực để không lấn nhân vật. Dùng lại renderer scroll/reverse widget. Đây là ngoại lệ mới theo yêu cầu người dùng cho ghi chú “năm phone đồng cỡ” trước đó: hiện còn bốn phone và một cụm widget.

## Card theo Figma + HTML/video đính kèm — 22/10

- Thay bốn visual chung bằng Streak/Challenges đúng component Figma và ảnh biểu cảm người riêng; Fitpoints dùng icon và balance gốc.
- Standard widget dùng nguyên các render EN trong file HTML đính kèm, hiển thị nửa trên iPhone và lặp ba trạng thái.
- Widget 1:1 lặp chia sẻ bữa ăn theo video, có notification và hai ảnh bữa tối đồng bộ; ảnh món ăn lấy từ video, caption EN là HTML.
- Có Pause/Play, pause offscreen/tab hidden và reduced motion; không sửa sáu artwork card hoặc visual Fasting vừa khôi phục.
- Build, asset/source integrity và motion lifecycle pass. Browser vẫn chưa kết nối nên chưa xác nhận desktop/mobile render cuối.


## Phản hồi khôi phục motion tay và lề 20px — 22/10

- Khôi phục timeline từ frame0, gồm toàn bộ đoạn tay ngoắc/hạ xuống như bản gốc; vẫn bỏ crossfade camera/calculation bị chồng UI.
- Bỏ fade theo scroll gây tay/món ăn bán trong suốt. Chỉ bo lại mép texture trong 160px đầu gần cùi chỏ, không sửa bàn tay, món ăn hay keyframe.
- Hero lề 20px cả bốn phía khi pin; header đặt 20px vào trong hero ở trên/trái/phải. Không đổi container của các section khác.
- Kiểm tra byte timeline desktop/compact, pixel/alpha vùng bàn tay+món ăn, scan geometry, safe fit, resize/reduced motion, syntax và build đều pass. Browser vẫn chưa kết nối nên chưa xác nhận render trang cuối.

## Before/After trái, chữ phải, căn trên — 22/10

Theo phản hồi mới nhất, đảo thứ tự DOM của section so sánh: ảnh Before/After bên trái, copy bên phải. Hai cột căn mép trên; heading, lead, body và CTA căn cùng mép trái bằng cách bỏ margin auto của heading. Tablet/mobile xếp ảnh trước, chữ sau và giữ cùng trục trái. Nội dung, ảnh gốc/tỷ lệ và reveal theo scroll được giữ. Build và kiểm tra cấu trúc qua; render browser vẫn chưa xác nhận qua kết nối của phiên.

## Thu gọn cụm integration — 22/10, phản hồi 05:26

Cụm diagram desktop/tablet dùng 85% chiều rộng cột, cap chiều cao theo viewport trừ160px và giữ tỷ lệ11:7. Icon, hub và hai mascot co theo chiều rộng scene thật bằng container units; không scale transform lên parent nên tọa độ giao nhận vẫn đúng. Grid mobile7×9 giữ nguyên.

Đã khởi động lại preview4180 và kết nối Chrome thành công. Tại1512×823, scene1041,85×662,99px; khi cuộn vào vị trí kiểm tra, top88,05/bottom751,04px, không tràn ngang. Xác nhận9 app, hai mascot di chuyển/giao nhận; kiểm tra tự động hai vòng lặp, pause/focus/resize/reduced motion và build đều qua. Ảnh render: `prj-dietfit-review-2026-10-20/integrations-compact-desktop.png` ngoài repo. Các ghi chú browser-unavailable trước đó là tình trạng lịch sử, kết nối hiện đã hoạt động lại cho lần kiểm tra này.

## Footer cùng khung ngoài hero — 22/10

Footer EN dùng width `100% − 40px`, margin20px trên/dưới, bo góc và min-height `100svh − 40px` như khung hero. Nội dung footer và CTA giữ nguyên.

Chrome đo desktop: lề trái/phải20px, khoảng sauFAQ20px, cuối trang20,02px; mobile viewport390×844 (document width375px sau scrollbar): trái/phải20px, trên20px, dưới19,77px do làm tròn subpixel, không tràn ngang. Đã reset viewport sau kiểm tra. Build18 trang qua; ảnh xác nhận lưu ngoài repo: `prj-dietfit-review-2026-10-20/footer-frame-20px-desktop.png`.
