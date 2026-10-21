# Rà soát các yêu cầu landing page EN — 21/10/2026

Đã đối chiếu toàn bộ chuỗi yêu cầu trong chat với mã hiện tại. Bảng dưới ghi nhận phần đã triển khai và kiểm tra bằng mã/DOM; không thay cho kiểm tra hình render trong trình duyệt.

| Yêu cầu | Kết quả hiện tại |
| --- | --- |
| Nền hero và khoảng thở | Theo yêu cầu mới nhất, cảnh dashboard dùng ảnh món scan làm mờ thay nền đen; hero giữ viền/bo góc và khoảng cách section. |
| Footer CTA đưa lên cao hơn | Ảnh và nội dung CTA được nâng theo stylesheet EN. |
| Mascot trái không che logo, viết sổ và lè lưỡi | Integration dùng vị trí nghỉ riêng và ảnh writing-tongue; chỉ nhân vật trái có sổ. |
| Mascot phải không ghi chép | Nhân vật phải nghỉ/chào, không có notetaker. |
| Chuyển động mang/dán tự nhiên hơn | Atlas có turn/walk/crouch/lift/carry/place/release; 9 app, gồm Apple Health. |
| Bỏ gương, dùng grid cân giữa và thêm ô | Grid 11 × 7 desktop, 7 × 9 mobile; Dietfit ở giữa; không còn glass target. |
| Icon app lớn hơn; Apple Health cũng là app | Icon co giãn trong ô vuông; Apple Health nằm trong grid và được mang đến vị trí. |
| Integration phải loop | Đã sửa từ một lượt sang lặp; nghỉ 3,5 giây, pause ngoài màn hình/ẩn tab, dừng khi focus link. |
| Container đồng nhất và cân đối trên màn hình lớn | Dùng token khung chung, chiều rộng và typography co giãn; phone dùng chung hàm fit. |
| Khoảng cách section 100px | Giữ 100px mặc định; riêng before/after → Your movement là 160px theo yêu cầu sau đó. |
| Before/after vừa màn hình, không sửa/bóp méo người | Gallery căn giữa, ảnh tối đa 76svh và có giới hạn theo viewport; ảnh gốc width:100%, height:auto. |
| Deep Scan nằm trong phone trắng gốc | Overlay chỉ chứa đường viền/nhãn, đo theo native Rive; không có phone/ảnh thứ hai. |
| Mascot ló ra, chào, thu lại rồi mới bung UI | Giữ trình tự scroll; mascot hiện ló từ cạnh trái phone bằng một ảnh nguyên, không tách tay. |
| Phone và dashboard không vượt khung | Đã đổi native canvas sang FitHeight có vùng an toàn; dashboard đo theo chiều cao stage thực; bỏ nền vàng nhạt bao ngoài. Kiểm tra hình render vẫn chờ. |
| Motion hero do scroll, hoàn tất rồi mới qua section sau | Hero pin 900svh; capture/scan → chào → budget → chuyển dinh dưỡng → dashboard → hold. Freeze/reverse đã qua kiểm tra logic. |
| UI result theo Figma | Dùng Meal Detail 36627:85534 trong trang được gửi; icon gốc, native 375 × 812, nút đen; bỏ UI tự dựng và ảnh cũ chồng phía dưới. |
| Card list giữa integration và FAQ | Đúng thứ tự trong HTML, giữ scroll/arrow navigation. |
| Card đủ lớn để đọc | Theo phản hồi 22:23, tăng card khoảng 10%: màn hình rộng dùng 3,6 card thay 4, laptop 3 thay 3,2, giữ tỷ lệ 5:7 và giới hạn chiều cao. |
| Phone có/không mascot phải đồng cỡ | Cả 5 chapter dùng cùng 395 × 832, cùng hàm fit; mascot không chiếm bớt cột phone. |
| Copy theo Notion PDF | Hero, Scan, Sara, Meal Plan, Fasting và 4 card level 2 đã cập nhật; Connected Health đổi thứ tự; VI giữ theo ghi chú phê duyệt EN trước trong nguồn. |

## Phát hiện và sửa trong lượt rà soát này

- Integration vẫn bị khóa ở trạng thái chạy một lần: đã đổi thành loop và kiểm tra hai vòng đầy đủ.
- Carousel trên màn hình rộng vẫn dùng 3,2 card: đã thêm breakpoint 1800px để hiện ít nhất 4 mà không thu nhỏ chữ.

## Kiểm tra đã hoàn thành

- Hai chu kỳ integration: đủ 9 app, rest/recall, tạm dừng ngoài viewport và khi ẩn tab, focus/resume, resize, reduced motion và page exit.
- Hero: một result/budget, tổng calories/macros, freeze/reverse, native handoff, resize, side peek và reduced motion.
- Deep Scan: mapping desktop/compact, 6 contour/4 label và hình học khớp node ảnh trong Rive tại các fixture viewport.
- Copy/chapter order, Fasting controls, mascot lifecycle EN/VI, file ảnh/script/style không rỗng, ID/label/SEO hợp lệ và thứ tự section.
- Build 18 trang, JavaScript syntax và whitespace checks.

## Phần chưa xác nhận

Chưa có kiểm tra trực quan bản cuối trên browser ở desktop/mobile và màn hình lớn. Vì vậy độ khớp hình render với Figma/video meal-plans, cảm giác timing, text wrapping và crop/overflow thực tế vẫn chưa được chốt. Kết nối công cụ trình duyệt của phiên này từng trả lỗi quyền trái với cài đặt On mà người dùng đã cung cấp; không coi đây là lỗi cài đặt của người dùng và không yêu cầu bật lại.


## Sửa theo phản hồi 21:06

- Phone native bị crop do Cover phóng theo chiều ngang trong stage đã trừ gutter: đổi sang FitHeight có vùng an toàn và cập nhật cùng phép đo cho Deep Scan.
- Dashboard vượt chiều cao vì lấy 100svh thay cho stage thực: giới hạn theo container height, giữ khoảng trống phía trên/dưới.
- Thay nền đen bằng ảnh chính món vừa scan, làm mờ bằng CSS; xoá lớp nền vàng nhạt khỏi DOM và controller.
- Kiểm tra logic/DOM, DPR/resize, freeze/reverse và build đã qua. Chưa có bằng chứng render browser cho bản sửa này.


## Rà soát cuối và phản hồi 22:23

- Nền hero chỉ còn một lớp ảnh ghế; export foreground EN không đổi timeline/state machine. Đã thấy trực tiếp đường ghép biến mất trên Chrome.
- 5 phone feature có kích thước bằng nhau: 528,39 × 1112,96px tại viewport 2560 × 1318; thứ tự phải/trái/phải/trái/phải đúng.
- Before/after dùng ảnh gốc 368 × 978, tỷ lệ render 0,37628; khoảng cách gallery → Your movement đo được 160px; không tràn ngang.
- Integration đủ 9 app, loop/pause/reverse lifecycle qua kiểm tra hai vòng; Chrome xác nhận scene đang active và hai nhân vật đang mang app.
- Title dashboard trắng; Meal plan phân bổ ba hàng, không overflow. Ảnh app/ảnh món trong card mới đã bỏ chiều cao thuộc tính gây kéo giãn.
- Sửa Lenis EN để reset vị trí khi hashchange/pageshow; Chrome xác nhận sau mở #dietfit-progress, một cuộn nhỏ đi từ y=29630 đến 29880 thay vì nhảy xuống carousel.
- Typography mới: một thang heading EN ở stylesheet cuối, cùng weight/line-height/letter-spacing; heading section giảm còn tối đa 2,25rem; hero riêng tối đa 3,75rem. Body before/after giới hạn 60ch và giảm weight câu nhấn; tăng nhẹ kích thước card theo yêu cầu mới nhất.
- Build và các kiểm tra logic/DOM đã qua. Browser kết nối lại thành công rồi gián đoạn lần nữa; chưa kiểm tra render bản typography mới/mobile nên không khẳng định pixel parity với Figma/video.
