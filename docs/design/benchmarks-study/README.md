# Đánh giá thiết kế Dietfit Benchmarks

> Tài liệu lịch sử: đánh giá bản trước khi triển khai dashboard theo hướng Onetwenty. Các phép đo bên dưới mô tả bản cũ; giao diện hiện tại đã thay đổi.

Ngày xem: 28/10/2026. Trang hiện tại: `/en/benchmarks/`.

Đây là đánh giá chuyên môn dựa trên trang thực tế, hai lượt đánh giá độc lập, phép đo DOM và bộ dò giao diện. Chưa thực hiện thử nghiệm với người dùng. Các nhận xét thẩm mỹ là phán đoán thiết kế; các kích thước và hành vi bên dưới được đo trên Chromium. Phác thảo là đề xuất, không phải thay đổi đã áp dụng lên trang.

**Kết luận:** phần mở đầu đang phân bổ diện tích cho ảnh trang trí nhiều hơn cho bằng chứng. Màu sắc đã nhẹ nhưng cách tổ chức thông tin vẫn khiến nó giống một trang quảng cáo thực phẩm. Cần thiết kế lại thứ bậc thông tin và mối liên hệ giữa số liệu, mẫu thử và sản phẩm.

[Xem phác thảo phần mở đầu](direction.html) · [Đánh giá độc lập về thiết kế](evidence/design-review.md) · [Đo lường và kết quả detector](evidence/detection-report.md).

## Vì sao cảm giác vẫn chưa đẹp

### 1. Điểm nhấn lớn nhất chưa nói được điều cần nói — P1

Ảnh thực phẩm chiếm một khung 1280 × 560 px ở desktop. Điện thoại bên trong chỉ rộng 232 px, khoảng 18% bề ngang khung. Người xem thấy rau củ trước, trong khi UI nhỏ và thường đang chạy qua trạng thái nhận diện/chờ xử lý.

Đối với trang benchmark, khoảnh khắc mạnh nhất nên là nhìn thấy kết quả so với mốc cân thực tế. Một màn hình app nhỏ, đang chờ quét, chưa tạo được khoảnh khắc đó. Giảm màu đậm hoặc đổi font không giải quyết được tỷ lệ này.

**Đề xuất:** dùng kết quả so sánh làm hình ảnh chính ở đầu trang. Demo sản phẩm giữ vai trò giải thích sau đó. Nếu dùng screenshot app, chọn trạng thái đã có kết quả, đủ lớn để đọc. Giữ ảnh gốc của bộ dữ liệu ở phần bằng chứng; không thay bằng ảnh món ăn đẹp do AI tạo rồi trình bày như dữ liệu đo.

### 2. Người đọc phải đi quá xa mới thấy phần so sánh — P1

| Đo trên trang hiện tại | Desktop 1440 × 900 | Mobile 390 × 844 | Mobile 320 × 740 |
|---|---:|---:|---:|
| Tổng chiều cao trang | 5623 px | 7049 px | 7489 px |
| Bắt đầu bảng xếp hạng ảnh | 1462 px | 1826 px | 1848 px |
| Bắt đầu bảng theo nhóm món | 2685 px | 3686 px | 3875 px |
| Vị trí bắt đầu thẻ điểm trong hero | 941 px | 846 px | 870 px |

Đây là tọa độ từ đầu trang, không phải số pixel cần cuộn sau khi bấm nút. Nút “See the results” vẫn nhảy đúng đến ví dụ so sánh; ở mobile, bảng xếp hạng tiếp tục nằm sau ảnh mẫu do hai cột xếp dọc.

**Đề xuất:** mở đầu bằng câu hỏi báo cáo, kết quả ảnh trên 30 đĩa và kết quả text trên 107 mô tả. Có đường dẫn rõ đến phương pháp và nguồn. Đặt phần tổng quan cạnh tiêu đề trên desktop, ngay dưới lời giới thiệu trên mobile. Đặt mục tiêu nhìn thấy ít nhất một so sánh trong màn hình đầu của các viewport đã đo.

### 3. Số liệu đúng ngữ cảnh nhưng cách nhóm làm người xem phải tự giải thích — P1

- Ví dụ hiện có **404 kcal** cân thực tế, **399 kcal / 99%** ở demo và ghi chú **387 kcal** ở lần chạy benchmark. Chúng có thể là hai lần xử lý khác nhau, nhưng UI hiện tại đặt rất gần nhau và giải thích bằng chú thích nhỏ.
- Hero nói **30 đĩa**, text test nói **107 món**, dòng nguồn lại có **644 plates and foods**. Chưa có giải thích trực tiếp về quan hệ giữa những tập này. Không đủ cơ sở để kết luận 644 là sai.
- Text score là **88.0%** so với **87.7%**. Nên để người xem thấy chênh lệch 0,3 điểm phần trăm và phạm vi phép thử, thay vì chỉ nhấn mạnh “#1”. Không suy diễn ý nghĩa thống kê khi chưa có độ biến thiên hay phép kiểm định.

**Đề xuất:** mỗi phép đo có nhãn, số mẫu và mốc tham chiếu ngay cạnh kết quả. Tách “Interactive demo” khỏi “Recorded benchmark run”, giữ nguyên các con số. Kiểm tra nguồn của 644 trước khi diễn giải. Nguồn dữ liệu và công thức phải có liên kết rõ, không chỉ tên nguồn dạng chữ thường.

### 4. Đã mượn bảng màu nhưng chưa mượn được cách tổ chức thiết kế — P2

Bản hiện tại có nền kem, chữ xanh đậm, bảng xanh nhạt, thẻ thắng xanh lime, CTA xanh rêu và ảnh thực phẩm lặp lại ở cuối. Các màu này không tự gây xấu; vấn đề là chúng làm trang tách khỏi cảm giác Dietfit và phân tán vai trò màu cam.

Ở ảnh mẫu người dùng gửi, hình ảnh và UI được dựng thành một bố cục có chủ đích. Trong [case study Onetwenty](https://baked.design/work/onetwenty/), Baked mô tả việc bắt đầu bằng một câu nói rõ về dữ liệu, ưu tiên các phần dữ liệu quan trọng, tăng độ đọc được và dùng một hệ thống component thống nhất. Đây là nguyên tắc có thể áp dụng. Chuyển nguyên màu hoặc chi tiết trang trí sang báo cáo khác không tự tạo ra chất lượng tương đương.

**Đề xuất:** giữ Be Vietnam Pro, một nền trung tính ấm, màu cam dùng cho Dietfit và hành động chính, màu trung tính cho đối thủ. Khôi phục cách bo góc/nút/navigation gần với trang chủ. Giảm số nền màu chuyển qua lại. Hình ảnh sản phẩm và bằng chứng là phần tạo cá tính.

### 5. Mobile hiện co lại được, nhưng chưa ưu tiên lại nội dung — P2

Nhãn món ăn còn 10 px, nút cao khoảng 21,5 px; chữ calorie màu cam có tương phản khoảng 2,86:1 trên nền sáng. Vì vậy nội dung tương tác quan trọng nhất lại khó đọc và chạm.

Bảng cuộn ngang đã làm đúng: có nhãn hỗ trợ, focus bàn phím, cột danh mục cố định, gợi ý vuốt; không có tràn ngang toàn trang. Không nên phá bỏ phần này. Cần thêm tổng quan ngắn trước bảng chi tiết và danh sách chọn món có vùng chạm đủ lớn bên dưới ảnh, thay vì ép toàn bộ tên vào ảnh.

Ngoài ra cần sửa focus của “See the results” và “Download Dietfit”: lượt kiểm tra bàn phím thấy nút đầu có viền trùng màu nền, nút sau không có chỉ báo focus nhìn thấy được. Đây là lỗi cụ thể của hai CTA, không phải toàn trang thiếu focus.

## Những phần nên giữ

- Ảnh thật của mẫu nghiên cứu, các con số, calorie error, bảng theo nhóm thực phẩm và các giới hạn đã công bố.
- Font và những đoạn phương pháp có phân cấp rõ, đường phân cách đơn giản.
- Chọn món và FAQ bằng disclosure; bảng cuộn ngang có keyboard support.
- Nội dung tiếng Anh theo lựa chọn trước đó của người dùng.

## Hướng thiết kế đề xuất

**Một báo cáo Dietfit có bằng chứng rõ, dùng ngôn ngữ hình ảnh của sản phẩm.**

1. **Opening / kết quả:** tiêu đề ngắn đặt vấn đề; so sánh ảnh và text có nhãn mẫu thử; điểm và phạm vi đọc được ngay. Phác thảo dùng hai nút chuyển giữa hai tập kết quả, giữ đúng các điểm số và thang 0–100%.
2. **Photo evidence:** ảnh gốc và giá trị cân thật; kết quả lần chạy báo cáo; demo có nhãn riêng. Mobile có danh sách chọn từng món, không giảm chữ xuống 10 px.
3. **Text evidence:** tổng quan bốn app trước, bảng đủ 13 nhóm phía sau. Giữ bảng đầy đủ và khả năng cuộn ngang.
4. **Method / sources:** công thức, quy tắc một lần chạy, giới hạn, ngày/phạm vi đo và đường dẫn nguồn. Không tạo tệp raw data hay download giả khi chưa có.
5. **FAQ / CTA:** giải thích phần còn lại; một CTA sản phẩm gọn. Tránh thêm một khung ảnh thực phẩm lớn lặp lại ở cuối.

Có thể học cách [Artificial Analysis](https://artificialanalysis.ai/) ghi tên phép đo, hướng tốt/xấu và đưa phương pháp cạnh các biểu đồ. Không cần mang hệ thống bộ lọc và độ phức tạp của một trang đánh giá AI lớn sang Dietfit.

## Đánh giá heuristic

Đây là điểm đánh giá usability của chuyên gia, không phải điểm đẹp và không thay cho user testing. Tổng **23/36 điểm áp dụng**. Error recovery không được chấm vì không có luồng lỗi nhập liệu để kiểm tra.

| Tiêu chí | Điểm /4 | Nhận xét chính |
|---|---:|---|
| Trạng thái hệ thống | 3 | Có trạng thái chọn món/FAQ; số count-up có giá trị trung gian |
| Ngôn ngữ và thực tế | 3 | Phần lớn dễ hiểu; “weigh” dễ bị hiểu là app đo cân nặng |
| Quyền kiểm soát | 3 | Có điều hướng/disclosure thông thường |
| Nhất quán | 3 | Thành phần trong trang hợp nhau; bản sắc so với Home còn lệch |
| Ngăn hiểu sai | 2 | Ngữ cảnh 399/387/404 và 30/107/644 chưa đủ rõ |
| Nhận biết thay vì ghi nhớ | 3 | Có nhãn; mobile cần nhớ khi vuốt bảng |
| Hiệu quả sử dụng | 2 | Thiếu lối tắt đến text, method và sources từ mở đầu |
| Thẩm mỹ và tối giản | 2 | Diện tích ảnh trang trí đang lớn hơn giá trị thông tin |
| Khôi phục từ lỗi | N/A | Không có luồng lỗi đủ cơ sở chấm |
| Trợ giúp và giải thích | 2 | Có FAQ/công thức, nguồn chưa đủ dễ truy cập |

Cognitive load: **3/8 điểm chưa đạt**, mức vừa. Vướng ở trọng tâm, thứ bậc và việc ghi nhớ/đối chiếu số; không phải do có quá nhiều nút. Một người mới cần hiểu “accuracy” là gì; người muốn kiểm chứng cần nguồn và mẫu thử; người dùng mobile cần xem được kết quả trước khi cuộn sâu.

## Kết quả bộ dò và giới hạn

Impeccable CLI 4.6.0 trong cache trả về 15 cảnh báo: 3 tương phản, 1 chữ nhỏ, 10 padding, 1 bảng màu kem. Không coi các cảnh báo này là kết luận thẩm mỹ:

- Xác nhận: chữ cam nhỏ trong nhãn món, số lượng mẫu màu xám nhạt; mobile có chữ 10 px.
- Cần xem theo ngữ cảnh: cảnh báo màu kem và phần lớn padding. Các khối phương pháp có khoảng cách dọc có chủ đích; không cần biến mọi đoạn thành card.
- Live overlay không được chạy do workflow CLI hiện có khác mô tả của skill và sẽ cần thay đổi cấu hình/inject source. Các phép đo ở đây dùng DOM và tương tác thực trong tab headless riêng; không có overlay đang hiển thị trong trình duyệt người dùng.
- Không phát hiện tràn ngang trang; menu, chọn món, FAQ và cuộn bảng bằng bàn phím đều hoạt động.

## Thứ tự sửa ở lần triển khai tiếp theo

1. `/layout`: thay hero và đưa tổng quan so sánh lên đầu.
2. `/clarify`: làm rõ phạm vi số liệu, demo/lần chạy và đường dẫn nguồn.
3. `/adapt`: ưu tiên lại thứ tự mobile, tăng cỡ chữ và vùng chạm chọn món.
4. `/polish`: đồng bộ nút/màu/bo góc với Home, sửa focus và tương phản nhỏ.

Tiêu chí nghiệm thu: kết quả so sánh xuất hiện trong màn hình đầu ở các viewport mục tiêu; hai tập thử không bị gộp sai; mọi số gốc giữ nguyên; có thể xem phương pháp/nguồn trực tiếp; thao tác bàn phím và mobile vẫn đầy đủ. Phác thảo [direction.html](direction.html) cho thấy bố cục mở đầu theo hướng này, không phải một bản thay thế đầy đủ của báo cáo.
