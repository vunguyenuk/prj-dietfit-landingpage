# Rà soát nguồn và quyền sử dụng hình ảnh Dietfit

Ngày kiểm tra: **29/10/2026**. Phạm vi là bản local tại `http://127.0.0.1:4180`, không phải kiểm toán bản production đang deploy.

**Trạng thái:** đang xác minh theo từng ảnh. Đã đối chiếu thêm nguồn công khai; có ảnh tìm được license phù hợp và có ảnh còn là ứng viên. Không kết luận thiếu quyền từ việc thiếu hồ sơ trong repo. Các mục bên dưới chỉ ra bằng chứng có/thiếu trong dự án, không kết luận các ảnh chắc chắn vi phạm. Giấy phép, hợp đồng và sự đồng ý có thể đang được giữ ngoài repo.

## Nhãn đọc nhanh trên gallery

- **Có bản quyền · được dùng theo license:** Blog 06, khớp Pexels 6954181.
- **Có bản quyền · quyền dùng marketing chưa xác minh:** ảnh footer McDonald’s.
- **Có license · cần đối chiếu:** ảnh tham chiếu Nutrition5k; cần khớp file dataset gốc và ghi nguồn.
- **Chưa xác định bản quyền:** các ảnh còn thiếu bằng chứng. Không đổi nhãn này thành không bản quyền.

Chưa xác nhận ảnh public domain/CC0 trong phạm vi đã rà. Người dùng cho biết đa số ảnh tìm từ Pinterest; chưa có mapping Pin URL tới từng file. Pinterest không tự cấp quyền tái sử dụng ảnh trên website: [hướng dẫn bản quyền của Pinterest](https://help.pinterest.com/en/article/copyright). Gallery chỉ hiển thị nhãn và ghi chú ngắn; bằng chứng được thu gọn. CSV có hai cột riêng `copyright_label` và `usage_label`.

## Bổ sung: đối chiếu internet — 29/10/2026

**Đây là kết quả truy nguyên nguồn công khai, không phải kết luận mọi ảnh có hoặc không có quyền.** Bản kiểm kê đầu tiên chỉ dựa nhiều vào hồ sơ nội bộ. Thiếu chứng từ trong repo không có nghĩa ảnh chưa được cấp phép.

## Kết quả thay đổi sau khi tra cứu

| Ảnh | Đối chiếu | Quyền sử dụng tìm thấy |
| --- | --- | --- |
| Footer Home EN | **Khớp đúng ảnh** trong thông cáo McSmart Snacks của McDonald’s Deutschland, 13/02/2025 | Image info của đúng ảnh nêu quyền sử dụng **biên tập**, có điều kiện và credit. Chưa xác minh thỏa thuận riêng cho marketing Dietfit. |
| Blog 06, người thu podcast | **Khớp đúng ảnh** Pexels **6954181** qua CDN chính thức | [Pexels License](https://www.pexels.com/license/) cho phép website, blog, marketing và chỉnh sửa, không bắt buộc ghi nguồn; tránh ngụ ý bảo trợ. Đây là bằng chứng tích cực về license công khai, không cần mặc định ảnh thiếu hóa đơn là thiếu quyền. |
| About, “What’s for dinner tonight?” | **Ứng viên campaign Midea** từ Libera Brand Building; cùng căn bếp/đĩa màu/cảnh quay, chưa khớp chính frame từ trong tủ | Chưa tìm thấy giấy phép tái sử dụng cho Dietfit trên trang agency. Watermark TVCBOOK không xác định chủ ảnh. |
| Card Home “streak” | **Ứng viên dẫn xuất**: ảnh trên CLEA Midlife rất gần về động tác tay, hình xăm, áo và núi; bản Dietfit có hồ sơ AI edit | CLEA chỉ là nơi tìm thấy ảnh; chưa phải tác giả/stock provider được xác nhận. |
| Blog 02, áo khoác cam | **Ứng viên cùng bố cục** trên GoKwik; bàn/đèn/cây/laptop/trang phục giống, khuôn mặt/tóc khác | Không đủ xác định ảnh nào có trước, tác giả hoặc chuỗi chỉnh sửa. Không gán ảnh cho GoKwik. |

### Nguồn và cách đối chiếu

**McDonald’s:** [thông cáo gốc](https://www.presseportal.de/pm/52942/5970723), [image info của đúng ảnh](https://www.presseportal.de/api/image_info.htx?id=67ae284a270000fd2ca7c54a&story_id=5970723&render=html), [ảnh công khai](https://cache.pressmailing.net/thumbnail/story_hires/c01e40cf-170c-40b9-964d-3931968f8c0c/Snacken_Teilen_Wohlf~len_1920x1080px.jpg.jpg). So sánh đủ ba người, quần áo, vị trí tay, bao bì và nền. Image info ghi McDonald’s Deutschland ở trường quyền ảnh và nhiếp ảnh; không suy diễn từ logo. Điều kiện được đọc trực tiếp qua trình duyệt, không chỉ qua snippet tìm kiếm. Phạm vi biên tập không tự xác nhận việc dùng để quảng bá Dietfit; hợp đồng riêng vẫn có thể tồn tại ngoài dự án.

**Blog 06:** [ảnh từ CDN Pexels](https://images.pexels.com/photos/6954181/pexels-photo-6954181.jpeg), [trang ảnh Pexels](https://www.pexels.com/photo/cheerful-black-woman-recording-audio-podcast-6954181/), [license](https://www.pexels.com/license/). Khớp áo len cam, cổ lọ trắng, notebook, ghế mây, micro, lọ hoa và nền vàng. Tên **George Milton** được ghi trong [danh sách credit MyFutureVT](https://myfuturevt.org/photo-credit/) và các trang khác; trang chi tiết Pexels không trả đủ nội dung khi truy cập nên tên tác giả hiện có mức xác minh thấp hơn stock ID/ảnh CDN. Hai file Blog 06 và OG cùng hình. Việc bộ card Pexels cũ không được dùng **không có nghĩa toàn site không có ảnh Pexels**.

**About:** [case study agency](https://www.liberabrandbuilding.it/en/case-histories/midea/), [still campaign](https://www.liberabrandbuilding.it/contents/assets/Midea-campagna-internazionale.webp), [Bebit](https://bebit.it/en/case-services/midea-tik-tok/). Campaign “Welcome home, Kings and Queens”. Chỉ nhận là đầu mối campaign, chưa nhận là chính frame đang dùng. [TVCBOOK tự giới thiệu](https://plus.tvcbook.com/about.html) là nền tảng/database quảng cáo; watermark của nền tảng không thay cho tên chủ bản quyền.

**Card streak:** [CLEA quiz](https://www.cleamidlife.com/pages/take-the-quiz), [ảnh công khai](https://cdn.shopify.com/s/files/1/0886/2744/6123/files/quiz--52.jpg?v=1756932897). Khớp nhiều chi tiết bố cục nhưng file Dietfit đã được AI chỉnh; không kiểm chứng bằng hash.

**Blog 02:** [GoKwik](https://www.gokwik.co/), [ảnh công khai](https://www.gokwik.co/gokwik/images/store-mobile.webp). Có khác biệt rõ về người trong ảnh nên không ghi “khớp đúng ảnh”.

## Phạm vi tìm kiếm và giới hạn

Đợt này tập trung 17 ảnh/bố cục: **9 ảnh tham khảo card Home, 6 ảnh Blog, About dinner và footer EN**. Đã tìm theo nội dung ảnh, đối chiếu các ứng viên bằng mắt và đọc điều kiện từ nguồn công khai; không coi mô tả ảnh do công cụ tìm kiếm tạo là chứng cứ quyền sở hữu. Các phiên bản crop/resize/AI edit không được coi là trùng hash ảnh gốc.

- Card: tìm theo phụ nữ áo vàng vươn tay; phụ nữ áo xanh/kính xanh/điện thoại; người áo hoodie tím/đồng hồ; phụ nữ tennis trang phục trắng; phụ nữ blazer xanh ở bàn làm việc; hai phụ nữ dùng điện thoại ngoài vườn; nam chơi bóng; điện thoại trống trên nền xám; bạn bè thể thao trên sân tennis. Ngoài đầu mối CLEA, chưa khớp được ảnh gốc đáng tin cậy. Kết quả tennis trên Depositphotos và ảnh selfie trên Orange/Adobe khác chi tiết, không dùng để gán license.
- Blog: đã tìm riêng cảnh gõ code nền tím, áo khoác cam/cổ lọ hồng, hai người văn phòng, tay áo xanh gõ laptop, người trước màn hình video call, và podcast. Blog 01/03/04/05 chưa có stock ID khớp được; Blog 02 có ứng viên, Blog 06 khớp Pexels.
- Reverse image upload qua Google Lens bị trang kiểm tra lưu lượng chặn; Bing trả lỗi không xử lý được ảnh. Không vượt chặn. Vì vậy **chưa hoàn tất reverse search độc lập từng file**; kết quả không phải bằng chứng “internet không có ảnh này”.
- Chưa tra ngược toàn bộ chân dung team, ảnh before/after, ảnh cá nhân social và mọi lớp ảnh Figma. Không nhận diện danh tính người bằng khuôn mặt. Các nhóm này vẫn cần hồ sơ từ người cung cấp ảnh; không kết luận thiếu consent.
- Các điều khoản đọc được là tại ngày kiểm tra. Giấy phép/hợp đồng riêng của Dietfit chưa được cung cấp và không thể suy ra chỉ từ ảnh xuất hiện công khai.

## Cách đọc trạng thái

**Khớp đúng ảnh** nói về nguồn/bố cục, không mặc định giấy phép. **Ứng viên** là đầu mối chưa đủ chứng minh. **Chưa xác minh** là còn thiếu bằng chứng, không phải “vi phạm”. P1/P2 trong inventory chỉ là thứ tự bổ sung hồ sơ của lượt kiểm kê, không phải chấm điểm vi phạm hay lệnh thay ảnh.

Chi tiết URL, mức khớp, ghi chú license và ảnh chụp đối chiếu được lưu trong [web-evidence.json](web-evidence.json) và [gallery](priority-gallery.html). Không thay/xóa ảnh website trong đợt kiểm tra.


## Phạm vi và phương pháp

- Kiểm tra 8 route chính: `/`, `/en/`, `/vi/`, `/about-us/`, `/en/about-us/`, `/blog/`, `/en/blog/`, `/en/benchmarks/`.
- Browser tại desktop 1440px và mobile 390px; cuộn toàn trang để kích hoạt lazy loading. Thu thập `<img>`, responsive `srcset`, background/mask CSS và video poster.
- Kiểm tra ảnh Open Graph/Twitter của **24 trang HTML public**. Ảnh của 6 bài Blog cũng xuất hiện trong hai trang danh sách; không mở từng bài bằng browser.
- Tổng **141 đường dẫn ảnh/đồ họa**, gồm **133 nội dung file local phân biệt theo SHA-256** và **2 URL ngoài**. Con số này có icon, SVG, UI export, poster và biến thể độ phân giải; không phải 141 ảnh chụp độc lập.
- Đối chiếu file nguồn `source.md`, `source.json`, prompt, capture manifest, hash và giấy phép công khai của nhà cung cấp. Không suy ra giấy phép chỉ từ tên file `user-photo`, file Figma hay ảnh đã chỉnh AI.
- Không thay/xóa ảnh hoặc chỉnh giao diện trong lần kiểm tra này. Chỉ tạo hồ sơ audit.

Giới hạn: chưa kiểm tra từng frame trong video, mọi ảnh nhúng bên trong `.riv`/canvas, các trạng thái UI không xuất hiện trong lượt chạy, hoặc các hợp đồng bên ngoài dự án. URL OG của Benchmarks còn trỏ tới `https://dev.dietfit.health/og/benchmarks-en.jpg`; đã ghi nhận tham chiếu nhưng chưa xác minh nội dung/quyền ảnh remote đó.

## Các mục cần bổ sung hồ sơ nội bộ

| Ưu tiên | Nhóm đang dùng | Bằng chứng tìm thấy | Còn thiếu / hướng xử lý |
| --- | --- | --- | --- |
| P1 | Ảnh “What’s for dinner tonight?” trên About VI/EN | Ảnh người dùng gửi, có watermark TVCBOOK; có đầu mối campaign Midea nhưng chưa khớp chính frame | Tác giả/chủ sở hữu, giấy phép dùng website/quảng cáo. Trước tiên khớp nguồn và đối chiếu thỏa thuận của người cung cấp; watermark không xác định chủ ảnh. |
| P1 | **9 ảnh người/ảnh tham khảo trong card Home**, dùng ở EN và VI | Hồ sơ ghi dùng ImageGen để sửa ảnh tham khảo, giữ người/pose/cảnh | License ảnh gốc và phạm vi cho phép chỉnh sửa/dùng thương mại; quyền dùng hình người nếu cần. Có prompt không thay thế chứng từ nguồn. |
| P1 | Ảnh footer Home EN | File `final-cta-us-en-user-photo.webp`, thấy bao bì và logo **McDonald’s** | Nguồn công khai ghi McDonald’s Deutschland; điều kiện công khai là biên tập, chưa xác minh hợp đồng marketing riêng. Đã tìm được đúng ảnh tại thông cáo McDonald’s; xem phần đối chiếu internet ở trên. |
| P1 | **4 file before/after** ở EN và VI | Ảnh người đang chạy được kiểm tra trực quan; không trùng hồ sơ ảnh AI `-v1` cũ | Quyền ảnh, đồng ý của người xuất hiện và căn cứ cho việc dùng như case khách hàng. Chưa thể xác nhận chỉ dựa vào file được người dùng cung cấp. |
| P1 | Ảnh/video social Nguyễn Trà My và thumbnail YouTube ở VI | File local social và URL YouTube đã nhận diện | Quyền tái sử dụng marketing/consent. Phân biệt embed được nền tảng cho phép với tải/copy ảnh/video ra ngoài nền tảng. |
| P2 | **7 nguồn ảnh About từ Figma** (8 file đang dùng do hero có 2 độ phân giải) | Có Figma node và ngày export | Tác giả/stock ID/giấy phép ảnh gốc; export từ Figma không phải chứng từ cấp quyền ảnh. |
| P2 | **5 ảnh Blog chưa khớp nguồn gốc**, **16 chân dung team** | File đang dùng, tên team và vị trí hiển thị | Blog 06 đã khớp Pexels; 5 ảnh còn lại cần truy nguyên, Blog 02 có ứng viên cùng bố cục. Team: quyền ảnh và chấp thuận dùng trên website; không mặc định team chưa đồng ý, chỉ chưa có hồ sơ trong repo. |
| P2 | Ảnh footer VI, banner community, ảnh nhúng trong product/demo/UI export | Có file/capture, một số lớp UI từ Figma | Truy nguyên từng lớp ảnh và hồ sơ nguồn. |
| P2 | Logo app đối thủ và logo tích hợp | Có URL artwork chính thức cho nhiều logo | Rà guideline của từng brand cho đúng mục đích so sánh/tích hợp. URL chính thức không chứng minh quyền marketing không giới hạn. |

P1/P2/P3 là mức ưu tiên bổ sung hồ sơ, **không phải kết luận vi phạm pháp luật**.

## 9 ảnh card Home cần đối chiếu giấy phép đầu vào

- [active-friends.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/apple-health-reference/active-friends.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/apple-health-reference/source.md).
- [football-pitch.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/challenge-reference/football-pitch.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/challenge-reference/source.md).
- [phone-at-desk.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/diary-reference/phone-at-desk.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/diary-reference/source.md).
- [watch-forward.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/fasting-reference/watch-forward.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/fasting-reference/source.md).
- [phone-in-hand.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/progress-reference/phone-in-hand.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/progress-reference/source.md).
- [green-phone.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/reminder-reference/green-phone.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/reminder-reference/source.md).
- [tennis-court.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/reward-reference/tennis-court.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/reward-reference/source.md).
- [stretching-sky.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/streak-reference/stretching-sky.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/streak-reference/source.md).
- [friends-garden.webp](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/together-reference/friends-garden.webp) — hồ sơ: [source](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/cards/together-reference/friends-source.md).

Các hồ sơ mô tả chỉnh sửa giữ người/pose/cảnh; riêng hồ sơ Apple Health còn có câu yêu cầu gỡ watermark/nhãn trong prompt. Đây là chỉ dấu cần kiểm tra ảnh tham khảo gốc, chưa chứng minh file đang dùng có hoặc không có giấy phép. Không tìm thấy giấy phép stock, hóa đơn hay văn bản cho phép tương ứng trong repo.

## Những nguồn có hồ sơ rõ hơn

**Nutrition5k:** nhà phát hành công bố dữ liệu theo CC BY 4.0, cho phép cả sử dụng thương mại. Trang benchmark đã ghi © Google Research, CC BY 4.0 và Thames et al. Tuy nhiên, cần đối chiếu `plate_1563216440.jpg` với file dataset gốc, thêm liên kết trực tiếp tới license và ghi rõ chú thích/overlay của Dietfit nếu có chỉnh sửa. [Nguồn dataset](https://github.com/google-research-datasets/Nutrition5k), [điều kiện CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Pexels:** `assets/cards/vi-real/source.json` và `assets/cards/habits/source.json` có các record stock/tác giả/license, nhưng những ảnh Pexels đó **không nằm trong inventory ảnh đang dùng** của các route đã rà. Không dùng chúng để kết luận bộ card hiện tại đã được cấp phép. Pexels cho phép dùng và chỉnh ảnh trên website/marketing, nhưng có điều kiện như không ngụ ý người/brand trong ảnh bảo trợ sản phẩm. [Pexels License](https://www.pexels.com/license/).

**4 ảnh đồ ăn được tạo mới bằng AI:** avocado-breakfast, salmon-grain-bowl, shrimp-avocado-salad, chicken-rice có prompt và ghi nhận công cụ. Đây là hồ sơ tạo ảnh, không phải chứng nhận độc quyền hay bảo đảm không có quyền bên thứ ba. **Ảnh bát ăn đã xóa tay** có chuỗi chỉnh sửa rõ nhưng đầu vào đi từ ảnh người dùng qua bản AI chỉnh góc nhìn; vẫn cần xác nhận quyền đối với ảnh đầu vào. Điều khoản OpenAI quy định quyền Output giữa người dùng và OpenAI trong phạm vi luật cho phép, đồng thời người dùng phải có các quyền cần thiết cho Input. [OpenAI Terms, mục Content](https://openai.com/policies/row-terms-of-use/).

**Logo/mascot/gradient/UI Dietfit:** có provenance từ Figma/capture cho nhiều file. Cần giữ hồ sơ sở hữu/chuyển giao nội bộ; ảnh stock nằm bên trong thiết kế phải kiểm tra riêng. Figma giữ quyền Customer Content cho khách hàng theo quan hệ giữa Figma và khách hàng, không cấp thêm quyền của một nhiếp ảnh gia bên thứ ba. [Figma Terms, mục 2.8](https://www.figma.com/legal/tos/).

**Logo bên thứ ba:** kiểm tra đúng brand guideline, ngữ cảnh và quyền liên quan. Ví dụ hướng dẫn Apple phân biệt word mark, logo và ảnh sản phẩm, có các giới hạn về quảng cáo/endorsement; không áp dụng một quy tắc chung cho mọi logo. [Apple guidelines](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html).

**YouTube:** điều khoản có quyền sử dụng qua các chức năng như playback/embed; không tự động cấp quyền dùng nội dung độc lập ngoài dịch vụ. Vì vậy cần làm rõ provenance của thumbnail và video social tải về. [YouTube Terms, mục Your Content and Conduct](https://www.youtube.com/static?template=terms).

## Bằng chứng trực quan quan trọng

- [About dinner — thấy watermark TVCBOOK](/Users/vunguyen/Desktop/prj-dietfit-landingpage/assets/about-photos/dinner-shelf-crisp.webp).
- [Home EN footer — thấy bao bì và logo McDonald’s](/Users/vunguyen/Desktop/prj-dietfit-landingpage/landing/v3/images/final-cta-us-en-user-photo.webp).
- [Home EN before](/Users/vunguyen/Desktop/prj-dietfit-landingpage/landing/v3/images/progress-en-before.webp) và [after](/Users/vunguyen/Desktop/prj-dietfit-landingpage/landing/v3/images/progress-en-after.webp).

## Thứ tự xử lý đề xuất

1. Đối chiếu các nguồn internet đã tìm được với hồ sơ từ người cung cấp ảnh. Chưa yêu cầu thay/xóa ảnh chỉ vì không có chứng từ trong repo.
2. Xác nhận giấy phép ảnh gốc trong Figma; quyền dùng chân dung team và 5 ảnh Blog còn lại. Lưu record Pexels cho Blog 06.
3. Hoàn thiện attribution Nutrition5k; rà guideline của logo đối thủ/tích hợp theo từng trường hợp.
4. Tập trung hồ sơ cho mỗi ảnh: người tạo/chủ sở hữu, URL gốc/stock ID, license/hóa đơn, phạm vi dùng/chỉnh sửa, thời hạn, quyền hình người, các bản dẫn xuất và SHA-256.

## File kiểm kê

- [CSV: mỗi đường dẫn, trang sử dụng, mức ưu tiên, bằng chứng, nguồn và việc cần làm](inventory.csv).
- [JSON inventory](inventory.json).
- [Browser evidence desktop](live-usage.json), [mobile](mobile-usage.json).
- [Thống kê](summary.json).

Các kết luận “chưa có hồ sơ” chỉ phản ánh dữ liệu đã kiểm tra trong dự án; không loại trừ việc Dietfit đang giữ giấy phép/hợp đồng ở nơi khác. Không tự cấp nhãn “được phép dùng” cho một ảnh chỉ từ việc ảnh xuất hiện công khai hoặc được chuyển qua AI.
