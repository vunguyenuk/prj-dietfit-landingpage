# Rà soát yêu cầu landing page EN — 21/10/2026

Trạng thái hiện tại sau phản hồi 22:23 và yêu cầu kiểm tra phần bị sót. Các mục dưới đã triển khai; bằng chứng render và kiểm tra mã được ghi riêng để không coi kiểm tra DOM là xác nhận hình ảnh.

| Yêu cầu | Triển khai hiện tại |
| --- | --- |
| Hero có khoảng thở bốn phía bằng nhau | Gutter đo theo khung trang thực; stage trừ cùng gutter ở trên/dưới. |
| Không cắt phone và không ghép lệch nền ghế | Một lớp ảnh nền; Rive foreground EN dùng vùng FitHeight an toàn. Timeline/state machine gốc được giữ. |
| Deep Scan trong phone gốc | Overlay 6 contour/4 nhãn, đo theo ảnh native; không thêm phone/ảnh thứ hai. |
| UI result theo Figma | Meal Detail 36627:85534 trong file người dùng gửi, native 375 × 812, icon gốc và nút đen. |
| Mascot ló từ cạnh phone, không bị cắt tay | Một ảnh nguyên sau cạnh phone; ló/chào/thu lại trước khi bung UI. |
| Dashboard dùng nền món vừa scan làm mờ | Bỏ nền đen và shell vàng nhạt, title trắng, Meal plan có ba hàng chia phần chiều cao còn lại. |
| Motion hero do scroll | Pin 900svh; capture/scan → chào → budget → chuyển dinh dưỡng → dashboard → hold; hỗ trợ freeze/reverse. |
| Feature layout đối xứng như cũ | Scan/Coach/Health/Plan/Fasting có phone phải/trái/phải/trái/phải. Mascot không chiếm cột phone. |
| Phone feature đồng cỡ | Cùng hệ tọa độ 395 × 832 và hàm fit theo stage. |
| Before/after nhỏ lại, giữ người nguyên tỷ lệ | Ảnh gốc 368 × 978; gallery giới hạn 76svh và chiều cao viewport, căn giữa. |
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
