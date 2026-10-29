from pathlib import Path
import json,html
root=Path('/Users/vunguyen/Desktop/prj-dietfit-landingpage');out=root/'docs/image-rights-audit-2026-10-29'
records=json.loads((out/'inventory.json').read_text());summary=json.loads((out/'summary.json').read_text())
def link(label,path):return f'[{label}]({root/path})'
report=f'''# Rà soát nguồn và quyền sử dụng hình ảnh Dietfit

Ngày kiểm tra: **29/10/2026**. Phạm vi là bản local tại `http://127.0.0.1:4180`, không phải kiểm toán bản production đang deploy.

**Kết luận:** chưa đủ hồ sơ để xác nhận toàn bộ ảnh đang dùng đã được cấp quyền thương mại. Các mục bên dưới chỉ ra bằng chứng có/thiếu trong dự án, không kết luận các ảnh chắc chắn vi phạm. Giấy phép, hợp đồng và sự đồng ý có thể đang được giữ ngoài repo.

## Phạm vi và phương pháp

- Kiểm tra 8 route chính: `/`, `/en/`, `/vi/`, `/about-us/`, `/en/about-us/`, `/blog/`, `/en/blog/`, `/en/benchmarks/`.
- Browser tại desktop 1440px và mobile 390px; cuộn toàn trang để kích hoạt lazy loading. Thu thập `<img>`, responsive `srcset`, background/mask CSS và video poster.
- Kiểm tra ảnh Open Graph/Twitter của **{summary['metadata_pages']} trang HTML public**. Ảnh của 6 bài Blog cũng xuất hiện trong hai trang danh sách; không mở từng bài bằng browser.
- Tổng **{summary['url_count']} đường dẫn ảnh/đồ họa**, gồm **{summary['local_unique_hashes']} nội dung file local phân biệt theo SHA-256** và **{summary['external_count']} URL ngoài**. Con số này có icon, SVG, UI export, poster và biến thể độ phân giải; không phải {summary['url_count']} ảnh chụp độc lập.
- Đối chiếu file nguồn `source.md`, `source.json`, prompt, capture manifest, hash và giấy phép công khai của nhà cung cấp. Không suy ra giấy phép chỉ từ tên file `user-photo`, file Figma hay ảnh đã chỉnh AI.
- Không thay/xóa ảnh hoặc chỉnh giao diện trong lần kiểm tra này. Chỉ tạo hồ sơ audit.

Giới hạn: chưa kiểm tra từng frame trong video, mọi ảnh nhúng bên trong `.riv`/canvas, các trạng thái UI không xuất hiện trong lượt chạy, hoặc các hợp đồng bên ngoài dự án. URL OG của Benchmarks còn trỏ tới `https://dev.dietfit.health/og/benchmarks-en.jpg`; đã ghi nhận tham chiếu nhưng chưa xác minh nội dung/quyền ảnh remote đó.

## Các mục ưu tiên

| Ưu tiên | Nhóm đang dùng | Bằng chứng tìm thấy | Còn thiếu / hướng xử lý |
| --- | --- | --- | --- |
| P1 | Ảnh “What’s for dinner tonight?” trên About VI/EN | Ảnh người dùng gửi; watermark **TVCBOOK** vẫn có trên bản đang chạy | Tác giả/chủ sở hữu, giấy phép dùng website/quảng cáo. Nếu không có thì thay ảnh có quyền; không xóa watermark để coi là đã có quyền. |
| P1 | **9 ảnh người/ảnh tham khảo trong card Home**, dùng ở EN và VI | Hồ sơ ghi dùng ImageGen để sửa ảnh tham khảo, giữ người/pose/cảnh | License ảnh gốc và phạm vi cho phép chỉnh sửa/dùng thương mại; quyền dùng hình người nếu cần. Có prompt không thay thế chứng từ nguồn. |
| P1 | Ảnh footer Home EN | File `final-cta-us-en-user-photo.webp`, thấy bao bì và logo **McDonald’s** | Chưa có tác giả/campaign/stock ID hoặc quyền dùng ảnh trong marketing Dietfit. Không khẳng định McDonald’s là chủ ảnh chỉ vì logo xuất hiện. |
| P1 | **4 file before/after** ở EN và VI | Ảnh người đang chạy được kiểm tra trực quan; không trùng hồ sơ ảnh AI `-v1` cũ | Quyền ảnh, đồng ý của người xuất hiện và căn cứ cho việc dùng như case khách hàng. Chưa thể xác nhận chỉ dựa vào file được người dùng cung cấp. |
| P1 | Ảnh/video social Nguyễn Trà My và thumbnail YouTube ở VI | File local social và URL YouTube đã nhận diện | Quyền tái sử dụng marketing/consent. Phân biệt embed được nền tảng cho phép với tải/copy ảnh/video ra ngoài nền tảng. |
| P2 | **7 nguồn ảnh About từ Figma** (8 file đang dùng do hero có 2 độ phân giải) | Có Figma node và ngày export | Tác giả/stock ID/giấy phép ảnh gốc; export từ Figma không phải chứng từ cấp quyền ảnh. |
| P2 | **6 ảnh Blog**, **16 chân dung team** | File đang dùng, tên team và vị trí hiển thị | Blog: tác giả/stock license. Team: quyền ảnh và chấp thuận dùng trên website; không mặc định team chưa đồng ý, chỉ chưa có hồ sơ trong repo. |
| P2 | Ảnh footer VI, banner community, ảnh nhúng trong product/demo/UI export | Có file/capture, một số lớp UI từ Figma | Truy nguyên từng lớp ảnh và hồ sơ nguồn. |
| P2 | Logo app đối thủ và logo tích hợp | Có URL artwork chính thức cho nhiều logo | Rà guideline của từng brand cho đúng mục đích so sánh/tích hợp. URL chính thức không chứng minh quyền marketing không giới hạn. |

P1/P2/P3 là mức ưu tiên bổ sung hồ sơ, **không phải kết luận vi phạm pháp luật**.

## 9 ảnh card Home cần đối chiếu giấy phép đầu vào

'''
for r in records:
 if r['group']=='AI-edit-reference':
  p=r['path'].lstrip('/');report+=f'- {link(Path(p).name,p)} — hồ sơ: {link("source",r["source"])}.\n'
report+='''
Các hồ sơ mô tả chỉnh sửa giữ người/pose/cảnh; riêng hồ sơ Apple Health còn có câu yêu cầu gỡ watermark/nhãn trong prompt. Đây là chỉ dấu cần kiểm tra ảnh tham khảo gốc, chưa chứng minh file đang dùng có hoặc không có giấy phép. Không tìm thấy giấy phép stock, hóa đơn hay văn bản cho phép tương ứng trong repo.

## Những nguồn có hồ sơ rõ hơn

**Nutrition5k:** nhà phát hành công bố dữ liệu theo CC BY 4.0, cho phép cả sử dụng thương mại. Trang benchmark đã ghi © Google Research, CC BY 4.0 và Thames et al. Tuy nhiên, cần đối chiếu `plate_1563216440.jpg` với file dataset gốc, thêm liên kết trực tiếp tới license và ghi rõ chú thích/overlay của Dietfit nếu có chỉnh sửa. [Nguồn dataset](https://github.com/google-research-datasets/Nutrition5k), [điều kiện CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Pexels:** `assets/cards/vi-real/source.json` và `assets/cards/habits/source.json` có các record stock/tác giả/license, nhưng những ảnh Pexels đó **không nằm trong inventory ảnh đang dùng** của các route đã rà. Không dùng chúng để kết luận bộ card hiện tại đã được cấp phép. Pexels cho phép dùng và chỉnh ảnh trên website/marketing, nhưng có điều kiện như không ngụ ý người/brand trong ảnh bảo trợ sản phẩm. [Pexels License](https://www.pexels.com/license/).

**4 ảnh đồ ăn được tạo mới bằng AI:** avocado-breakfast, salmon-grain-bowl, shrimp-avocado-salad, chicken-rice có prompt và ghi nhận công cụ. Đây là hồ sơ tạo ảnh, không phải chứng nhận độc quyền hay bảo đảm không có quyền bên thứ ba. **Ảnh bát ăn đã xóa tay** có chuỗi chỉnh sửa rõ nhưng đầu vào đi từ ảnh người dùng qua bản AI chỉnh góc nhìn; vẫn cần xác nhận quyền đối với ảnh đầu vào. Điều khoản OpenAI quy định quyền Output giữa người dùng và OpenAI trong phạm vi luật cho phép, đồng thời người dùng phải có các quyền cần thiết cho Input. [OpenAI Terms, mục Content](https://openai.com/policies/row-terms-of-use/).

**Logo/mascot/gradient/UI Dietfit:** có provenance từ Figma/capture cho nhiều file. Cần giữ hồ sơ sở hữu/chuyển giao nội bộ; ảnh stock nằm bên trong thiết kế phải kiểm tra riêng. Figma giữ quyền Customer Content cho khách hàng theo quan hệ giữa Figma và khách hàng, không cấp thêm quyền của một nhiếp ảnh gia bên thứ ba. [Figma Terms, mục 2.8](https://www.figma.com/legal/tos/).

**Logo bên thứ ba:** kiểm tra đúng brand guideline, ngữ cảnh và quyền liên quan. Ví dụ hướng dẫn Apple phân biệt word mark, logo và ảnh sản phẩm, có các giới hạn về quảng cáo/endorsement; không áp dụng một quy tắc chung cho mọi logo. [Apple guidelines](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html).

**YouTube:** điều khoản có quyền sử dụng qua các chức năng như playback/embed; không tự động cấp quyền dùng nội dung độc lập ngoài dịch vụ. Vì vậy cần làm rõ provenance của thumbnail và video social tải về. [YouTube Terms, mục Your Content and Conduct](https://www.youtube.com/static?template=terms).

## Bằng chứng trực quan quan trọng

'''
report+=f'- {link("About dinner — thấy watermark TVCBOOK","assets/about-photos/dinner-shelf-crisp.webp")}.\n'
report+=f'- {link("Home EN footer — thấy bao bì và logo McDonald’s","landing/v3/images/final-cta-us-en-user-photo.webp")}.\n'
report+=f'- {link("Home EN before","landing/v3/images/progress-en-before.webp")} và {link("after","landing/v3/images/progress-en-after.webp")}.\n'
report+='''
## Thứ tự xử lý đề xuất

1. Lấy chứng từ nguồn hoặc thay ảnh TVCBOOK, 9 ảnh tham khảo đã AI sửa, ảnh footer EN, before/after và social UGC.
2. Xác nhận giấy phép ảnh gốc trong Figma; quyền dùng chân dung team và ảnh Blog.
3. Hoàn thiện attribution Nutrition5k; rà guideline của logo đối thủ/tích hợp theo từng trường hợp.
4. Tập trung hồ sơ cho mỗi ảnh: người tạo/chủ sở hữu, URL gốc/stock ID, license/hóa đơn, phạm vi dùng/chỉnh sửa, thời hạn, quyền hình người, các bản dẫn xuất và SHA-256.

## File kiểm kê

- [CSV: mỗi đường dẫn, trang sử dụng, mức ưu tiên, bằng chứng, nguồn và việc cần làm](inventory.csv).
- [JSON inventory](inventory.json).
- [Browser evidence desktop](live-usage.json), [mobile](mobile-usage.json).
- [Thống kê](summary.json).

Các kết luận “chưa có hồ sơ” chỉ phản ánh dữ liệu đã kiểm tra trong dự án; không loại trừ việc Dietfit đang giữ giấy phép/hợp đồng ở nơi khác. Không tự cấp nhãn “được phép dùng” cho một ảnh chỉ từ việc ảnh xuất hiện công khai hoặc được chuyển qua AI.
'''
(out/'report.md').write_text(report)

# Apply the later internet verification to the initial repository inventory report.
report=report.replace("**Kết luận:** chưa đủ hồ sơ để xác nhận toàn bộ ảnh đang dùng đã được cấp quyền thương mại.", "**Trạng thái:** đang xác minh theo từng ảnh. Đã đối chiếu thêm nguồn công khai; có ảnh tìm được license phù hợp và có ảnh còn là ứng viên. Không kết luận thiếu quyền từ việc thiếu hồ sơ trong repo.")
report=report.replace("## Các mục ưu tiên", "## Các mục cần bổ sung hồ sơ nội bộ")
report=report.replace("Không khẳng định McDonald’s là chủ ảnh chỉ vì logo xuất hiện.", "Đã tìm được đúng ảnh tại thông cáo McDonald’s; xem phần đối chiếu internet ở trên.")
report=report.replace("Chưa có tác giả/campaign/stock ID hoặc quyền dùng ảnh trong marketing Dietfit.", "Nguồn công khai ghi McDonald’s Deutschland; điều kiện công khai là biên tập, chưa xác minh hợp đồng marketing riêng.")
report=report.replace("Ảnh người dùng gửi; watermark **TVCBOOK** vẫn có trên bản đang chạy", "Ảnh người dùng gửi, có watermark TVCBOOK; có đầu mối campaign Midea nhưng chưa khớp chính frame")
report=report.replace("Nếu không có thì thay ảnh có quyền; không xóa watermark để coi là đã có quyền.", "Trước tiên khớp nguồn và đối chiếu thỏa thuận của người cung cấp; watermark không xác định chủ ảnh.")
report=report.replace("**6 ảnh Blog**, **16 chân dung team**", "**5 ảnh Blog chưa khớp nguồn gốc**, **16 chân dung team**")
report=report.replace("Blog: tác giả/stock license.", "Blog 06 đã khớp Pexels; 5 ảnh còn lại cần truy nguyên, Blog 02 có ứng viên cùng bố cục.")
report=report.replace("1. Lấy chứng từ nguồn hoặc thay ảnh TVCBOOK, 9 ảnh tham khảo đã AI sửa, ảnh footer EN, before/after và social UGC.", "1. Đối chiếu các nguồn internet đã tìm được với hồ sơ từ người cung cấp ảnh. Chưa yêu cầu thay/xóa ảnh chỉ vì không có chứng từ trong repo.")
report=report.replace("quyền dùng chân dung team và ảnh Blog.", "quyền dùng chân dung team và 5 ảnh Blog còn lại. Lưu record Pexels cho Blog 06.")
report=report.replace("## Phạm vi và phương pháp", "## Nhãn đọc nhanh trên gallery\n\n- **Có bản quyền · được dùng theo license:** Blog 06, khớp Pexels 6954181.\n- **Có bản quyền · quyền dùng marketing chưa xác minh:** ảnh footer McDonald’s.\n- **Có license · cần đối chiếu:** ảnh tham chiếu Nutrition5k; cần khớp file dataset gốc và ghi nguồn.\n- **Chưa xác định bản quyền:** các ảnh còn thiếu bằng chứng. Không đổi nhãn này thành không bản quyền.\n\nChưa xác nhận ảnh public domain/CC0 trong phạm vi đã rà. Người dùng cho biết đa số ảnh tìm từ Pinterest; chưa có mapping Pin URL tới từng file. Pinterest không tự cấp quyền tái sử dụng ảnh trên website: [hướng dẫn bản quyền của Pinterest](https://help.pinterest.com/en/article/copyright). Gallery chỉ hiển thị nhãn và ghi chú ngắn; bằng chứng được thu gọn. CSV có hai cột riêng `copyright_label` và `usage_label`.\n\n## Phạm vi và phương pháp", 1)
web=(out/'internet-verification.md').read_text()
anchor="## Phạm vi và phương pháp"
report=report.replace(anchor,web.replace("# Đối chiếu internet — 29/10/2026","## Bổ sung: đối chiếu internet — 29/10/2026")+"\n\n"+anchor,1)
(out/'report.md').write_text(report)
# Public source evidence is rendered separately, so later builds stay reproducible.
import runpy
runpy.run_path(str(out/'render-web-gallery.py'))
print('Updated report, inventory, and source comparison gallery')
